import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// 1. Fix state definitions around lines 110-120
const stateTarget = `  const [banners, setBanners] = useState<any[]>([
    { id: 1, image_url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=1200&auto=format&fit=crop', heading: 'Kiến tạo không gian sống', subheading: 'Sbuild - Cùng bạn xây dựng tương lai vững chắc', cta_text: 'Xem dự án', cta_link: '/du-an', status: true, order: 1 }
  const [selectedOrder, setSelectedOrder] = useState<any>(null);`;

const stateReplacement = `  const [banners, setBanners] = useState<any[]>([
    { id: 1, image_url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=1200&auto=format&fit=crop', heading: 'Kiến tạo không gian sống', subheading: 'Sbuild - Cùng bạn xây dựng tương lai vững chắc', cta_text: 'Xem dự án', cta_link: '/du-an', status: true, order: 1 }
  ]);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [selectedPages, setSelectedPages] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedPostCategories, setSelectedPostCategories] = useState<any[]>([]);
  const [categoryForm, setCategoryForm] = useState({ id: null as any, name: '', slug: '', description: '' });
  const [isCategorySlugEdited, setIsCategorySlugEdited] = useState(false);
  const [constructionCategories, setConstructionCategories] = useState<ConstructionCategory[]>(DEFAULT_CONSTRUCTION_CATEGORIES);
  const [constructionCategoryForm, setConstructionCategoryForm] = useState<{ id: string | null; name: string; slug: string; description: string }>({
    id: null,
    name: '',
    slug: '',
    description: ''
  });
  const [selectedConstructionCategories, setSelectedConstructionCategories] = useState<string[]>([]);
  const [isConstructionSlugEdited, setIsConstructionSlugEdited] = useState(false);
  const [postCategoryForm, setPostCategoryForm] = useState({ id: null as any, name: '', slug: '', description: '' });
  const [isPostCategorySlugEdited, setIsPostCategorySlugEdited] = useState(false);
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);`;

if (content.includes('const [selectedOrder, setSelectedOrder] = useState<any>(null);')) {
  // Check if stateTarget matches with either \r\n or \n
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget = stateTarget.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget)) {
    content = normalizedContent.replace(normalizedTarget, stateReplacement.replace(/\r\n/g, '\n'));
    console.log('Step 1: State variables patched successfully.');
  } else {
    console.warn('Step 1: Normalized target not found, attempting regex replace...');
    const re = /const \[banners, setBanners\][\s\S]*?const \[selectedOrder, setSelectedOrder\]/;
    content = content.replace(re, stateReplacement);
    console.log('Step 1: Replaced with regex.');
  }
}

// 2. Patch fetchData to fetch constructionCategories and map to products
const fetchTarget = `      setCategories(catData || []);`;
const fetchReplacement = `      setCategories(catData || []);

      const ccList = await getConstructionCategories();
      setConstructionCategories(ccList);`;

if (!content.includes('const ccList = await getConstructionCategories()')) {
  content = content.replace(fetchTarget, fetchReplacement);
  console.log('Step 2: fetchData ccList patched.');
}

const prodMapTarget = `          category: p.categories?.name || 'Chưa phân loại',
          categoryId: p.category_id,`;
const prodMapReplacement = `          category: p.categories?.name || 'Chưa phân loại',
          categoryId: p.category_id,
          construction_categories: extractConstructionCategories(p.tags, ccList),`;

if (!content.includes('construction_categories: extractConstructionCategories(p.tags, ccList)')) {
  content = content.replace(prodMapTarget, prodMapReplacement);
  console.log('Step 3: prodData mapping patched.');
}

// 3. Patch handleProductSubmit to encode constructionCategories into tags
const submitStartTarget = `    const selectedCat = categories.find(c => c.id.toString() === formData.categoryId);
    const imageUrl = formData.thumbnailUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=150&auto=format&fit=crop';`;

const submitStartReplacement = `    const selectedCat = categories.find(c => c.id.toString() === formData.categoryId);
    const imageUrl = formData.thumbnailUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=150&auto=format&fit=crop';
    const constructionCats = formData.constructionCategories || [];
    const encodedTags = encodeProductTags(formData.tags, constructionCats);`;

