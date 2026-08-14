-- Thêm các cột chi tiết sản phẩm và thông số kỹ thuật vào bảng products
ALTER TABLE products
ADD COLUMN description TEXT,
ADD COLUMN specs TEXT,
ADD COLUMN sku VARCHAR(100),
ADD COLUMN regular_price DECIMAL(12, 2),
ADD COLUMN sale_price DECIMAL(12, 2),
ADD COLUMN stock_status VARCHAR(50) DEFAULT 'in_stock',
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN status VARCHAR(50) DEFAULT 'published';
