


CREATE DATABASE  babycutie;
USE babycutie;


CREATE TABLE Users (
    id INT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT GETDATE()
);
INSERT INTO Users (id, fullName, email, password, role) VALUES
(1, 'Nguyen Van A', 'a@example.com', '123456', 'user'),
(2, 'Tran Thi B', 'b@example.com', '123456', 'user'),
(3, 'Admin', 'admin@example.com', 'admin123', 'admin');

-- ========================================
-- CATEGORIES TABLE
-- ========================================
CREATE TABLE Categories (
    id INT  PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);
-- Thêm dữ liệu mẫu vào Categories
INSERT INTO Categories (id, name, description) VALUES
(1, 'Cháo Gà', 'Các loại cháo gà dinh dưỡng'),
(2, 'Cháo Bò', 'Cháo bò cung cấp nhiều protein'),
(3, 'Cháo Cá', 'Cháo cá bổ sung omega 3'),
(4, 'Cháo Tôm', 'Cháo tôm giàu canxi'),
(5, 'Cháo Chay', 'Cháo chay thanh đạm cho bé'),
(6, 'Cháo RAU CỦ', 'Cháo RAU CỦ  thanh đạm cho bé');


-- ========================================
-- PRODUCTS TABLE
-- ========================================
CREATE TABLE Products (
    id INT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(MAX),
    price INT NOT NULL,
    category_id INT,
    image VARCHAR(255),
    protein INT DEFAULT 0,
    carb INT DEFAULT 0,
    fat INT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
INSERT INTO Products (id, name, description, price, category_id, image, protein, carb, fat) VALUES
(1, 'Cháo Gà Rau Củ', 'Cháo gà rau củ tươi ngon', 35000, 1, 'ga.jpg', 15, 20, 5),
(2, 'Cháo Gà Bí Đỏ', 'Cháo gà bí đỏ thơm ngọt', 37000, 1, 'ga.jpg', 18, 22, 6),
(3, 'Cháo Bò Hầm', 'Cháo bò hầm mềm dinh dưỡng', 42000, 2, 'bo.jpg', 25, 30, 8),
(4, 'Cháo Cá Hồi', 'Cháo cá hồi giàu omega 3 tốt cho bé', 45000, 3, 'ca.jpg', 20, 18, 10),
(5, 'Cháo Tôm Rong Biển', 'Cháo tôm kết hợp rong biển', 38000, 4, 'tom.jpg', 17, 24, 4),
(6, 'Cháo Chay Hạt Sen', 'Cháo chay hạt sen bổ dưỡng', 30000, 5, 'chay1.gif', 10, 22, 2);



-- ========================================
-- ORDERS TABLE
-- ========================================
CREATE TABLE Orders (
    id INT PRIMARY KEY,
    user_id INT,
    total INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO Orders (id, user_id, total, status) VALUES
(1, 1, 105000, 'pending'),
(2, 2, 75000, 'completed'),
(3, 1, 45000, 'cancelled');

-- ========================================
-- ORDER ITEMS TABLE
-- ========================================
CREATE TABLE OrderItems (
    id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO OrderItems (id, order_id, product_id, quantity, price) VALUES
(1, 1, 1, 2, 70000),
(2, 1, 2, 1, 37000),
(3, 2, 3, 1, 42000),
(4, 3, 6, 1, 30000);
-- ========================================
-- CONTACTS TABLE
-- ========================================
CREATE TABLE Contacts (
    id INT PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
INSERT INTO Contacts (id, name, email, message) VALUES
(1, 'Pham Van C', 'c@example.com', 'Tôi muốn hỏi về thực đơn cho bé 1 tuổi'),
(2, 'Le Thi D', 'd@example.com', 'Làm sao để đặt cháo giao tận nhà?'),
(3, 'Nguyen Van E', 'e@example.com', 'Có chương trình khuyến mãi không?');
-- ========================================
-- ADMIN LOGS TABLE
-- ========================================
CREATE TABLE AdminLogs (
    id INT PRIMARY KEY,
    admin_id INT,
    action NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (admin_id) REFERENCES Users(id)
);




