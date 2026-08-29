import React, { useState } from 'react';
import { projectsData, Project } from '../data/projectsData';
import { 
  Search, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  X,
  ArrowRight,
  Filter
} from 'lucide-react';

interface ProjectsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ setCurrentTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [adminProjects, setAdminProjects] = useState<Project[]>([]);

  const loadProjects = () => {
    try {
      const stored = localStorage.getItem('fitallest_admin_projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted: Project[] = parsed.map((p: any) => ({
            id: p.id || Date.now(),
            title: p.title || 'Dự án mới',
            category: p.category || 'Website',
            imageUrl: p.image || p.imageUrl || p.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
            description: p.description || 'Sản phẩm giải pháp thiết kế website và ứng dụng di động cao cấp.',
            link: p.link || '#'
          }));
          setAdminProjects(formatted);
          return;
        }
      }
    } catch (e) {}
    setAdminProjects([]);
  };

  React.useEffect(() => {
    loadProjects();
    window.addEventListener('storage', loadProjects);
    window.addEventListener('fitallest_projects_updated', loadProjects);
    return () => {
      window.removeEventListener('storage', loadProjects);
      window.removeEventListener('fitallest_projects_updated', loadProjects);
    };
  }, []);

  const combinedProjects = adminProjects.length > 0 ? adminProjects : projectsData;
  const categories = ['Tất cả', ...Array.from(new Set(combinedProjects.map(p => p.category)))];

  const filteredProjects = combinedProjects.filter(project => {
    const matchesCategory = selectedCategory === 'Tất cả' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Kho Dự Án Thực Tế
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Sản Phẩm Khách Hàng Đã Đưa Vào Vận Hành
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Khám phá danh sách các dự án thiết kế website & ứng dụng tiêu biểu được Fi.tallest thực hiện thành công cho các doanh nghiệp, tập đoàn lớn.
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mb-12 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* SEARCH INPUT */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Tìm kiếm dự án theo tên hoặc từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Hiển thị <span className="text-indigo-600 font-bold">{filteredProjects.length}</span> dự án
            </div>
          </div>

          {/* CATEGORY BUTTONS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECTS GRID */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy dự án phù hợp</h3>
            <p className="text-slate-500 text-xs">Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="tech-card rounded-3xl overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-xs font-semibold text-indigo-300 border border-slate-700">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                  >
                    Xem Chi Tiết
                  </button>

                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    title="Truy cập Live Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60';
                }}
              />
            </div>

            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {selectedProject.category}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">{selectedProject.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <a 
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>Ghé Thăm Live Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button 
                onClick={() => {
                  setSelectedProject(null);
                  setCurrentTab('quote');
                }}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Tôi Muốn Thiết Kế Web Tương Tự
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
