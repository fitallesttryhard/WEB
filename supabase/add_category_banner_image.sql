-- Ảnh banner riêng cho trang trong danh mục (độc lập với image_url ở trang chủ)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
