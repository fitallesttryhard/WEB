-- ============================================================================
-- SUPABASE / POSTGRESQL MULTI-TENANT B2B SAAS DATABASE SCHEMA
-- ============================================================================
-- Tác giả: Database Architect (Supabase & PostgreSQL)
-- Kiến trúc: Multi-tenant dựa trên Cột (Column-based Multi-tenancy with tenant_id)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. DỌN DẸP / RESET BẢNG CŨ (Đảm bảo chạy lại script không bị lỗi cấu trúc cũ)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tenant_settings CASCADE;
DROP TABLE IF EXISTS tenant_users CASCADE;
DROP TABLE IF EXISTS site_statistics CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- ----------------------------------------------------------------------------
-- 1. KHỞI TẠO EXTENSIONS BẮT BUỘC
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 2. BẢNG TENANTS (Quản lý các Cửa hàng / Khách hàng B2B)
-- ----------------------------------------------------------------------------
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'inactive', 'suspended', 'trial')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE tenants IS 'Chứa thông tin danh sách các gian hàng / cửa hàng thuê nền tảng B2B SaaS';
COMMENT ON COLUMN tenants.subdomain IS 'Subdomain duy nhất định danh cửa hàng (ví dụ: store1.saas.com)';
COMMENT ON COLUMN tenants.custom_domain IS 'Domain tùy chỉnh do tenant sở hữu (ví dụ: mybrand.com)';

-- ----------------------------------------------------------------------------
-- 3. BẢNG TENANT_USERS (Liên kết Người dùng auth.users với Tenant)
-- ----------------------------------------------------------------------------
-- Bảng này ánh xạ giữa tài khoản người dùng của Supabase Auth (auth.users) và Tenant.
CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member' 
        CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tenant_user UNIQUE (tenant_id, user_id)
);

COMMENT ON TABLE tenant_users IS 'Quản lý phân quyền và phân bổ người dùng (auth.users) vào các tenant';

-- ----------------------------------------------------------------------------
-- 4. BẢNG TENANT_SETTINGS (Cấu hình giao diện & Thương hiệu)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    brand_color VARCHAR(50) DEFAULT '#000000',
    logo_url TEXT,
    footer_config JSONB DEFAULT '{}'::jsonb,
    socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE tenant_settings IS 'Cấu hình giao diện, màu sắc, logo và liên kết mạng xã hội theo từng tenant';

-- ----------------------------------------------------------------------------
-- 5. BẢNG CATEGORIES (Danh mục sản phẩm)
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Đảm bảo slug là duy nhất TRONG CÙNG CỬA HÀNG (tenant_id)
    CONSTRAINT unique_category_slug_per_tenant UNIQUE (tenant_id, slug)
);

COMMENT ON TABLE categories IS 'Danh mục sản phẩm của cửa hàng (phân lập theo tenant_id)';

-- ----------------------------------------------------------------------------
-- 6. BẢNG PRODUCTS (Danh sách sản phẩm)
-- ----------------------------------------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    original_price NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (original_price >= 0),
    is_hot BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'published' 
        CHECK (status IN ('draft', 'published', 'archived', 'out_of_stock')),
    thumbnail_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    short_description TEXT,
    html_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Đảm bảo slug sản phẩm duy nhất theo tenant
    CONSTRAINT unique_product_slug_per_tenant UNIQUE (tenant_id, slug)
);

COMMENT ON TABLE products IS 'Bảng quản lý sản phẩm thuộc sở hữu của tenant';

-- ----------------------------------------------------------------------------
-- 7. BẢNG POSTS (Bài viết / Tin tức / Dự án)
-- ----------------------------------------------------------------------------
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    cover_image TEXT,
    excerpt TEXT,
    html_content TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_post_slug_per_tenant UNIQUE (tenant_id, slug)
);

COMMENT ON TABLE posts IS 'Tin tức, dự án và bài viết blog của tenant';

-- ----------------------------------------------------------------------------
-- 8. BẢNG PAGES (Các trang tĩnh)
-- ----------------------------------------------------------------------------
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL DEFAULT 'default',
    html_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_page_slug_per_tenant UNIQUE (tenant_id, slug)
);

COMMENT ON TABLE pages IS 'Trang tĩnh như Về chúng tôi, Điều khoản, Liên hệ... theo từng tenant';


-- ============================================================================
-- CHIẾN LƯỢC ĐÁNH CHỈ SỐ (INDEXING STRATEGY)
-- ============================================================================
CREATE INDEX idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX idx_tenant_users_tenant_id ON tenant_users(tenant_id);

CREATE INDEX idx_categories_tenant_id ON categories(tenant_id);
CREATE INDEX idx_categories_tenant_slug ON categories(tenant_id, slug);

CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_tenant_slug ON products(tenant_id, slug);
CREATE INDEX idx_products_tenant_status ON products(tenant_id, status);

CREATE INDEX idx_posts_tenant_id ON posts(tenant_id);
CREATE INDEX idx_posts_tenant_slug ON posts(tenant_id, slug);

