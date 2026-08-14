-- ==========================================
-- NÂNG CẤP BẢNG PRODUCTS: SEO & ALBUM ẢNH
-- ==========================================

-- 1. Thêm các cột mới vào bảng products
ALTER TABLE products
ADD COLUMN slug VARCHAR(255),
ADD COLUMN thumbnail_url TEXT,
ADD COLUMN gallery_urls TEXT[] DEFAULT '{}', -- Sử dụng mảng chuỗi (array of text) để lưu danh sách link ảnh
ADD COLUMN seo_title VARCHAR(60),
ADD COLUMN seo_description VARCHAR(160);

-- 2. Thêm ràng buộc (Constraint) UNIQUE cho cột slug dựa trên tenant_id
-- Quy tắc này đảm bảo: Hai cửa hàng khác nhau có thể có chung một slug (vd: /ao-thun),
-- nhưng bên trong cùng một cửa hàng (cùng tenant_id) thì slug không được phép trùng lặp.
ALTER TABLE products
ADD CONSTRAINT unique_slug_per_tenant UNIQUE (tenant_id, slug);
