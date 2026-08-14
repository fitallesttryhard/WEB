-- ============================================================================
-- S-BUILD SUPABASE DATABASE INITIALIZATION & RLS POLICIES FIX
-- Copy toàn bộ đoạn mã SQL này và dán vào Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

-- 1. Tạo Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bảng TENANTS
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL DEFAULT 'S-BUILD Store',
    subdomain VARCHAR(100) UNIQUE DEFAULT 'sbuild',
    custom_domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tạo tenant mặc định nếu chưa có
INSERT INTO tenants (id, name, subdomain, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'S-BUILD Vật Tư Xây Dựng', 'sbuild', 'active')
ON CONFLICT (id) DO NOTHING;

-- 3. Bảng TENANT_SETTINGS
CREATE TABLE IF NOT EXISTS tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    company_name VARCHAR(255) DEFAULT 'S-BUILD Vật Tư Xây Dựng',
    hotline VARCHAR(50) DEFAULT '0901 234 567',
    address TEXT DEFAULT 'Số 123 Đường Kiến Trúc, TP. HCM',
    brand_color VARCHAR(50) DEFAULT '#dc2626',
    logo_url TEXT,
    footer_config JSONB DEFAULT '{}'::jsonb,
    socials JSONB DEFAULT '{}'::jsonb,
    banners JSONB DEFAULT '[]'::jsonb,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Bảng CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add description column if missing
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

-- 5. Bảng PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    original_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(15, 2),
    regular_price NUMERIC(15, 2),
    stock_status VARCHAR(50) DEFAULT 'in_stock',
    is_hot BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    thumbnail_url TEXT,
    image_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    short_description TEXT,
    description TEXT,
    specs TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    html_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on products
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price NUMERIC(15, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS regular_price NUMERIC(15, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_status VARCHAR(50) DEFAULT 'in_stock';
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- 6. Bảng POSTS
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    cover_image TEXT,
    excerpt TEXT,
    html_content TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Bảng PAGES
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL DEFAULT 'default',
    html_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PHÂN QUYỀN TRUY CẬP (ENABLE PUBLIC & ANON ACCESS POLICIES)
-- ============================================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid duplicate errors
DROP POLICY IF EXISTS "Allow all for anon and authenticated tenants" ON tenants;
DROP POLICY IF EXISTS "Allow all for anon and authenticated tenant_settings" ON tenant_settings;
DROP POLICY IF EXISTS "Allow all for anon and authenticated categories" ON categories;
DROP POLICY IF EXISTS "Allow all for anon and authenticated products" ON products;
DROP POLICY IF EXISTS "Allow all for anon and authenticated posts" ON posts;
DROP POLICY IF EXISTS "Allow all for anon and authenticated pages" ON pages;

-- Create permissive policies for web & admin dashboard
CREATE POLICY "Allow all for anon and authenticated tenants" ON tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon and authenticated tenant_settings" ON tenant_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon and authenticated categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon and authenticated products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon and authenticated posts" ON posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon and authenticated pages" ON pages FOR ALL USING (true) WITH CHECK (true);