CREATE INDEX idx_pages_tenant_id ON pages(tenant_id);
CREATE INDEX idx_pages_tenant_slug ON pages(tenant_id, slug);


-- ============================================================================
-- TRIGGER TỰ ĐỘNG CẬP NHẬT UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_modtime BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_settings_modtime BEFORE UPDATE ON tenant_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_modtime BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- HÀM BẢO MẬT TRỢ GIÚP RLS (HELPER FUNCTION)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_tenant_member(check_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.tenant_users 
        WHERE tenant_id = check_tenant_id 
          AND user_id = auth.uid()
    );
$$;

COMMENT ON FUNCTION public.is_tenant_member IS 'Kiểm tra xem auth.uid() hiện tại có thuộc tenant_id chỉ định không';


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - BẢO MẬT PHÂN LẬP TENANT
-- ============================================================================

-- 1. BẬT RLS CHO TẤT CẢ CÁC BẢNG (BẮT BUỘC)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- CHÍNH SÁCH RLS: TENANTS
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read active tenants"
    ON tenants FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users view own tenant"
    ON tenants FOR SELECT
    TO authenticated
    USING (public.is_tenant_member(id));

CREATE POLICY "Tenant members update own tenant"
    ON tenants FOR UPDATE
    TO authenticated
    USING (public.is_tenant_member(id))
    WITH CHECK (public.is_tenant_member(id));


-- ----------------------------------------------------------------------------
-- CHÍNH SÁCH RLS: TENANT_USERS
-- ----------------------------------------------------------------------------
CREATE POLICY "Users view members of their tenant"
    ON tenant_users FOR SELECT
    TO authenticated
    USING (public.is_tenant_member(tenant_id) OR user_id = auth.uid());

CREATE POLICY "Tenant admins insert members"
    ON tenant_users FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tenant_users 
            WHERE tenant_id = tenant_users.tenant_id 
              AND user_id = auth.uid() 
              AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Tenant admins update members"
    ON tenant_users FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tenant_users 
            WHERE tenant_id = tenant_users.tenant_id 
              AND user_id = auth.uid() 
              AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Tenant admins delete members"
    ON tenant_users FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tenant_users 
            WHERE tenant_id = tenant_users.tenant_id 
              AND user_id = auth.uid() 
              AND role IN ('owner', 'admin')
        )
    );


-- ----------------------------------------------------------------------------
-- CHÍNH SÁCH RLS: TENANT_SETTINGS
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read tenant settings"
    ON tenant_settings FOR SELECT
    USING (true);

CREATE POLICY "Tenant members insert settings"
    ON tenant_settings FOR INSERT
    TO authenticated
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members update settings"
    ON tenant_settings FOR UPDATE
    TO authenticated
    USING (public.is_tenant_member(tenant_id))
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members delete settings"
    ON tenant_settings FOR DELETE
    TO authenticated
    USING (public.is_tenant_member(tenant_id));


-- ----------------------------------------------------------------------------
-- CHÍNH SÁCH RLS: CATEGORIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read categories"
    ON categories FOR SELECT
    USING (true);

CREATE POLICY "Tenant members insert categories"
    ON categories FOR INSERT
    TO authenticated
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members update categories"
    ON categories FOR UPDATE
    TO authenticated
    USING (public.is_tenant_member(tenant_id))
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members delete categories"
    ON categories FOR DELETE
    TO authenticated
    USING (public.is_tenant_member(tenant_id));


-- ----------------------------------------------------------------------------
-- CHÍNH SÁCH RLS: PRODUCTS
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read published products or tenant member read all"
    ON products FOR SELECT
    USING (status = 'published' OR public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members update products"
    ON products FOR UPDATE
    TO authenticated
    USING (public.is_tenant_member(tenant_id))
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members delete products"
    ON products FOR DELETE
    TO authenticated
    USING (public.is_tenant_member(tenant_id));


-- ----------------------------------------------------------------------------
-- CHÍNH SÁCH RLS: POSTS
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read published posts or tenant member read all"
    ON posts FOR SELECT
    USING (is_published = true OR public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members insert posts"
    ON posts FOR INSERT
    TO authenticated
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members update posts"
    ON posts FOR UPDATE
    TO authenticated
    USING (public.is_tenant_member(tenant_id))
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members delete posts"
    ON posts FOR DELETE
    TO authenticated
    USING (public.is_tenant_member(tenant_id));


-- ----------------------------------------------------------------------------
-- CHÍNH SÁCH RLS: PAGES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read pages"
    ON pages FOR SELECT
    USING (true);

CREATE POLICY "Tenant members insert pages"
    ON pages FOR INSERT
    TO authenticated
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members update pages"
    ON pages FOR UPDATE
    TO authenticated
    USING (public.is_tenant_member(tenant_id))
    WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "Tenant members delete pages"
    ON pages FOR DELETE
    TO authenticated
    USING (public.is_tenant_member(tenant_id));