if (!content.includes('const constructionCats = formData.constructionCategories || [];')) {
  content = content.replace(submitStartTarget, submitStartReplacement);
  console.log('Step 4: handleProductSubmit start patched.');
}

const updatedProdTarget = `      const updatedProduct = {
        ...formData,
        id: formData.id,
        category: selectedCat?.name || 'Chưa phân loại',
        is_hot: formData.isHot,`;

const updatedProdReplacement = `      const updatedProduct = {
        ...formData,
        id: formData.id,
        category: selectedCat?.name || 'Chưa phân loại',
        construction_categories: constructionCats,
        is_hot: formData.isHot,`;

if (!content.includes('construction_categories: constructionCats,\n        is_hot: formData.isHot,')) {
  content = content.replace(updatedProdTarget, updatedProdReplacement);
  console.log('Step 5: updatedProduct patched.');
}

const newProdTarget = `      const newProduct = {
        ...formData,
        id: Date.now(),
        category: selectedCat?.name || 'Chưa phân loại',
        is_hot: formData.isHot,`;

const newProdReplacement = `      const newProduct = {
        ...formData,
        id: Date.now(),
        category: selectedCat?.name || 'Chưa phân loại',
        construction_categories: constructionCats,
        is_hot: formData.isHot,`;

if (!content.includes('const newProduct = {\n        ...formData,\n        id: Date.now(),\n        category: selectedCat?.name || \'Chưa phân loại\',\n        construction_categories: constructionCats,')) {
  content = content.replace(newProdTarget, newProdReplacement);
  console.log('Step 6: newProduct patched.');
}

// In supabase update and insert: tags: encodedTags
content = content.replace('tags: formData.tags,\n          description: formData.description,\n          status: formData.status\n        }).eq(\'id\', formData.id)',
  'tags: encodedTags,\n          description: formData.description,\n          status: formData.status\n        }).eq(\'id\', formData.id)');

content = content.replace('tags: formData.tags,\n          description: formData.description,\n          status: formData.status\n        }]);',
  'tags: encodedTags,\n          description: formData.description,\n          status: formData.status\n        }]);');

// 4. Construction Categories CRUD Handlers
const handlersTarget = `  // POST CATEGORIES HANDLERS`;
const handlersToAdd = `  // CONSTRUCTION CATEGORIES (HẠNG MỤC THI CÔNG) HANDLERS
  const handleConstructionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' && !isConstructionSlugEdited) {
      setConstructionCategoryForm(prev => ({ ...prev, name: value, slug: toSlug(value) }));
    } else if (name === 'slug') {
      setIsConstructionSlugEdited(true);
      setConstructionCategoryForm(prev => ({ ...prev, slug: toSlug(value) }));
    } else {
      setConstructionCategoryForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleConstructionCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!constructionCategoryForm.name.trim()) {
      showToast('Vui lòng nhập tên hạng mục thi công!');
      return;
    }
    
    const slug = constructionCategoryForm.slug.trim() || toSlug(constructionCategoryForm.name);
    let updatedList: ConstructionCategory[] = [];

    if (constructionCategoryForm.id) {
      updatedList = constructionCategories.map(c => 
        c.id === constructionCategoryForm.id 
          ? { ...c, name: constructionCategoryForm.name.trim(), slug, description: constructionCategoryForm.description }
          : c
      );
      showToast('Đã cập nhật hạng mục thi công!');
    } else {
      const newCategory: ConstructionCategory = {
        id: 'cc-' + Date.now(),
        name: constructionCategoryForm.name.trim(),
        slug,
        description: constructionCategoryForm.description
      };
      updatedList = [...constructionCategories, newCategory];
      showToast('Đã thêm hạng mục thi công mới!');
    }

    setConstructionCategories(updatedList);
    await saveConstructionCategories(updatedList);
    setConstructionCategoryForm({ id: null, name: '', slug: '', description: '' });
    setIsConstructionSlugEdited(false);
  };

  const handleEditConstructionCategory = (cat: ConstructionCategory) => {
    setConstructionCategoryForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || toSlug(cat.name),
      description: cat.description || ''
    });
    setIsConstructionSlugEdited(true);
  };

  const handleDeleteConstructionCategory = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hạng mục thi công này?')) return;
    const updatedList = constructionCategories.filter(c => c.id !== id);
    setConstructionCategories(updatedList);
    await saveConstructionCategories(updatedList);
    showToast('Đã xóa hạng mục thi công!');
  };

  const handleBulkDeleteConstructionCategories = async () => {
    if (selectedConstructionCategories.length === 0) return;
    if (!confirm(\`Bạn có chắc muốn xóa \${selectedConstructionCategories.length} hạng mục thi công đã chọn?\`)) return;
    const updatedList = constructionCategories.filter(c => !selectedConstructionCategories.includes(c.id));
    setConstructionCategories(updatedList);
    await saveConstructionCategories(updatedList);
    setSelectedConstructionCategories([]);
    showToast(\`Đã xóa \${selectedConstructionCategories.length} hạng mục thi công!\`);
  };

  const handleSelectAllConstructionCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedConstructionCategories(constructionCategories.map(c => c.id));
    else setSelectedConstructionCategories([]);
  };

  const handleSelectConstructionCategory = (id: string) => {
    if (selectedConstructionCategories.includes(id)) {
      setSelectedConstructionCategories(selectedConstructionCategories.filter(cId => cId !== id));
    } else {
      setSelectedConstructionCategories([...selectedConstructionCategories, id]);
    }
  };

  // POST CATEGORIES HANDLERS`;

