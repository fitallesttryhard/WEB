import { supabase } from './supabaseClient';

export interface ProductData {
  id?: string;
  tenant_id?: string;
  category_id?: string | null;
  name: string;
  slug: string;
  original_price: number;
  is_hot?: boolean;
  status?: 'draft' | 'published' | 'archived' | 'out_of_stock';
  thumbnail_url?: string;
  gallery_urls?: string[];
  short_description?: string;
  html_content?: string;
}

export interface GetProductsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  tenantId?: string;
  categoryId?: string;
  search?: string;
}

/**
 * 1. Lấy danh sách sản phẩm với phân trang (limit, offset) và lọc theo status ('published')
 * @param options.limit Số lượng sản phẩm trên mỗi trang (mặc định: 10)
 * @param options.offset Vị trí bắt đầu lấy (mặc định: 0)
 * @param options.status Trạng thái sản phẩm (mặc định: 'published')
 * @param options.tenantId Cửa hàng cụ thể (dành cho Client-side chưa login)
 */
export async function getProducts(options: GetProductsOptions = {}) {
  const {
    limit = 10,
    offset = 0,
    status = 'published',
    tenantId,
    categoryId,
    search,
  } = options;

  try {
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)', { count: 'exact' });

    // 1. Filter theo trạng thái xuất bản
    if (status) {
      query = query.eq('status', status);
    }

    // 2. Filter theo tenant_id (Trường hợp xem Storefront công khai phía Client-side)
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    // 3. Filter theo danh mục (nếu có)
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    // 4. Tìm kiếm theo tên sản phẩm (nếu có)
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // 5. Phân trang sử dụng .range(from, to)
    const from = offset;
    const to = offset + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      success: true,
      data: data || [],
      count: count || 0,
      limit,
      offset,
      hasMore: count ? from + (data?.length || 0) < count : false,
    };
  } catch (error: any) {
    console.error('Lỗi getProducts:', error.message || error);
    return {
      success: false,
      error: error.message || error,
      data: [],
      count: 0,
    };
  }
}

/**
 * 2. Thêm sản phẩm mới (Create)
 * @param productData Dữ liệu sản phẩm mới
 */
export async function createProduct(productData: ProductData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Lỗi createProduct:', error.message || error);
    return {
      success: false,
      error: error.message || error,
    };
  }
}

/**
 * 3. Cập nhật sản phẩm (Update)
 * @param id ID của sản phẩm cần sửa
 * @param productData Thông tin sản phẩm cần cập nhật
 */
export async function updateProduct(id: string, productData: Partial<ProductData>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error(`Lỗi updateProduct (${id}):`, error.message || error);
    return {
      success: false,
      error: error.message || error,
    };
  }
}

/**
 * 4. Xóa sản phẩm (Delete)
 * @param id ID của sản phẩm cần xóa
 */
export async function deleteProduct(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error(`Lỗi deleteProduct (${id}):`, error.message || error);
    return {
      success: false,
      error: error.message || error,
    };
  }
}
