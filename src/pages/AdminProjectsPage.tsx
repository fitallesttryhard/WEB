import React, { useState } from 'react';
import { projectsData, Project } from '../data/projectsData';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Download, 
  Search, 
  Sparkles,
  X,
  CheckCircle2
} from 'lucide-react';

interface AdminProjectsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AdminProjectsPage: React.FC<AdminProjectsPageProps> = ({ setCurrentTab }) => {
  const [projectsList, setProjectsList] = useState<Project[]>(projectsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // FORM STATE
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Xây dựng');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');

  const filteredProjects = projectsList.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      // Edit mode
      setProjectsList(projectsList.map(p => p.id === editingProject.id ? {
        ...p,
        title,
        category,
        description,
        imageUrl,
        link
      } : p));
    } else {
      // Add mode
      const newProj: Project = {
        id: Date.now(),
        title,
        category,
        description,
        imageUrl: imageUrl || '/assets/images/da/ptkn.webp',
        link: link || '#'
      };
      setProjectsList([newProj, ...projectsList]);
    }

    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      setProjectsList(projectsList.filter(p => p.id !== id));
    }
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setLink(p.link);
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Xây dựng');
    setDescription('');
    setImageUrl('');
    setLink('');
    setEditingProject(null);
    setIsAddModalOpen(false);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(projectsList, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('Đã sao chép danh sách dữ án dạng JSON vào bộ nhớ tạm (Clipboard)!');
  };

  return (
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Trang Quản Trị</span>
            <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Danh Sách Dự Án</h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Dữ Liệu JSON</span>
            </button>

            <button 
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Dự Án Mới</span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Lọc dự án theo tên hoặc danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* PROJECTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">STT</th>
                  <th className="p-4">Hình ảnh</th>
                  <th className="p-4">Tên Dự Án</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Mô tả</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="p-4">
                      <div className="w-14 h-10 rounded-lg bg-slate-900 overflow-hidden border border-slate-200">
                        <img 
                          src={p.imageUrl} 
                          alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{p.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 max-w-sm truncate text-slate-500">{p.description}</td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ADD/EDIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => resetForm()}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900">
              {editingProject ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên dự án *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Danh mục *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Xây dựng">Xây dựng</option>
                  <option value="Thương mại điện tử">Thương mại điện tử</option>
                  <option value="Y tế">Y tế</option>
                  <option value="Cơ Khí">Cơ Khí</option>
                  <option value="Nội thất">Nội thất</option>
                  <option value="Thiết bị & Máy móc">Thiết bị & Máy móc</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả dự án</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn hình ảnh (URL / Assets)</label>
                <input 
                  type="text" 
                  placeholder="/assets/images/da/ptkn.webp"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn xem Live Website (Link)</label>
                <input 
                  type="url" 
                  placeholder="https://example.vn"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => resetForm()}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
