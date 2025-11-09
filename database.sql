-- Create Database
CREATE DATABASE BabyCutie;
GO

USE BabyCutie;
GO

-- Users Table
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fullname NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) DEFAULT 'customer', -- customer, admin
    status INT DEFAULT 1, -- 1: active, 0: inactive
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME
);

-- Products Table
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NTEXT,
    price DECIMAL(18, 2) NOT NULL,
    category NVARCHAR(50), -- chao-ga, chao-bo, chao-tom, chao-ca
    image NVARCHAR(255),
    status INT DEFAULT 1, -- 1: active, 0: inactive
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME
);

-- Orders Table
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES Users(id),
    total DECIMAL(18, 2) NOT NULL,
    delivery_address NVARCHAR(500),
    phone NVARCHAR(20),
    status NVARCHAR(50) DEFAULT 'pending', -- pending, processing, shipping, completed, cancelled
    notes NTEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME
);

-- Order Items Table
CREATE TABLE OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT FOREIGN KEY REFERENCES Orders(id) ON DELETE CASCADE,
    product_id INT FOREIGN KEY REFERENCES Products(id),
    quantity INT NOT NULL,
    price DECIMAL(18, 2) NOT NULL
);

-- News Table
CREATE TABLE News (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(300) NOT NULL,
    content NTEXT NOT NULL,
    image NVARCHAR(255),
    author NVARCHAR(100),
    category NVARCHAR(50),
    status INT DEFAULT 1, -- 1: published, 0: draft
    views INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME
);

-- Contacts Table
CREATE TABLE Contacts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100),
    phone NVARCHAR(20),
    message NTEXT,
    status INT DEFAULT 0, -- 0: new, 1: replied
    created_at DATETIME DEFAULT GETDATE()
);

-- Categories Table
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NTEXT,
    status INT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

