const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'baby_cutie_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQL Server Configuration
const sqlConfig = {
    user: 'sa',
    password: 'YourPassword123',
    server: 'localhost',
    database: 'BabyCutie',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Connect to Database
sql.connect(sqlConfig).then(pool => {
    console.log('Connected to SQL Server');
    return pool;
}).catch(err => {
    console.error('Database connection failed:', err);
});

// Auth Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }
    
    jwt.verify(token.replace('Bearer ', ''), SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullname, email, phone, password } = req.body;
        
        // Check if user exists
        const pool = await sql.connect(sqlConfig);
        const checkUser = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');
        
        if (checkUser.recordset.length > 0) {
            return res.json({ success: false, message: 'Email đã tồn tại' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        await pool.request()
            .input('fullname', sql.NVarChar, fullname)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('password', sql.NVarChar, hashedPassword)
            .input('role', sql.NVarChar, 'customer')
            .query('INSERT INTO Users (fullname, email, phone, password, role, created_at) VALUES (@fullname, @email, @phone, @password, @role, GETDATE())');
        
        res.json({ success: true, message: 'Đăng ký thành công' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');
        
        if (result.recordset.length === 0) {
            return res.json({ success: false, message: 'Email không tồn tại' });
        }
        
        const user = result.recordset[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.json({ success: false, message: 'Mật khẩu không đúng' });
        }
        
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        
        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Get Products
app.get('/api/products', async (req, res) => {
    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .query('SELECT * FROM Products WHERE status = 1 ORDER BY created_at DESC');
        
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Products WHERE id = @id');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }
        
        res.json({ success: true, data: result.recordset[0] });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Create Order
app.post('/api/orders', verifyToken, async (req, res) => {
    try {
        const { items, total, delivery_address, phone } = req.body;
        const userId = req.userId;
        
        const pool = await sql.connect(sqlConfig);
        
        // Insert order
        const orderResult = await pool.request()
            .input('user_id', sql.Int, userId)
            .input('total', sql.Decimal(18, 2), total)
            .input('delivery_address', sql.NVarChar, delivery_address)
            .input('phone', sql.NVarChar, phone)
            .input('status', sql.NVarChar, 'pending')
            .query('INSERT INTO Orders (user_id, total, delivery_address, phone, status, created_at) OUTPUT INSERTED.id VALUES (@user_id, @total, @delivery_address, @phone, @status, GETDATE())');
        
        const orderId = orderResult.recordset[0].id;
        
        // Insert order items
        for (const item of items) {
            await pool.request()
                .input('order_id', sql.Int, orderId)
                .input('product_id', sql.Int, item.product_id)
                .input('quantity', sql.Int, item.quantity)
                .input('price', sql.Decimal(18, 2), item.price)
                .query('INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (@order_id, @product_id, @quantity, @price)');
        }
        
        res.json({ success: true, message: 'Đặt hàng thành công', order_id: orderId });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Get User Orders
app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .query('SELECT * FROM Orders WHERE user_id = @user_id ORDER BY created_at DESC');
        
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Get News
app.get('/api/news', async (req, res) => {
    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .query('SELECT * FROM News WHERE status = 1 ORDER BY created_at DESC');
        
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        console.error('Get news error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        const pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('message', sql.NText, message)
            .query('INSERT INTO Contacts (name, email, phone, message, created_at) VALUES (@name, @email, @phone, @message, GETDATE())');
        
        res.json({ success: true, message: 'Gửi liên hệ thành công' });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Admin Routes

// Get All Orders (Admin)
app.get('/api/admin/orders', verifyToken, async (req, res) => {
    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .query(`
                SELECT o.*, u.fullname, u.email 
                FROM Orders o 
                LEFT JOIN Users u ON o.user_id = u.id 
                ORDER BY o.created_at DESC
            `);
        
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        console.error('Get admin orders error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Update Order Status (Admin)
app.put('/api/admin/orders/:id/status', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.NVarChar, status)
            .query('UPDATE Orders SET status = @status WHERE id = @id');
        
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Create Product (Admin)
app.post('/api/admin/products', verifyToken, async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        
        const pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NText, description)
            .input('price', sql.Decimal(18, 2), price)
            .input('category', sql.NVarChar, category)
            .input('image', sql.NVarChar, image)
            .input('status', sql.Int, 1)
            .query('INSERT INTO Products (name, description, price, category, image, status, created_at) VALUES (@name, @description, @price, @category, @image, @status, GETDATE())');
        
        res.json({ success: true, message: 'Tạo sản phẩm thành công' });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});