if (!content.includes('handleConstructionCategorySubmit')) {
  content = content.replace(handlersTarget, handlersToAdd);
  console.log('Step 7: Construction Category handlers inserted.');
}

// 5. Update Products Table: column header and td badges
const thTarget = `<th className="px-6 py-4">Danh mục</th>`;
const thReplacement = `<th className="px-6 py-4">Phân loại & Hạng mục</th>`;
content = content.replace(thTarget, thReplacement);

const tdTarget = `<td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-600">{product.category}</span>
                          </td>`;

const tdReplacement = `<td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5 items-start">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {product.category}
                              </span>
                              {product.construction_categories && product.construction_categories.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {product.construction_categories.map((cc: string, cIdx: number) => (
                                    <span key={cIdx} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                      {cc}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>`;

if (!content.includes('product.construction_categories && product.construction_categories.length > 0')) {
  content = content.replace(tdTarget, tdReplacement);
  console.log('Step 8: Products table cell updated with construction categories.');
}

// 6. Add activeMenu === 'construction_categories' view
const categoriesEndTarget = `            {activeMenu === 'categories' && (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-gray-900">Quản lý Danh mục</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Tạo và phân loại các chuyên mục cho sản phẩm.</p>
                </div>`;

const constructionView = `            {activeMenu === 'construction_categories' && (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Hệ Thống Phân Loại Kép (Dual-Taxonomy)</span>
                  </div>
                  <h1 className="text-2xl font-black text-gray-900">Quản lý Hạng mục Thi công</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    Tạo và quản lý các công đoạn, vị trí thi công áp dụng cho từng dòng vật tư S-BUILD (Ốp lát, Trát tường, Thạch cao...).
                  </p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  
                  {/* Cột Trái: Form Thêm/Sửa */}
                  <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      {constructionCategoryForm.id ? 'Sửa hạng mục thi công' : 'Thêm hạng mục mới'}
                    </h2>
                    <form onSubmit={handleConstructionCategorySubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên hạng mục thi công <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={constructionCategoryForm.name}
                          onChange={handleConstructionFormChange}
                          placeholder="Ví dụ: Ốp lát gạch"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Đường dẫn tĩnh (Slug)</label>
                        <input 
                          type="text" 
                          name="slug"
                          value={constructionCategoryForm.slug}
                          onChange={handleConstructionFormChange}
                          placeholder="op-lat-gach"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium text-gray-600 transition-all"
                        />
                        <p className="text-xs text-gray-400 mt-1.5 font-medium">Định danh URL dùng cho bộ lọc hoặc trang chuyên đề.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả chi tiết</label>
                        <textarea 
                          name="description"
                          value={constructionCategoryForm.description}
                          onChange={handleConstructionFormChange}
                          rows={4}
                          placeholder="Mô tả các sản phẩm hoặc vị trí áp dụng của hạng mục này..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium transition-all resize-none"
                        />
                      </div>
                      <div className="pt-2 flex gap-2">
                        {constructionCategoryForm.id && (
                          <button 
                            type="button"
                            onClick={() => {
                              setConstructionCategoryForm({ id: null, name: '', slug: '', description: '' });
                              setIsConstructionSlugEdited(false);
                            }}
                            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
                          >
                            Hủy
                          </button>
                        )}
                        <button 
                          type="submit"
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(147,51,234,0.2)] cursor-pointer"
                        >
                          {constructionCategoryForm.id ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Cột Phải: Bảng dữ liệu */}
                  <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto flex flex-col">
                    {/* Bulk Action Bar */}
                    {selectedConstructionCategories.length > 0 && (
                      <div className="bg-purple-50 border-b border-purple-100 p-3 flex items-center justify-between animate-in fade-in duration-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-purple-900 bg-white px-2 py-0.5 rounded shadow-sm">{selectedConstructionCategories.length}</span>
                          <span className="text-sm font-bold text-purple-900">mục đang chọn</span>
                        </div>
                        <button onClick={handleBulkDeleteConstructionCategories} className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
                          <Trash2 size={14} /> Xóa đã chọn
                        </button>
                      </div>
                    )}
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                          <th className="px-5 py-4 w-12">
                            <input 
                              type="checkbox" 
                              checked={constructionCategories.length > 0 && selectedConstructionCategories.length === constructionCategories.length}
                              onChange={handleSelectAllConstructionCategories}
                              className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                            />
                          </th>
                          <th className="px-5 py-4">Hạng mục thi công</th>
                          <th className="px-5 py-4">Mô tả ứng dụng</th>
                          <th className="px-5 py-4 text-center">Số sản phẩm</th>
                          <th className="px-5 py-4 text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {constructionCategories.map((cat) => {
                          const count = products.filter(p => Array.isArray(p.construction_categories) && p.construction_categories.includes(cat.name)).length;
                          return (
                            <tr key={cat.id} className={\`transition-colors \${selectedConstructionCategories.includes(cat.id) ? 'bg-purple-50/50' : 'hover:bg-gray-50/50'}\`}>
                              <td className="px-5 py-4">
                                <input 
                                  type="checkbox" 
                                  checked={selectedConstructionCategories.includes(cat.id)}
                                  onChange={() => handleSelectConstructionCategory(cat.id)}
                                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                                />
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                    {cat.name}
                                  </span>
                                  <span className="text-[11px] font-medium text-gray-400 mt-0.5">{cat.slug}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 max-w-[240px]">
                                <p className="text-xs font-medium text-gray-500 line-clamp-2">{cat.description || '—'}</p>
                              </td>
                              <td className="px-5 py-4 text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black">
                                  {count}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button 
                                    onClick={() => handleEditConstructionCategory(cat)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Chỉnh sửa"
                                  >
                                    <Edit size={15} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteConstructionCategory(cat.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Xóa"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {constructionCategories.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-gray-500 font-medium">Chưa có hạng mục thi công nào.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'categories' && (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-gray-900">Quản lý Danh mục</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Tạo và phân loại các chuyên mục cho sản phẩm.</p>
                </div>`;

if (!content.includes("activeMenu === 'construction_categories'")) {
  content = content.replace(categoriesEndTarget, constructionView);
  console.log('Step 9: activeMenu === construction_categories view inserted.');
}

// 7. Pass constructionCategories to ProductFormModal
const modalTarget = `<ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProductSubmit}
        categories={categories}
        initialData={editingProduct}
      />`;

const modalReplacement = `<ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProductSubmit}
        categories={categories}
        constructionCategories={constructionCategories}
        initialData={editingProduct}
      />`;

if (!content.includes('constructionCategories={constructionCategories}')) {
  content = content.replace(modalTarget, modalReplacement);
  console.log('Step 10: ProductFormModal prop passed.');
}

fs.writeFileSync('src/components/AdminDashboard.tsx', content, 'utf8');
console.log('All patches to AdminDashboard.tsx applied successfully!');