-- Reviews Table
CREATE TABLE Reviews (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT FOREIGN KEY REFERENCES Products(id) ON DELETE CASCADE,
    user_id INT FOREIGN KEY REFERENCES Users(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment NTEXT,
    status INT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

-- Insert Sample Admin User (password: admin123)
INSERT INTO Users (fullname, email, phone, password, role) 
VALUES (
    N'Admin', 
    'admin@babycutie.vn', 
    '0123456789', 
    '$2a$10$XQz.YHNVvx8AQJxhP8YV8ODiHPKc3C8l/qT9Y3O4dZvkBfZCZSNKi',
    'admin'
);

-- Insert Sample Categories
INSERT INTO Categories (name, description) VALUES
(N'Cháo Gà', N'Cháo gà dinh dưỡng cho bé'),
(N'Cháo Bò', N'Cháo bò bổ dưỡng'),
(N'Cháo Cá', N'Cháo cá giàu omega 3'),
(N'Cháo Tôm', N'Cháo tôm tươi ngon'),
(N'Cháo Chay', N'Cháo chay thanh đạm');

-- Insert Sample Products
INSERT INTO Products (name, description, price, category, image) VALUES
(N'Cháo Gà Rau Củ', N'Cháo gà thơm ngon với rau củ tươi, cà rốt, bí đỏ. Giàu protein và vitamin', 35000, 'chao-ga', 'chao-ga-rau-cu.jpg'),
(N'Cháo Bò Bí Đỏ', N'Cháo bò bổ dưỡng kết hợp bí đỏ giàu vitamin A. Tốt cho thị lực của bé', 40000, 'chao-bo', 'chao-bo-bi-do.jpg'),
(N'Cháo Cá Hồi', N'Cháo cá hồi giàu omega 3, DHA tốt cho não bộ và thị lực', 45000, 'chao-ca', 'chao-ca-hoi.jpg'),
(N'Cháo Tôm Rau Ngót', N'Cháo tôm với rau ngót bổ dưỡng, giàu canxi và chất xơ', 38000, 'chao-tom', 'chao-tom-rau-ngot.jpg'),
(N'Cháo Gà Nấm Hương', N'Cháo gà kết hợp nấm hương thơm ngon, tăng cường hệ miễn dịch', 42000, 'chao-ga', 'chao-ga-nam-huong.jpg'),
(N'Cháo Bò Cà Rốt', N'Cháo bò với cà rốt giàu beta-carotene, vitamin A', 40000, 'chao-bo', 'chao-bo-ca-rot.jpg'),
(N'Cháo Cá Diêu Hồng', N'Cháo cá diêu hồng thơm ngon, giàu protein dễ hấp thu', 38000, 'chao-ca', 'chao-ca-dieu-hong.jpg'),
(N'Cháo Tôm Bí Xanh', N'Cháo tôm với bí xanh mát, bổ dưỡng cho bé', 40000, 'chao-tom', 'chao-tom-bi-xanh.jpg'),
(N'Cháo Chay Đậu Hũ', N'Cháo chay thanh đạm với đậu hũ, rau củ hữu cơ', 32000, 'chao-chay', 'chao-chay-dau-hu.jpg'),
(N'Cháo Gà Yến Mạch', N'Cháo gà kết hợp yến mạch giàu chất xơ, tốt cho tiêu hóa', 45000, 'chao-ga', 'chao-ga-yen-mach.jpg');

-- Insert Sample News
INSERT INTO News (title, content, image, author, category) VALUES
(N'Dinh Dưỡng Quan Trọng Trong Giai Đoạn Ăn Dặm', 
 N'Giai đoạn ăn dặm là thời kỳ quan trọng trong sự phát triển của trẻ. Bé cần được cung cấp đầy đủ các dưỡng chất từ protein, vitamin, khoáng chất...', 
 'news1.jpg', 
 N'BS. Nguyễn Văn A', 
 N'Dinh dưỡng'),

(N'Cách Chọn Nguyên Liệu An Toàn Cho Bé', 
 N'Việc lựa chọn nguyên liệu tươi ngon, không hóa chất là điều cực kỳ quan trọng. Mẹ nên chọn các loại rau củ hữu cơ...', 
 'news2.jpg', 
 N'Chuyên gia Lê Thị B', 
 N'Mẹo hay'),

(N'Thực Đơn Ăn Dặm Theo Độ Tuổi', 
 N'Mỗi độ tuổi của bé cần một chế độ dinh dưỡng phù hợp. Dưới đây là thực đơn gợi ý cho từng giai đoạn...', 
 'news3.jpg', 
 N'BS. Trần Văn C', 
 N'Thực đơn');

-- Insert Sample Contacts
INSERT INTO Contacts (name, email, phone, message, status) VALUES
(N'Nguyễn Thị Lan', 'lan@email.com', '0987654321', N'Tôi muốn biết thêm về thực đơn cho bé 8 tháng tuổi', 0),
(N'Trần Văn Nam', 'nam@email.com', '0912345678', N'Làm sao để đặt hàng và giao hàng tận nơi?', 0);

-- Create Indexes for better performance
CREATE INDEX IX_Orders_UserId ON Orders(user_id);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(order_id);
CREATE INDEX IX_OrderItems_ProductId ON OrderItems(product_id);
CREATE INDEX IX_Reviews_ProductId ON Reviews(product_id);
CREATE INDEX IX_News_Status ON News(status);
CREATE INDEX IX_Products_Status ON Products(status);
CREATE INDEX IX_Products_Category ON Products(category);

-- Create Views

-- View for Order Details
CREATE VIEW vw_OrderDetails AS
SELECT 
    o.id AS order_id,
    o.created_at AS order_date,
    o.total,
    o.status,
    o.delivery_address,
    o.phone,
    u.fullname AS customer_name,
    u.email AS customer_email,
    p.name AS product_name,
    oi.quantity,
    oi.price
FROM Orders o
JOIN Users u ON o.user_id = u.id
JOIN OrderItems oi ON o.id = oi.order_id
JOIN Products p ON oi.product_id = p.id;

-- View for Product Reviews
CREATE VIEW vw_ProductReviews AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    AVG(CAST(r.rating AS FLOAT)) AS avg_rating,
    COUNT(r.id) AS review_count
FROM Products p
LEFT JOIN Reviews r ON p.id = r.product_id
WHERE r.status = 1
GROUP BY p.id, p.name;

-- Stored Procedures

-- Procedure to get product statistics
CREATE PROCEDURE sp_GetProductStats
AS
BEGIN
    SELECT 
        p.id,
        p.name,
        p.price,
        p.category,
        COUNT(DISTINCT oi.order_id) AS total_orders,
        SUM(oi.quantity) AS total_sold,
        SUM(oi.quantity * oi.price) AS total_revenue
    FROM Products p
    LEFT JOIN OrderItems oi ON p.id = oi.product_id
    GROUP BY p.id, p.name, p.price, p.category
    ORDER BY total_revenue DESC;
END;

-- Procedure to get monthly revenue
CREATE PROCEDURE sp_GetMonthlyRevenue
    @Year INT,
    @Month INT
AS
BEGIN
    SELECT 
        DAY(created_at) AS day,
        COUNT(*) AS order_count,
        SUM(total) AS daily_revenue
    FROM Orders
    WHERE YEAR(created_at) = @Year 
        AND MONTH(created_at) = @Month
        AND status NOT IN ('cancelled')
    GROUP BY DAY(created_at)
    ORDER BY DAY(created_at);
END;

-- Triggers

-- Trigger to update product stock status
CREATE TRIGGER trg_UpdateOrderTimestamp
ON Orders
AFTER UPDATE
AS
BEGIN
    UPDATE Orders
    SET updated_at = GETDATE()
    WHERE id IN (SELECT id FROM inserted);
END;

-- Trigger to update product timestamp
CREATE TRIGGER trg_UpdateProductTimestamp
ON Products
AFTER UPDATE
AS
BEGIN
    UPDATE Products
    SET updated_at = GETDATE()
    WHERE id IN (SELECT id FROM inserted);
END;

GO
