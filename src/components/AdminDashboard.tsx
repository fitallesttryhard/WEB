import React, { useState, useEffect, useRef } from 'react';
import { 
  LogOut, ExternalLink, Plus, Edit, Trash2, 
  CheckCircle2, Eye, EyeOff, TrendingUp, DollarSign, Filter, ShoppingBag,
  UploadCloud, Copy, Image as ImageIcon, Loader2, Save,
  Facebook, Instagram, Youtube, Twitter, Globe, ArrowUp, ArrowDown, PlusCircle, GripVertical, MessageCircle, Video,
  Menu, X
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { supabase } from '../lib/supabase';
import ProductFormModal from './ProductFormModal';
import PostFormModal from './PostFormModal';
import PageFormModal from './PageFormModal';
import BannerFormModal from './BannerFormModal';
import ProjectFormModal from './ProjectFormModal';
import AdminSidebar from './AdminSidebar';
import OrderDetailModal from './OrderDetailModal';
import { useSettings } from '../contexts/SettingsContext';
import { seedTrimDatabase } from '../seedData';

const mockCategories = [
  { id: '1', name: 'Nẹp nhôm & Inox', slug: 'nep-nhom-inox', count: 12, description: 'Các loại nẹp trang trí hợp kim nhôm và inox 304.' },
  { id: '2', name: 'Phụ kiện giàn giáo', slug: 'phu-kien-gian-giao', count: 8, description: 'Cùm xoay, kích tăng, chốt nêm và phụ kiện giàn giáo.' },
  { id: '3', name: 'Vật liệu chống thấm', slug: 'vat-lieu-chong-tham', count: 5, description: 'Băng cản nước, màng chống thấm cao cấp.' },
  { id: '4', name: 'Dụng cụ thi công', slug: 'dung-cu-thi-cong', count: 24, description: 'Dụng cụ cầm tay chuyên nghiệp cho thợ xây dựng.' },
];

const initialProducts = [
  { id: 1, name: 'Nẹp nhôm chữ T trang trí', category: 'Nẹp nhôm & Inox', is_hot: true, image: 'https://images.unsplash.com/photo-1601568259976-90b5033ed983?q=80&w=150&auto=format&fit=crop' },
  { id: 2, name: 'Cùm xoay giàn giáo BS1139', category: 'Phụ kiện giàn giáo', is_hot: false, image: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=150&auto=format&fit=crop' },
  { id: 3, name: 'Băng cản nước PVC Waterstop', category: 'Vật liệu chống thấm', is_hot: true, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop' },
  { id: 4, name: 'Tấm sàn Grating mạ kẽm', category: 'Phụ kiện giàn giáo', is_hot: false, image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=150&auto=format&fit=crop' },
];

const initialOrders = [
  { 
    id: 'ORD-001', customer: 'Nguyễn Văn A', amount: 1550000, status: 'pending', date: '2026-08-13 14:30',
    phone: '0901234567', email: 'nguyenvana@gmail.com', address: '123 Điện Biên Phủ, P. 15, Q. Bình Thạnh, TP.HCM', paymentMethod: 'Chuyển khoản ngân hàng', shippingFee: 50000,
    items: [
      { name: 'Nẹp nhôm chữ T trang trí', variant: 'Màu vàng gold, Dài 2.5m', price: 500000, quantity: 2, image: 'https://images.unsplash.com/photo-1601568259976-90b5033ed983?q=80&w=150&auto=format&fit=crop' },
      { name: 'Keo dán xây dựng Apollo', variant: 'Tuýp 300ml', price: 100000, quantity: 5, image: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=150&auto=format&fit=crop' }
    ]
  },
  { 
    id: 'ORD-002', customer: 'Trần Thị B', amount: 450000, status: 'paid', date: '2026-08-12 09:15',
    phone: '0987654321', email: 'tranb88@yahoo.com', address: '45 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM', paymentMethod: 'Thẻ tín dụng (VNPay)', shippingFee: 0,
    items: [
      { name: 'Cùm xoay giàn giáo BS1139', variant: 'Tiêu chuẩn', price: 45000, quantity: 10, image: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=150&auto=format&fit=crop' }
    ]
  },
  { 
    id: 'ORD-003', customer: 'Lê Hoàng C', amount: 3250000, status: 'shipped', date: '2026-08-12 16:45',
    phone: '0912345678', email: 'hoangcle@company.vn', address: '89 Nguyễn Hữu Thọ, X. Phước Kiển, H. Nhà Bè, TP.HCM', paymentMethod: 'Thanh toán khi nhận hàng (COD)', shippingFee: 50000,
    items: [
      { name: 'Băng cản nước PVC Waterstop', variant: 'Cuộn 50m, V200', price: 1600000, quantity: 2, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop' }
    ]
  },
  { 
    id: 'ORD-004', customer: 'Phạm D', amount: 890000, status: 'pending', date: '2026-08-11 10:20',
    phone: '0933445566', email: 'phamd.build@gmail.com', address: '210 Võ Văn Ngân, P. Bình Thọ, TP. Thủ Đức', paymentMethod: 'Chuyển khoản ngân hàng', shippingFee: 40000,
    items: [
      { name: 'Búa nhổ đinh cán sợi thủy tinh', variant: '16oz', price: 150000, quantity: 2, image: 'https://images.unsplash.com/photo-1541888086903-efdc749f1813?q=80&w=150&auto=format&fit=crop' },
      { name: 'Thước cuộn thép bọc cao su', variant: '7.5m', price: 110000, quantity: 5, image: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=150&auto=format&fit=crop' }
    ]
  },
  { id: 'ORD-005', customer: 'Đỗ E', amount: 2100000, status: 'paid', date: '2026-08-11 14:00', phone: '0909999888', address: 'Quận 7, TP.HCM', items: [] },
  { id: 'ORD-006', customer: 'Hoàng F', amount: 1100000, status: 'shipped', date: '2026-08-10 08:30', phone: '0977888999', address: 'Quận 2, TP.HCM', items: [] },
];

const mockChartData = [
  { name: 'T2', visits: 400 },
  { name: 'T3', visits: 300 },
  { name: 'T4', visits: 550 },
  { name: 'T5', visits: 450 },
  { name: 'T6', visits: 700 },
  { name: 'T7', visits: 850 },
  { name: 'CN', visits: 900 },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [postCategories, setPostCategories] = useState<any[]>([
    { id: '1', name: 'Tin tức chung' },
    { id: '2', name: 'Kiến thức xây dựng' }
  ]);
  const [posts, setPosts] = useState<any[]>([
    { id: 1, title: 'Hướng dẫn thi công giàn giáo', category: 'Kiến thức xây dựng', categoryId: '2', status: 'published', image: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=150&auto=format&fit=crop', views: 125, slug: 'huong-dan-thi-cong' }
  ]);
  const [pages, setPages] = useState<any[]>([
    { id: 1, title: 'Giới thiệu công ty', slug: 'gioi-thieu', status: 'published', lastUpdated: '2026-08-13', template: 'default' },
    { id: 2, title: 'Liên hệ', slug: 'lien-he', status: 'published', lastUpdated: '2026-08-12', template: 'contact' },
    { id: 3, title: 'Chính sách bảo mật', slug: 'chinh-sach-bao-mat', status: 'draft', lastUpdated: '2026-08-10', template: 'full-width' },
  ]);
  const [banners, setBanners] = useState<any[]>([
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
  const [postCategoryForm, setPostCategoryForm] = useState({ id: null as any, name: '', slug: '', description: '' });
  const [isPostCategorySlugEdited, setIsPostCategorySlugEdited] = useState(false);
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Projects State
  const [adminProjects, setAdminProjects] = useState<any[]>([
    {
      id: 1,
      title: 'Tổ Hợp Tòa Nhà Cao Tầng S-Sky Tower',
      category: 'Chung cư cao cấp',
      location: 'Quận 2, TP. Hồ Chí Minh',
      scale: '38 Tầng - 1,200 Căn hộ',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
      materials: ['Nẹp nhôm nẹp góc âm/dương T20', 'Băng cản nước PVC V200', 'Phụ kiện giàn giáo khoá giáo xoay'],
      description: 'Cung cấp toàn bộ giải pháp nẹp chỉ trang trí nhôm cao cấp Mạ Anode chống oxy hóa cho 38 tầng căn hộ hạng sang.'
    },
    {
      id: 2,
      title: 'Trung Tâm Thương Mại & Văn Phòng Central Plaza',
      category: 'Trung tâm thương mại',
      location: 'Quận Cầu Giấy, Hà Nội',
      scale: '5 Tầng hầm - 28 Tầng nổi',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
      materials: ['Nẹp Inox 304 mạ PVD vàng mờ', 'Nẹp thảm gạch đá', 'Ty ren & Bát chuồn D12/D16'],
      description: 'Giải pháp nẹp mạ PVD vàng mờ sang trọng tạo điểm nhấn kiến trúc cho sảnh chính và hệ thang máy.'
    }
  ]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: null as any,
    title: '',
    category: 'Chung cư cao cấp',
    location: '',
    scale: '',
    image: '',
    materials: '',
    description: ''
  });

  // Settings & Appearance State
  const [appearanceForm, setAppearanceForm] = useState({ 
    primary_color: '#dc2626', 
    secondary_color: '#1f2937', 
    logo_url: '', 
    favicon_url: '', 
    heading_font: 'Inter', 
    body_font: 'Inter' 
  });
  const { settings, updateSettings } = useSettings();
  const [settingsForm, setSettingsForm] = useState(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Media state
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toSlug = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeMenu === 'media' && !mediaLoaded) {
      fetchMedia();
    }
  }, [activeMenu, mediaLoaded]);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase.storage.from('product-media').list();
      if (error) throw error;
      
      const validFiles = data.filter((f: any) => f.name !== '.emptyFolderPlaceholder' && f.metadata?.size);
      
      const filesWithUrls = validFiles.map((file: any) => {
        const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(file.name);
        return {
          id: file.id,
          name: file.name,
          size: file.metadata?.size || 0,
          path: file.name,
          url: publicUrl
        };
      });
      setMediaFiles(filesWithUrls.sort((a, b) => b.name.localeCompare(a.name)));
      setMediaLoaded(true);
    } catch (error) {
      console.error('Error fetching media:', error);
      if (mediaFiles.length === 0) {
        setMediaFiles([
          { name: 'scaffolding-hero.jpg', size: 1024500, path: 'mock-1', url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=600&auto=format&fit=crop' },
          { name: 'metal-clamp.png', size: 2048000, path: 'mock-2', url: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=600&auto=format&fit=crop' }
        ]);
      }
      setMediaLoaded(true);
    }
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    
    const newFiles: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      try {
        const { error } = await supabase.storage.from('product-media').upload(fileName, file);
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(fileName);
        newFiles.push({
          name: file.name,
          size: file.size,
          path: fileName,
          url: publicUrl
        });
      } catch (err) {
        console.error('Upload error:', err);
        newFiles.push({
          name: file.name,
          size: file.size,
          path: `mock-${Date.now()}-${i}`,
          url: URL.createObjectURL(file)
        });
      }
    }
    
    setMediaFiles(prev => [...newFiles, ...prev]);
    setIsUploading(false);
    if (newFiles.length > 0) showToast(`Đã tải lên ${newFiles.length} hình ảnh!`);
  };

  const handleDeleteMedia = async (path: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    try {
      if (!path.startsWith('mock-')) {
        await supabase.storage.from('product-media').remove([path]);
      }
      setMediaFiles(prev => prev.filter(f => f.path !== path));
      showToast('Đã xóa hình ảnh!');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Lỗi khi xóa ảnh!');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Đã copy đường dẫn ảnh!');
  };

  // Settings State Handlers
  const addSocialLink = () => {
    setSettingsForm(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { id: Date.now().toString(), platform: 'facebook', url: '' }] }));
  };
  const updateSocialLink = (id: string, field: string, value: string) => {
    setSettingsForm(prev => ({ ...prev, socialLinks: prev.socialLinks.map(link => link.id === id ? { ...link, [field]: value } : link) }));
  };
  const removeSocialLink = (id: string) => {
    setSettingsForm(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(link => link.id !== id) }));
  };

  const addFooterBlock = (type: string) => {
    setSettingsForm(prev => {
      const newBlock: any = { id: Date.now().toString(), type, title: 'Block Mới' };
      if (type === 'links') newBlock.items = [];
      if (type === 'text') newBlock.content = '';
      if (type === 'image') { newBlock.url = ''; newBlock.width = 150; }
      return { ...prev, footerBlocks: [...(prev.footerBlocks || []), newBlock] };
    });
  };
  const updateFooterBlock = (id: string, field: string, value: any) => {
    setSettingsForm(prev => ({
      ...prev,
      footerBlocks: prev.footerBlocks.map(block => block.id === id ? { ...block, [field]: value } : block)
    }));
  };
  const removeFooterBlock = (id: string) => {
    setSettingsForm(prev => ({ ...prev, footerBlocks: prev.footerBlocks.filter(block => block.id !== id) }));
  };
  const moveFooterBlock = (index: number, direction: 'up' | 'down') => {
    setSettingsForm(prev => {
      const blocks = [...prev.footerBlocks];
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return prev;
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [blocks[index], blocks[swapIndex]] = [blocks[swapIndex], blocks[index]];
      return { ...prev, footerBlocks: blocks };
    });
  };
  const addFooterLink = (blockId: string) => {
    setSettingsForm(prev => ({
      ...prev,
      footerBlocks: prev.footerBlocks.map(block => 
        block.id === blockId && block.type === 'links' 
          ? { ...block, items: [...(block.items || []), { id: Date.now().toString(), label: '', url: '' }] } : block
      )
    }));
  };
  const updateFooterLink = (blockId: string, linkId: string, field: string, value: string) => {
    setSettingsForm(prev => ({
      ...prev,
      footerBlocks: prev.footerBlocks.map(block => 
        block.id === blockId && block.type === 'links' 
          ? { ...block, items: block.items.map((link: any) => link.id === linkId ? { ...link, [field]: value } : link) } : block
      )
    }));
  };
  const removeFooterLink = (blockId: string, linkId: string) => {
    setSettingsForm(prev => ({
      ...prev,
      footerBlocks: prev.footerBlocks.map(block => 
        block.id === blockId && block.type === 'links' 
          ? { ...block, items: block.items.filter((link: any) => link.id !== linkId) } : block
      )
    }));
  };
  
  const getSocialIcon = (platform: string) => {
    switch(platform) {
      case 'facebook': return <Facebook size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'youtube': return <Youtube size={18} />;
      case 'tiktok': return <Video size={18} />;
      case 'zalo': return <MessageCircle size={18} />;
      default: return <Globe size={18} />;
    }
  };

  const fetchData = async () => {
    try {
      let { data: catData } = await supabase.from('categories').select('*');
      let { data: prodData } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });

      // Nếu chưa có sản phẩm/danh mục nào, tự động nạp 12 sản phẩm nẹp xây dựng thực tế vào DB
      if ((!catData || catData.length === 0) || (!prodData || prodData.length === 0)) {
        await seedTrimDatabase();
        const resCat = await supabase.from('categories').select('*');
        const resProd = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
        catData = resCat.data;
        prodData = resProd.data;
      }

      setCategories(catData || []);

      const { data: settingsData, error: settingsError } = await supabase.from('tenant_settings').select('*').limit(1).maybeSingle();
      if (settingsData && !settingsError) {
        const config = settingsData.config || {};
        const theme = config.theme || {};
        const fc = settingsData.footer_config || {};
        const blocks = Array.isArray(fc) ? fc : (fc.blocks || []);
        const soc = settingsData.socials || [];

        const defaultFooterBlocks = [
          {
            id: 'block-default-1',
            type: 'links',
            title: 'Liên kết nhanh',
            items: [
              { id: '1', label: 'Trang chủ', url: '#' },
              { id: '2', label: 'Giới thiệu công ty', url: '#about' },
              { id: '3', label: 'Danh mục sản phẩm', url: '#products' },
              { id: '4', label: 'Tin tức & Sự kiện', url: '#blog' },
              { id: '5', label: 'Liên hệ', url: '#contact' },
            ]
          },
          {
            id: 'block-default-2',
            type: 'text',
            title: 'Chính sách chất lượng',
            content: 'SBUILD cam kết cung cấp giải pháp vật tư, phụ kiện giàn giáo và dụng cụ thi công chất lượng chuẩn CO/CQ với chi phí tối ưu nhất.'
          }
        ];

        setAppearanceForm(prev => ({
          primary_color: settingsData.brand_color || theme.primary_color || prev.primary_color,
          secondary_color: theme.secondary_color || prev.secondary_color,
          logo_url: settingsData.logo_url || theme.logo_url || prev.logo_url,
          favicon_url: theme.favicon_url || prev.favicon_url,
          heading_font: theme.heading_font || prev.heading_font,
          body_font: theme.body_font || prev.body_font,
        }));
        setSettingsForm(prev => ({
          companyName: settingsData.company_name || fc.companyName || prev.companyName,
          hotline: settingsData.hotline || fc.hotline || prev.hotline,
          address: settingsData.address || fc.address || prev.address,
          email: settingsData.email || fc.email || prev.email,
          logoUrl: settingsData.logo_url || prev.logoUrl,
          brandColor: settingsData.brand_color || prev.brandColor,
          socialLinks: Array.isArray(soc) ? soc : (soc.links || prev.socialLinks || []),
          footerBlocks: blocks.length > 0 ? blocks : defaultFooterBlocks
        }));
      }

      if (prodData) {
        setProducts(prodData.map(p => ({
          id: p.id,
          name: p.name,
          category: p.categories?.name || 'Chưa phân loại',
          categoryId: p.category_id,
          is_hot: p.is_hot,
          image: p.thumbnail_url || p.image_url,
          slug: p.slug,
          seoTitle: p.seo_title,
          seoDescription: p.seo_description,
          thumbnailUrl: p.thumbnail_url,
          galleryUrls: p.gallery_urls,
          specs: p.specs,
          sku: p.sku,
          regularPrice: p.original_price || p.regular_price,
          salePrice: p.sale_price,
          stockStatus: p.stock_status,
          tags: p.tags,
          description: p.description,
          status: p.status
        })));
      } else {
        setProducts([]);
      }

      const { data: pageData } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
      if (pageData) {
        setPages(pageData.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: 'published',
          lastUpdated: p.updated_at ? p.updated_at.split('T')[0] : '2026-08-14',
          template: p.template_type || 'default',
          content: p.html_content
        })));
      }

      if (settingsData?.footer_config?.banners) {
        setBanners(settingsData.footer_config.banners);
      }
    } catch (error) {
      console.warn('Error in fetchData:', error);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveAppearance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      updateSettings({
        brandColor: appearanceForm.primary_color,
        logoUrl: appearanceForm.logo_url,
      });

      const { data: existing } = await supabase.from('tenant_settings').select('id').limit(1).maybeSingle();

      const payload = {
        brand_color: appearanceForm.primary_color,
        logo_url: appearanceForm.logo_url,
      };

      if (existing?.id) {
        await supabase.from('tenant_settings').update(payload).eq('id', existing.id);
      } else {
        const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
        if (tenant?.id) {
          await supabase.from('tenant_settings').insert([{ ...payload, tenant_id: tenant.id }]);
        }
      }
      showToast('Đã lưu và áp dụng giao diện mới!');
    } catch (error) {
      console.error(error);
      showToast('Đã cập nhật giao diện!');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSettings(settingsForm); // Synchronously updates React Context for Navbar, Footer, ContactUs, etc.

      const { data: existing } = await supabase.from('tenant_settings').select('id, footer_config').limit(1).maybeSingle();
      const existingFc = existing?.footer_config || {};

      const payload = {
        brand_color: settingsForm.brandColor || '#dc2626',
        logo_url: settingsForm.logoUrl || '',
        socials: settingsForm.socialLinks || [],
        footer_config: {
          ...existingFc,
          companyName: settingsForm.companyName,
          hotline: settingsForm.hotline,
          address: settingsForm.address,
          email: settingsForm.email,
          blocks: settingsForm.footerBlocks || [],
          banners: banners || existingFc.banners || [],
        },
      };

      if (existing?.id) {
        await supabase.from('tenant_settings').update(payload).eq('id', existing.id);
      } else {
        const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
        if (tenant?.id) {
          await supabase.from('tenant_settings').insert([{ ...payload, tenant_id: tenant.id }]);
        }
      }
      showToast('Đã lưu cài đặt và áp dụng toàn hệ thống!');
    } catch (error) {
      console.error(error);
      showToast('Đã lưu cài đặt!');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (formData: any) => {
    if (!formData.name || !formData.categoryId) {
      alert("Vui lòng nhập tên sản phẩm và chọn danh mục!");
      return;
    }

    const selectedCat = categories.find(c => c.id.toString() === formData.categoryId);
    const imageUrl = formData.thumbnailUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=150&auto=format&fit=crop';
    
    if (formData.id) {
      // Update
      const updatedProduct = {
        ...formData,
        id: formData.id,
        category: selectedCat?.name || 'Chưa phân loại',
        is_hot: formData.isHot,
        specs: formData.specs,
        image: imageUrl
      };
      
      setProducts(products.map(p => p.id === formData.id ? updatedProduct : p));
      setIsModalOpen(false);
      showToast('Đã cập nhật sản phẩm thành công!');

      try {
        const { error } = await supabase.from('products').update({
          name: formData.name,
          category_id: formData.categoryId,
          is_hot: formData.isHot,
        specs: formData.specs,
          image_url: imageUrl,
          slug: formData.slug,
          seo_title: formData.seoTitle,
          seo_description: formData.seoDescription,
          thumbnail_url: formData.thumbnailUrl,
          gallery_urls: formData.galleryUrls,
          sku: formData.sku,
          regular_price: formData.regularPrice,
          sale_price: formData.salePrice,
          stock_status: formData.stockStatus,
          tags: formData.tags,
          description: formData.description,
          status: formData.status
        }).eq('id', formData.id);
        if (error) throw error;
      } catch (err: any) {
        console.log('Update Error (might be missing column):', err.message);
      }
    } else {
      // Create
      const newProduct = {
        ...formData,
        id: Date.now(),
        category: selectedCat?.name || 'Chưa phân loại',
        is_hot: formData.isHot,
        specs: formData.specs,
        image: imageUrl
      };

      setProducts([newProduct, ...products]);
      setIsModalOpen(false);
      showToast('Đã thêm sản phẩm thành công!');

      try {
        const { error } = await supabase.from('products').insert([{
          name: formData.name,
          category_id: formData.categoryId,
          is_hot: formData.isHot,
        specs: formData.specs,
          image_url: imageUrl,
          slug: formData.slug,
          seo_title: formData.seoTitle,
          seo_description: formData.seoDescription,
          thumbnail_url: formData.thumbnailUrl,
          gallery_urls: formData.galleryUrls,
          sku: formData.sku,
          regular_price: formData.regularPrice,
          sale_price: formData.salePrice,
          stock_status: formData.stockStatus,
          tags: formData.tags,
          description: formData.description,
          status: formData.status
        }]);
        if (error) throw error;
      } catch (err: any) {
        console.log('Insert Error (might be missing column):', err.message);
      }
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    
    // Cập nhật UI ngay lập tức
    setProducts(products.filter(p => p.id !== id));
    setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    showToast('Đã xóa sản phẩm!');

    // Gửi lệnh xóa lên DB
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.log('Delete Error:', err.message);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: any) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleToggleHot = async (id: any, currentStatus: boolean) => {
    setProducts(products.map(p => p.id === id ? { ...p, is_hot: !currentStatus } : p));
    showToast(`Đã ${!currentStatus ? 'bật' : 'tắt'} trạng thái HOT!`);
    try {
      await supabase.from('products').update({ is_hot: !currentStatus }).eq('id', id);
    } catch (err) {}
  };

  const handleBulkDelete = () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm?`)) return;
    setProducts(products.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    showToast(`Đã xóa ${selectedProducts.length} sản phẩm thành công!`);
  };

  const handleBulkHide = () => {
    setProducts(products.map(p => selectedProducts.includes(p.id) ? { ...p, is_hot: false } : p));
    setSelectedProducts([]);
    showToast(`Đã ẩn ${selectedProducts.length} sản phẩm!`);
  };

  // POST HANDLERS
  const handleAddNewPost = () => {
    setEditingPost(null);
    setIsPostModalOpen(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsPostModalOpen(true);
  };

  const handlePostSubmit = async (formData: any) => {
    const selectedCat = postCategories.find(c => c.id.toString() === formData.categoryId);
    const imageUrl = formData.thumbnailUrl || formData.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=150&auto=format&fit=crop';
    const slug = formData.slug || toSlug(formData.title || 'bai-viet');

    if (formData.id) {
      const updatedPost = {
        ...formData,
        category: selectedCat?.name || 'Chưa phân loại',
        image: imageUrl,
        views: editingPost?.views || 0
      };
      setPosts(posts.map(p => p.id === formData.id ? updatedPost : p));
      showToast('Đã cập nhật bài viết thành công!');

      try {
        await supabase.from('posts').update({
          title: formData.title,
          slug,
          cover_image: imageUrl,
          excerpt: formData.excerpt || formData.summary || '',
          html_content: formData.content || '',
          is_published: formData.status === 'published' || formData.is_published || true
        }).eq('id', formData.id);
      } catch (err) {
        console.warn('Lỗi update post:', err);
      }
    } else {
      const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const newPost = {
        ...formData,
        id: newId,
        category: selectedCat?.name || 'Chưa phân loại',
        image: imageUrl,
        views: 0
      };
      setPosts([newPost, ...posts]);
      showToast('Đã thêm bài viết mới!');

      try {
        const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
        const payload: any = {
          id: newId,
          title: formData.title,
          slug,
          cover_image: imageUrl,
          excerpt: formData.excerpt || formData.summary || '',
          html_content: formData.content || '',
          is_published: true
        };
        if (tenant?.id) payload.tenant_id = tenant.id;

        await supabase.from('posts').insert([payload]);
      } catch (err) {
        console.warn('Lỗi insert post:', err);
      }
    }
    setIsPostModalOpen(false);
  };

  const handleDeletePost = async (id: any) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    setPosts(posts.filter(p => p.id !== id));
    setSelectedPosts(selectedPosts.filter(pId => pId !== id));
    showToast('Đã xóa bài viết!');
    try {
      await supabase.from('posts').delete().eq('id', id);
    } catch (err) {
      console.warn('Lỗi delete post:', err);
    }
  };

  const handleTogglePostStatus = async (id: any, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const isPub = newStatus === 'published';
    setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showToast(`Đã đổi trạng thái thành ${isPub ? 'Xuất bản' : 'Bản nháp'}!`);
    try {
      await supabase.from('posts').update({ is_published: isPub }).eq('id', id);
    } catch (err) {
      console.warn('Lỗi toggle post status:', err);
    }
  };

  const handleSelectAllPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedPosts(posts.map(p => p.id));
    else setSelectedPosts([]);
  };

  const handleSelectPost = (id: any) => {
    if (selectedPosts.includes(id)) setSelectedPosts(selectedPosts.filter(pId => pId !== id));
    else setSelectedPosts([...selectedPosts, id]);
  };

  const handleBulkDeletePosts = () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết?`)) return;
    setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
    setSelectedPosts([]);
    showToast(`Đã xóa ${selectedPosts.length} bài viết thành công!`);
  };

  const handleBulkDraftPosts = () => {
    setPosts(posts.map(p => selectedPosts.includes(p.id) ? { ...p, status: 'draft' } : p));
    setSelectedPosts([]);
    showToast(`Đã chuyển ${selectedPosts.length} bài viết về bản nháp!`);
  };

  // PAGES HANDLERS
  const handleAddNewPage = () => {
    setEditingPage(null);
    setIsPageModalOpen(true);
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setIsPageModalOpen(true);
  };

  const handlePageSubmit = async (formData: any) => {
    const slug = formData.slug || toSlug(formData.title || 'trang');
    if (formData.id) {
      const updatedPage = {
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setPages(pages.map(p => p.id === formData.id ? updatedPage : p));
      showToast('Đã cập nhật trang tĩnh thành công!');

      try {
        await supabase.from('pages').update({
          title: formData.title,
          slug,
          template_type: formData.template || 'default',
          html_content: formData.content || ''
        }).eq('id', formData.id);
      } catch (err) {
        console.warn('Lỗi update page:', err);
      }
    } else {
      const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const newPage = {
        ...formData,
        id: newId,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setPages([newPage, ...pages]);
      showToast('Đã thêm trang tĩnh mới!');

      try {
        const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
        const payload: any = {
          id: newId,
          title: formData.title,
          slug,
          template_type: formData.template || 'default',
          html_content: formData.content || ''
        };
        if (tenant?.id) payload.tenant_id = tenant.id;

        await supabase.from('pages').insert([payload]);
      } catch (err) {
        console.warn('Lỗi insert page:', err);
      }
    }
    setIsPageModalOpen(false);
  };

  const handleDeletePage = async (id: any) => {
    if (!confirm("Bạn có chắc chắn muốn xóa trang tĩnh này?")) return;
    setPages(pages.filter(p => p.id !== id));
    setSelectedPages(selectedPages.filter(pId => pId !== id));
    showToast('Đã xóa trang tĩnh!');
    try {
      await supabase.from('pages').delete().eq('id', id);
    } catch (err) {
      console.warn('Lỗi delete page:', err);
    }
  };

  const handleTogglePageStatus = (id: any, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    setPages(pages.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showToast(`Đã đổi trạng thái thành ${newStatus === 'published' ? 'Xuất bản' : 'Bản nháp'}!`);
  };

  const handleSelectAllPages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedPages(pages.map(p => p.id));
    else setSelectedPages([]);
  };

  const handleSelectPage = (id: any) => {
    if (selectedPages.includes(id)) setSelectedPages(selectedPages.filter(pId => pId !== id));
    else setSelectedPages([...selectedPages, id]);
  };

  const handleBulkDeletePages = () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedPages.length} trang tĩnh?`)) return;
    setPages(pages.filter(p => !selectedPages.includes(p.id)));
    setSelectedPages([]);
    showToast(`Đã xóa ${selectedPages.length} trang tĩnh thành công!`);
  };

  // BANNER HANDLERS
  const saveBannersToDb = async (updatedBanners: any[]) => {
    try {
      updateSettings({ banners: updatedBanners });
      const { data: existing } = await supabase.from('tenant_settings').select('id, footer_config').limit(1).maybeSingle();
      const footerConfig = existing?.footer_config || {};
      const payload = {
        footer_config: {
          ...footerConfig,
          banners: updatedBanners
        }
      };
      if (existing?.id) {
        await supabase.from('tenant_settings').update(payload).eq('id', existing.id);
      }
    } catch (err) {
      console.warn('Lỗi lưu Banners:', err);
    }
  };

  const handleAddNewBanner = () => {
    setEditingBanner(null);
    setIsBannerModalOpen(true);
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner);
    setIsBannerModalOpen(true);
  };

  const handleBannerSubmit = async (formData: any) => {
    let nextBanners: any[] = [];
    if (formData.id) {
      nextBanners = banners.map(b => b.id === formData.id ? { ...b, ...formData } : b);
      showToast('Đã cập nhật banner!');
    } else {
      const newBanner = {
        ...formData,
        id: Date.now().toString(),
        order: banners.length + 1
      };
      nextBanners = [...banners, newBanner];
      showToast('Đã thêm banner mới!');
    }
    setBanners(nextBanners);
    await saveBannersToDb(nextBanners);
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = async (id: any) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;
    const nextBanners = banners.filter(b => b.id !== id);
    setBanners(nextBanners);
    await saveBannersToDb(nextBanners);
    showToast('Đã xóa banner!');
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === banners.length - 1)) return;
    
    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;
    
    // Update orders
    newBanners.forEach((b, i) => b.order = i + 1);
    
    setBanners(newBanners);
  };

  // CATEGORIES HANDLERS
  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' && !isCategorySlugEdited) {
      setCategoryForm({ ...categoryForm, name: value, slug: toSlug(value) });
    } else if (name === 'slug') {
      setIsCategorySlugEdited(true);
      setCategoryForm({ ...categoryForm, slug: toSlug(value) });
    } else {
      setCategoryForm({ ...categoryForm, [name]: value });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      showToast('Vui lòng nhập tên danh mục!');
      return;
    }
    
    const slug = categoryForm.slug || toSlug(categoryForm.name);

    if (categoryForm.id) {
      setCategories(categories.map(c => c.id === categoryForm.id ? { ...categoryForm, count: c.count || 0 } : c));
      showToast('Đã cập nhật danh mục!');
      try {
        await supabase.from('categories').update({ name: categoryForm.name, slug }).eq('id', categoryForm.id);
      } catch (err) {
        console.warn('Lỗi update category:', err);
      }
    } else {
      const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const newCategory = {
        ...categoryForm,
        id: newId,
        slug,
        count: 0
      };
      setCategories([newCategory, ...categories]);
      showToast('Đã thêm danh mục mới!');

      try {
        const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
        const payload: any = { id: newId, name: categoryForm.name, slug };
        if (tenant?.id) payload.tenant_id = tenant.id;

        await supabase.from('categories').insert([payload]);
      } catch (err) {
        console.warn('Lỗi insert category:', err);
      }
    }
    setCategoryForm({ id: null, name: '', slug: '', description: '' });
    setIsCategorySlugEdited(false);
  };

  const handleEditCategory = (cat: any) => {
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || toSlug(cat.name),
      description: cat.description || ''
    });
    setIsCategorySlugEdited(true);
  };

  const handleDeleteCategory = async (id: any) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    setCategories(categories.filter(c => c.id !== id));
    showToast('Đã xóa danh mục!');
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (err) {
      console.warn('Lỗi delete category:', err);
    }
  };

  const handleSelectAllCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedCategories(categories.map(c => c.id));
    else setSelectedCategories([]);
  };

  const handleSelectCategory = (id: any) => {
    if (selectedCategories.includes(id)) setSelectedCategories(selectedCategories.filter(cId => cId !== id));
    else setSelectedCategories([...selectedCategories, id]);
  };

  const handleBulkDeleteCategories = () => {
    if (!confirm(`Xóa ${selectedCategories.length} danh mục?`)) return;
    setCategories(categories.filter(c => !selectedCategories.includes(c.id)));
    setSelectedCategories([]);
    showToast(`Đã xóa ${selectedCategories.length} danh mục!`);
  };

  // POST CATEGORIES HANDLERS
  const handlePostCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' && !isPostCategorySlugEdited) {
      setPostCategoryForm({ ...postCategoryForm, name: value, slug: toSlug(value) });
    } else if (name === 'slug') {
      setIsPostCategorySlugEdited(true);
      setPostCategoryForm({ ...postCategoryForm, slug: toSlug(value) });
    } else {
      setPostCategoryForm({ ...postCategoryForm, [name]: value });
    }
  };

  const handlePostCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postCategoryForm.name) {
      showToast('Vui lòng nhập tên chuyên mục!');
      return;
    }
    
    if (postCategoryForm.id) {
      setPostCategories(postCategories.map(c => c.id === postCategoryForm.id ? { ...postCategoryForm, count: c.count || 0 } : c));
      showToast('Đã cập nhật chuyên mục!');
    } else {
      const newCategory = {
        ...postCategoryForm,
        id: Date.now().toString(),
        count: 0
      };
      setPostCategories([newCategory, ...postCategories]);
      showToast('Đã thêm chuyên mục mới!');
    }
    setPostCategoryForm({ id: null, name: '', slug: '', description: '' });
    setIsPostCategorySlugEdited(false);
  };

  const handleEditPostCategory = (cat: any) => {
    setPostCategoryForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || toSlug(cat.name),
      description: cat.description || ''
    });
    setIsPostCategorySlugEdited(true);
  };

  const handleDeletePostCategory = (id: any) => {
    if (!confirm("Bạn có chắc muốn xóa chuyên mục này?")) return;
    setPostCategories(postCategories.filter(c => c.id !== id));
    showToast('Đã xóa chuyên mục!');
  };

  const handleSelectAllPostCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedPostCategories(postCategories.map(c => c.id));
    else setSelectedPostCategories([]);
  };

  const handleSelectPostCategory = (id: any) => {
    if (selectedPostCategories.includes(id)) setSelectedPostCategories(selectedPostCategories.filter(cId => cId !== id));
    else setSelectedPostCategories([...selectedPostCategories, id]);
  };

  const handleBulkDeletePostCategories = () => {
    if (!confirm(`Xóa ${selectedPostCategories.length} chuyên mục?`)) return;
    setPostCategories(postCategories.filter(c => !selectedPostCategories.includes(c.id)));
    setSelectedPostCategories([]);
    showToast(`Đã xóa ${selectedPostCategories.length} chuyên mục!`);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden text-gray-800 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar activeMenu={activeMenu} setActiveMenu={(menu) => {
          setActiveMenu(menu);
          setIsSidebarOpen(false); // Close on mobile after selection
        }} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          {/* Hamburger Menu (Mobile) */}
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-red-600 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2 lg:gap-4 ml-auto">
            <a 
              href="#home"
              className="flex items-center gap-1.5 lg:gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors px-2 lg:px-4 py-2 rounded-lg hover:bg-red-50"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Xem Website thực tế</span>
            </a>
            <div className="w-px h-6 bg-gray-200"></div>
            <button className="flex items-center gap-1.5 lg:gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors px-2 lg:px-4 py-2">
              <LogOut size={16} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeMenu === 'dashboard' && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-2xl font-black text-gray-900 mb-2">Tổng quan Bảng điều khiển</h1>
                <p className="text-sm text-gray-500 font-medium mb-8">Chỉ số thực tế và thống kê hoạt động của hệ thống.</p>
                
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                      <ShoppingBag size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Tổng số đơn hàng</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{orders.length}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                      <DollarSign size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Doanh thu dự kiến</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orders.reduce((sum, o) => sum + o.amount, 0))}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                      <TrendingUp size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Lượt truy cập (7 ngày)</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                      {mockChartData.reduce((sum, d) => sum + d.visits, 0).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Line Chart */}
                  <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Lượt truy cập website</h2>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <Line type="monotone" dataKey="visits" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: '#dc2626' }} activeDot={{ r: 6 }} />
                          <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dx={-10} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                            itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                            labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <ul className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map(order => (
                          <li key={order.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-gray-900">{order.customer}</span>
                              <span className="text-sm font-bold text-gray-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium text-gray-400">{order.id} • {order.date}</span>
                              {order.status === 'pending' && <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">Chờ xử lý</span>}
                              {order.status === 'paid' && <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Đã thanh toán</span>}
                              {order.status === 'shipped' && <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Đang giao</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'products' && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Quản lý danh sách, giá cả và trạng thái của các sản phẩm.</p>
                  </div>
                  <button 
                    onClick={handleAddNew}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={18} />
                    Thêm Sản phẩm mới
                  </button>
                </div>

                {/* Bulk Action Bar */}
                {selectedProducts.length > 0 && (
                  <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 font-bold shadow-sm">
                        {selectedProducts.length}
                      </div>
                      <span className="text-sm font-bold text-red-900">sản phẩm đang được chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleBulkHide} className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold transition-colors">
                        Ẩn nhanh
                      </button>
                      <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                        <Trash2 size={16} />
                        Xóa các mục đã chọn
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                        <th className="px-6 py-4 w-12">
                          <input 
                            type="checkbox" 
                            checked={products.length > 0 && selectedProducts.length === products.length}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-6 py-4 w-16">STT</th>
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4">Danh mục</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product, index) => (
                        <tr key={product.id} className={`transition-colors ${selectedProducts.includes(product.id) ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm"
                              />
                              <span className="font-bold text-sm text-gray-900 line-clamp-2">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-600">{product.category}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleHot(product.id, product.is_hot)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${product.is_hot ? 'bg-red-600' : 'bg-gray-200'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${product.is_hot ? 'translate-x-6' : 'translate-x-1'}`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => showToast('Tính năng Xem trước đang được phát triển.')}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Xem trước"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-medium">
                            Chưa có sản phẩm nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <span className="text-xs font-medium text-gray-500">Hiển thị {products.length} sản phẩm</span>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">Trước</button>
                      <button className="px-3 py-1 text-sm font-medium text-white bg-red-600 border border-red-600 rounded">1</button>
                      <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">Sau</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeMenu === 'posts' && (
              <>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý Bài viết</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Quản lý danh sách, nội dung và trạng thái của các bài viết.</p>
                  </div>
                  <button 
                    onClick={handleAddNewPost}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={18} />
                    Viết bài mới
                  </button>
                </div>

                {/* Bulk Action Bar for Posts */}
                {selectedPosts.length > 0 && (
                  <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 font-bold shadow-sm">
                        {selectedPosts.length}
                      </div>
                      <span className="text-sm font-bold text-red-900">bài viết đang được chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleBulkDraftPosts} className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold transition-colors">
                        Chuyển về Bản nháp
                      </button>
                      <button onClick={handleBulkDeletePosts} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                        <Trash2 size={16} />
                        Xóa các mục đã chọn
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                        <th className="px-6 py-4 w-12">
                          <input 
                            type="checkbox" 
                            checked={posts.length > 0 && selectedPosts.length === posts.length}
                            onChange={handleSelectAllPosts}
                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-6 py-4 w-16">STT</th>
                        <th className="px-6 py-4 w-1/3">Bài viết</th>
                        <th className="px-6 py-4">Chuyên mục</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Lượt xem</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {posts.map((post, index) => (
                        <tr key={post.id} className={`transition-colors ${selectedPosts.includes(post.id) ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              checked={selectedPosts.includes(post.id)}
                              onChange={() => handleSelectPost(post.id)}
                              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-16 h-12 rounded-lg object-cover border border-gray-100 shadow-sm shrink-0"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-gray-900 line-clamp-1 truncate">{post.title}</span>
                                <span className="text-[11px] font-medium text-gray-400 truncate mt-0.5">{post.slug || 'chua-cap-nhat-slug'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-600">{post.category}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <button
                                onClick={() => handleTogglePostStatus(post.id, post.status)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${post.status === 'published' ? 'bg-red-600' : 'bg-gray-200'}`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${post.status === 'published' ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                              </button>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${post.status === 'published' ? 'text-red-600' : 'text-gray-400'}`}>
                                {post.status === 'published' ? 'Xuất bản' : 'Bản nháp'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-gray-500">{post.views?.toLocaleString() || 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => showToast('Tính năng Xem trước đang được phát triển.')}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Xem trước"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditPost(post)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-medium">
                            Chưa có bài viết nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <span className="text-xs font-medium text-gray-500">Hiển thị {posts.length} bài viết</span>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">Trước</button>
                      <button className="px-3 py-1 text-sm font-medium text-white bg-red-600 border border-red-600 rounded">1</button>
                      <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">Sau</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeMenu === 'pages' && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý Trang tĩnh</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Quản lý các trang nội dung tĩnh như Giới thiệu, Liên hệ, Chính sách...</p>
                  </div>
                  <button 
                    onClick={handleAddNewPage}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={18} />
                    Thêm Trang mới
                  </button>
                </div>

                {/* Bulk Action Bar */}
                {selectedPages.length > 0 && (
                  <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 font-bold shadow-sm">
                        {selectedPages.length}
                      </div>
                      <span className="text-sm font-bold text-red-900">trang đang được chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleBulkDeletePages} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                        <Trash2 size={16} />
                        Xóa các mục đã chọn
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                        <th className="px-6 py-4 w-12">
                          <input 
                            type="checkbox" 
                            checked={pages.length > 0 && selectedPages.length === pages.length}
                            onChange={handleSelectAllPages}
                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-6 py-4">Tiêu đề trang</th>
                        <th className="px-6 py-4">Đường dẫn</th>
                        <th className="px-6 py-4">Cập nhật lần cuối</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pages.map((page, index) => (
                        <tr key={page.id} className={`transition-colors ${selectedPages.includes(page.id) ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              checked={selectedPages.includes(page.id)}
                              onChange={() => handleSelectPage(page.id)}
                              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-sm text-gray-900">{page.title}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-500">/{page.slug}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-500">{page.lastUpdated}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePageStatus(page.id, page.status)}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => showToast('Tính năng Xem trước đang được phát triển.')}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Xem trước"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditPage(page)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeletePage(page.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {pages.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-medium">
                            Chưa có trang tĩnh nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <span className="text-xs font-medium text-gray-500">Hiển thị {pages.length} trang</span>
                  </div>
                </div>
              </>
            )}

            {activeMenu === 'categories' && (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-gray-900">Quản lý Danh mục</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Tạo và phân loại các chuyên mục cho sản phẩm.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  
                  {/* Cột Trái: Form Thêm/Sửa */}
                  <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                      {categoryForm.id ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                    </h2>
                    <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên danh mục <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={categoryForm.name}
                          onChange={handleCategoryFormChange}
                          placeholder="Ví dụ: Phụ kiện giàn giáo"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Đường dẫn tĩnh (Slug)</label>
                        <input 
                          type="text" 
                          name="slug"
                          value={categoryForm.slug}
                          onChange={handleCategoryFormChange}
                          placeholder="phu-kien-gian-giao"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-gray-600 transition-all"
                        />
                        <p className="text-xs text-gray-400 mt-1.5 font-medium">Chuỗi định danh hợp lệ trên URL (chỉ chứa chữ cái, số và dấu gạch ngang).</p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả</label>
                        <textarea 
                          name="description"
                          value={categoryForm.description}
                          onChange={handleCategoryFormChange}
                          rows={4}
                          placeholder="Mô tả ngắn gọn về danh mục này..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all resize-none"
                        />
                      </div>
                      <div className="pt-2 flex gap-2">
                        {categoryForm.id && (
                          <button 
                            type="button"
                            onClick={() => {
                              setCategoryForm({ id: null, name: '', slug: '', description: '' });
                              setIsCategorySlugEdited(false);
                            }}
                            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition-all"
                          >
                            Hủy
                          </button>
                        )}
                        <button 
                          type="submit"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)]"
                        >
                          {categoryForm.id ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Cột Phải: Bảng dữ liệu */}
                  <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto flex flex-col">
                    {/* Bulk Action Bar for Categories */}
                    {selectedCategories.length > 0 && (
                      <div className="bg-red-50 border-b border-red-100 p-3 flex items-center justify-between animate-in fade-in duration-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-red-900 bg-white px-2 py-0.5 rounded shadow-sm">{selectedCategories.length}</span>
                          <span className="text-sm font-bold text-red-900">mục đang chọn</span>
                        </div>
                        <button onClick={handleBulkDeleteCategories} className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-1.5">
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    )}
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                          <th className="px-5 py-4 w-12">
                            <input 
                              type="checkbox" 
                              checked={categories.length > 0 && selectedCategories.length === categories.length}
                              onChange={handleSelectAllCategories}
                              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                            />
                          </th>
                          <th className="px-5 py-4">Tên danh mục</th>
                          <th className="px-5 py-4">Mô tả</th>
                          <th className="px-5 py-4 text-center">Số lượng</th>
                          <th className="px-5 py-4 text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                          <tr key={cat.id} className={`transition-colors ${selectedCategories.includes(cat.id) ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-5 py-4">
                              <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => handleSelectCategory(cat.id)}
                                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-gray-900">{cat.name}</span>
                                <span className="text-[11px] font-medium text-gray-400 mt-0.5">{cat.slug}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 max-w-[200px]">
                              <p className="text-sm font-medium text-gray-500 line-clamp-2">{cat.description || '—'}</p>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold">
                                {cat.count || 0}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => handleEditCategory(cat)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa"
                                >
                                  <Edit size={15} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {categories.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-gray-500 font-medium">Chưa có danh mục nào.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'post_categories' && (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-gray-900">Chuyên mục Bài viết</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Tạo và phân loại các chuyên mục cho bài viết/tin tức.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  
                  {/* Cột Trái: Form Thêm/Sửa */}
                  <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                      {postCategoryForm.id ? 'Sửa chuyên mục' : 'Thêm chuyên mục mới'}
                    </h2>
                    <form onSubmit={handlePostCategorySubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên chuyên mục <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={postCategoryForm.name}
                          onChange={handlePostCategoryFormChange}
                          placeholder="Ví dụ: Tin tức xây dựng"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Đường dẫn tĩnh (Slug)</label>
                        <input 
                          type="text" 
                          name="slug"
                          value={postCategoryForm.slug}
                          onChange={handlePostCategoryFormChange}
                          placeholder="tin-tuc-xay-dung"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-gray-600 transition-all"
                        />
                        <p className="text-xs text-gray-400 mt-1.5 font-medium">Chuỗi định danh hợp lệ trên URL (chỉ chứa chữ cái, số và dấu gạch ngang).</p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả</label>
                        <textarea 
                          name="description"
                          value={postCategoryForm.description}
                          onChange={handlePostCategoryFormChange}
                          rows={4}
                          placeholder="Mô tả ngắn gọn về chuyên mục này..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all resize-none"
                        />
                      </div>
                      <div className="pt-2 flex gap-2">
                        {postCategoryForm.id && (
                          <button 
                            type="button"
                            onClick={() => {
                              setPostCategoryForm({ id: null, name: '', slug: '', description: '' });
                              setIsPostCategorySlugEdited(false);
                            }}
                            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition-all"
                          >
                            Hủy
                          </button>
                        )}
                        <button 
                          type="submit"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)]"
                        >
                          {postCategoryForm.id ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Cột Phải: Bảng dữ liệu */}
                  <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto flex flex-col">
                    {selectedPostCategories.length > 0 && (
                      <div className="bg-red-50 border-b border-red-100 p-3 flex items-center justify-between animate-in fade-in duration-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-red-900 bg-white px-2 py-0.5 rounded shadow-sm">{selectedPostCategories.length}</span>
                          <span className="text-sm font-bold text-red-900">mục đang chọn</span>
                        </div>
                        <button onClick={handleBulkDeletePostCategories} className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-1.5">
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    )}
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                          <th className="px-5 py-4 w-12">
                            <input 
                              type="checkbox" 
                              checked={postCategories.length > 0 && selectedPostCategories.length === postCategories.length}
                              onChange={handleSelectAllPostCategories}
                              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                            />
                          </th>
                          <th className="px-5 py-4">Tên chuyên mục</th>
                          <th className="px-5 py-4">Mô tả</th>
                          <th className="px-5 py-4 text-center">Số lượng</th>
                          <th className="px-5 py-4 text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {postCategories.map((cat) => (
                          <tr key={cat.id} className={`transition-colors ${selectedPostCategories.includes(cat.id) ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-5 py-4">
                              <input 
                                type="checkbox" 
                                checked={selectedPostCategories.includes(cat.id)}
                                onChange={() => handleSelectPostCategory(cat.id)}
                                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-gray-900">{cat.name}</span>
                                <span className="text-[11px] font-medium text-gray-400 mt-0.5">{cat.slug}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 max-w-[200px]">
                              <p className="text-sm font-medium text-gray-500 line-clamp-2">{cat.description || '—'}</p>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold">
                                {cat.count || 0}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => handleEditPostCategory(cat)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa"
                                >
                                  <Edit size={15} />
                                </button>
                                <button 
                                  onClick={() => handleDeletePostCategory(cat.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {postCategories.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-gray-500 font-medium">Chưa có chuyên mục nào.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'projects' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý Dự án thi công</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Quản lý danh sách các công trình tiêu biểu đã cung ứng vật tư SBUILD.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setProjectForm({ id: null, title: '', category: 'Chung cư cao cấp', location: '', scale: '', image: '', materials: '', description: '' });
                      setIsProjectModalOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Plus size={18} />
                    Thêm Dự án mới
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                        <th className="px-6 py-4 w-16">STT</th>
                        <th className="px-6 py-4">Tên Dự án</th>
                        <th className="px-6 py-4">Loại hình</th>
                        <th className="px-6 py-4">Vị trí & Quy mô</th>
                        <th className="px-6 py-4">Vật tư cung ứng</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {adminProjects.map((proj, idx) => (
                        <tr key={proj.id || idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-sm text-gray-400">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={proj.image || proj.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop'} 
                                alt={proj.title} 
                                className="w-16 h-12 rounded-lg object-cover border border-gray-100 shadow-xs shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{proj.title}</h4>
                                <p className="text-[11px] text-gray-400 font-medium line-clamp-1">{proj.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md border border-red-100 whitespace-nowrap">
                              {proj.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-600">
                            <p className="font-bold text-gray-900">{proj.location}</p>
                            <p className="text-gray-400 mt-0.5">{proj.scale}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[250px]">
                              {(Array.isArray(proj.materials) ? proj.materials : String(proj.materials || '').split(',')).map((m: any, i: number) => (
                                <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {m.trim()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setProjectForm({
                                    id: proj.id,
                                    title: proj.title,
                                    category: proj.category,
                                    location: proj.location,
                                    scale: proj.scale,
                                    image: proj.image || proj.image_url,
                                    materials: Array.isArray(proj.materials) ? proj.materials.join(', ') : proj.materials,
                                    description: proj.description
                                  });
                                  setIsProjectModalOpen(true);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Bạn có chắc muốn xóa dự án "${proj.title}"?`)) {
                                    setAdminProjects(prev => prev.filter(p => p.id !== proj.id));
                                    showToast('Đã xóa dự án thành công.');
                                  }
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {adminProjects.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-medium">
                            Chưa có dự án nào. Bấm "Thêm Dự án mới" để bắt đầu.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!['dashboard', 'products', 'posts', 'pages', 'banners', 'categories', 'post_categories', 'orders', 'projects', 'media', 'appearance', 'settings'].includes(activeMenu) && (
              <div>
                <h1 className="text-2xl font-black text-gray-900 mb-2 capitalize">{activeMenu}</h1>
                <p className="text-sm text-gray-500 font-medium mb-8">Phân hệ quản lý {activeMenu}.</p>
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-400 mb-2">Tính năng đang phát triển</h2>
                  <p className="text-sm text-gray-400">Module này sẽ được cập nhật trong các phiên bản tiếp theo.</p>
                </div>
              </div>
            )}

            {activeMenu === 'appearance' && (
              <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-gray-900">Theme Customizer</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Cá nhân hóa nhận diện thương hiệu, màu sắc và phông chữ của bạn.</p>
                </div>
                  
                <form onSubmit={handleSaveAppearance}>
                  
                  {/* Card 1: Nhận diện Thương hiệu */}
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <ImageIcon size={20} className="text-red-500" />
                      Nhận diện Thương hiệu
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Logo chính</label>
                        {appearanceForm.logo_url ? (
                          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center gap-4 relative group">
                            <img src={appearanceForm.logo_url} alt="Logo preview" className="h-20 object-contain" />
                            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button" 
                                onClick={() => setAppearanceForm({...appearanceForm, logo_url: ''})}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                              >
                                Xóa / Thay đổi
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                            onClick={() => {
                              const dummyUrl = prompt("Nhập URL của Logo (Demo Upload):");
                              if (dummyUrl) setAppearanceForm({...appearanceForm, logo_url: dummyUrl});
                            }}
                          >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                              <UploadCloud size={24} className="text-gray-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-gray-700">Kéo thả logo vào đây</p>
                              <p className="text-xs text-gray-500 mt-1">hoặc click để chọn file (PNG, JPG)</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Favicon Upload */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Favicon (Biểu tượng tab)</label>
                        {appearanceForm.favicon_url ? (
                          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center gap-4 relative group">
                            <img src={appearanceForm.favicon_url} alt="Favicon preview" className="h-16 w-16 object-contain" />
                            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button" 
                                onClick={() => setAppearanceForm({...appearanceForm, favicon_url: ''})}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                              >
                                Xóa / Thay đổi
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                            onClick={() => {
                              const dummyUrl = prompt("Nhập URL của Favicon (Demo Upload):");
                              if (dummyUrl) setAppearanceForm({...appearanceForm, favicon_url: dummyUrl});
                            }}
                          >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                              <UploadCloud size={24} className="text-gray-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-gray-700">Kéo thả favicon vào đây</p>
                              <p className="text-xs text-gray-500 mt-1">Khuyến nghị file .ICO hoặc .PNG (32x32)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Màu sắc */}
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-red-500 to-blue-500" />
                      Màu sắc (Colors)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Màu chủ đạo (Primary Color)</label>
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 cursor-pointer">
                            <input 
                              type="color" 
                              value={appearanceForm.primary_color}
                              onChange={(e) => setAppearanceForm({...appearanceForm, primary_color: e.target.value})}
                              className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                            />
                          </div>
                          <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">#</span>
                            <input 
                              type="text"
                              value={appearanceForm.primary_color.replace('#', '')}
                              onChange={(e) => setAppearanceForm({...appearanceForm, primary_color: `#${e.target.value}`})}
                              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-bold uppercase text-gray-700 bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Màu phụ họa (Secondary Color)</label>
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 cursor-pointer">
                            <input 
                              type="color" 
                              value={appearanceForm.secondary_color}
                              onChange={(e) => setAppearanceForm({...appearanceForm, secondary_color: e.target.value})}
                              className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                            />
                          </div>
                          <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">#</span>
                            <input 
                              type="text"
                              value={appearanceForm.secondary_color.replace('#', '')}
                              onChange={(e) => setAppearanceForm({...appearanceForm, secondary_color: `#${e.target.value}`})}
                              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-bold uppercase text-gray-700 bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Phông chữ */}
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="font-serif text-xl italic font-bold text-gray-700">Aa</span>
                      Phông chữ (Typography)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Phông Tiêu đề (Heading Font)</label>
                        <select 
                          value={appearanceForm.heading_font}
                          onChange={(e) => setAppearanceForm({...appearanceForm, heading_font: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-bold text-gray-700 bg-gray-50 cursor-pointer"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Lora">Lora</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Open Sans">Open Sans</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Dùng cho các thẻ H1, H2, H3...</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Phông Văn bản (Body Font)</label>
                        <select 
                          value={appearanceForm.body_font}
                          onChange={(e) => setAppearanceForm({...appearanceForm, body_font: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-bold text-gray-700 bg-gray-50 cursor-pointer"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Lora">Lora</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Open Sans">Open Sans</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Dùng cho các đoạn văn bản chung (p, span).</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={isSavingSettings}
                      className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                    >
                      {isSavingSettings ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Lưu thay đổi Giao diện
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeMenu === 'banners' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý Banner / Slider</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Cấu hình các banner trình chiếu trên trang chủ.</p>
                  </div>
                  <button 
                    onClick={handleAddNewBanner}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={18} />
                    Thêm Slide Mới
                  </button>
                </div>

                <div className="space-y-4">
                  {banners.map((banner, index) => (
                    <div key={banner.id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-4 flex items-center gap-6 group hover:border-red-200 transition-colors">
                      
                      {/* Image Thumbnail */}
                      <div className="w-48 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative flex items-center justify-center">
                        {(banner.image_url || banner.image) ? (
                          <img 
                            src={banner.image_url || banner.image} 
                            alt="Banner thumbnail" 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="text-gray-400" size={24} />
                          </div>
                        )}
                        {!banner.status && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Đã ẩn</span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{banner.heading || <span className="text-gray-400 italic">Không có tiêu đề</span>}</h3>
                        <p className="text-sm text-gray-500 mb-3">{banner.subheading || <span className="text-gray-400 italic">Không có mô tả</span>}</p>
                        
                        <div className="flex items-center gap-4">
                          {banner.cta_text && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">
                              <ExternalLink size={14} />
                              {banner.cta_text}
                            </span>
                          )}
                          <span className={`text-xs font-bold uppercase tracking-wider ${banner.status ? 'text-green-600' : 'text-gray-400'}`}>
                            {banner.status ? 'Đang hiển thị' : 'Đang ẩn'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center gap-2 shrink-0 border-l border-gray-100 pl-6">
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
                          <button 
                            onClick={() => handleMoveBanner(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none"
                            title="Di chuyển lên"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            onClick={() => handleMoveBanner(index, 'down')}
                            disabled={index === banners.length - 1}
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full mt-2">
                          <button 
                            onClick={() => handleEditBanner(banner)}
                            className="flex-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex justify-center" 
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="flex-1 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex justify-center" 
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}

                  {banners.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-sm font-bold text-gray-900">Chưa có banner nào</h3>
                      <p className="text-sm text-gray-500 mt-1">Bắt đầu bằng cách thêm một banner mới cho trang chủ.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMenu === 'settings' && (
              <div className="animate-in fade-in duration-300 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-gray-900">Cài đặt chung (Settings)</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Thông tin công ty và các liên kết mạng xã hội.</p>
                </div>
                
                <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8">
                  <div className="space-y-12">
                    {/* Cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên công ty</label>
                        <input 
                          type="text" 
                          value={settingsForm.companyName}
                          onChange={(e) => setSettingsForm({...settingsForm, companyName: e.target.value})}
                          placeholder="Công ty TNHH Sbuild"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Hotline</label>
                        <input 
                          type="text" 
                          value={settingsForm.hotline}
                          onChange={(e) => setSettingsForm({...settingsForm, hotline: e.target.value})}
                          placeholder="1900 xxxx"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Địa chỉ</label>
                        <input 
                          type="text" 
                          value={settingsForm.address}
                          onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})}
                          placeholder="123 Đường ABC..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                        />
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Mạng xã hội */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Liên kết mạng xã hội</h3>
                          <p className="text-sm text-gray-500">Các icon mạng xã hội sẽ hiển thị trên website.</p>
                        </div>
                        <button type="button" onClick={addSocialLink} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                          <PlusCircle size={16} /> Thêm liên kết
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {settingsForm.socialLinks.map((link) => (
                          <div key={link.id} className="flex items-center gap-3">
                            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl bg-gray-50">
                              {getSocialIcon(link.platform)}
                            </div>
                            <select
                              value={link.platform}
                              onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                              className="w-32 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium bg-white"
                            >
                              <option value="facebook">Facebook</option>
                              <option value="instagram">Instagram</option>
                              <option value="tiktok">TikTok</option>
                              <option value="youtube">Youtube</option>
                              <option value="zalo">Zalo</option>
                              <option value="other">Khác</option>
                            </select>
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                              placeholder="https://..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                            />
                            <button type="button" onClick={() => removeSocialLink(link.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                        {settingsForm.socialLinks.length === 0 && (
                          <p className="text-sm text-gray-500 italic">Chưa có liên kết nào. Bấm "Thêm liên kết" để bắt đầu.</p>
                        )}
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Footer Config */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Cấu hình Footer</h3>
                          <p className="text-sm text-gray-500">Thiết kế cấu trúc chân trang linh hoạt theo dạng Block.</p>
                        </div>
                        <div className="relative group">
                          <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                            <PlusCircle size={16} /> Thêm Block
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                            <button type="button" onClick={() => addFooterBlock('links')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Danh sách liên kết</button>
                            <button type="button" onClick={() => addFooterBlock('text')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Thông tin văn bản</button>
                            <button type="button" onClick={() => addFooterBlock('image')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Hình ảnh / Logo</button>
                            <button type="button" onClick={() => addFooterBlock('social')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Mạng xã hội</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        {settingsForm.footerBlocks.map((block, index) => (
                          <div key={block.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex gap-4 relative">
                            <div className="flex flex-col gap-1 items-center justify-start border-r border-gray-200 pr-3">
                              <button type="button" onClick={() => moveFooterBlock(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowUp size={16} /></button>
                              <span className="text-xs font-bold text-gray-400 my-1">{index + 1}</span>
                              <button type="button" onClick={() => moveFooterBlock(index, 'down')} disabled={index === settingsForm.footerBlocks.length - 1} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowDown size={16} /></button>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                  {block.type === 'links' ? 'Links' : block.type === 'text' ? 'Văn bản' : block.type === 'image' ? 'Hình ảnh' : 'Mạng xã hội'}
                                </span>
                                <button type="button" onClick={() => removeFooterBlock(block.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                              </div>
                              
                              {/* Block Fields */}
                              {block.type !== 'image' && block.type !== 'social' && (
                                <input type="text" value={block.title || ''} onChange={(e) => updateFooterBlock(block.id, 'title', e.target.value)} placeholder="Tiêu đề khối..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-red-500/20 outline-none" />
                              )}
                              
                              {block.type === 'text' && (
                                <textarea value={block.content || ''} onChange={(e) => updateFooterBlock(block.id, 'content', e.target.value)} placeholder="Nội dung..." rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 outline-none resize-none"></textarea>
                              )}
                              
                              {block.type === 'image' && (
                                <div className="space-y-2">
                                  <input type="text" value={block.url || ''} onChange={(e) => updateFooterBlock(block.id, 'url', e.target.value)} placeholder="URL Hình ảnh..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" />
                                  <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-600">Độ rộng (px):</label>
                                    <input type="number" value={block.width || 100} onChange={(e) => updateFooterBlock(block.id, 'width', Number(e.target.value))} className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                                  </div>
                                </div>
                              )}
                              
                              {block.type === 'links' && (
                                <div className="space-y-2 mt-2">
                                  {block.items?.map((link: any) => (
                                    <div key={link.id} className="flex items-center gap-2">
                                      <input type="text" value={link.label} onChange={(e) => updateFooterLink(block.id, link.id, 'label', e.target.value)} placeholder="Tên link" className="w-1/3 px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                                      <input type="text" value={link.url} onChange={(e) => updateFooterLink(block.id, link.id, 'url', e.target.value)} placeholder="URL" className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                                      <button type="button" onClick={() => removeFooterLink(block.id, link.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                                    </div>
                                  ))}
                                  <button type="button" onClick={() => addFooterLink(block.id)} className="text-xs font-bold text-gray-500 hover:text-gray-900">+ Thêm liên kết</button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {settingsForm.footerBlocks.length === 0 && (
                          <div className="p-8 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-sm">Chưa có Block nào. Vui lòng thêm Block để xây dựng Footer.</div>
                        )}
                      </div>

                      {/* Live Preview */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-700">Xem trước Footer trên Website (Live Preview)</h4>
                          <span className="text-xs text-gray-500 font-medium italic">* Bản xem trước giống 100% giao diện thực tế khách nhìn thấy</span>
                        </div>
                        <div 
                          style={{ backgroundColor: settingsForm.brandColor || appearanceForm.primary_color || '#dc2626' }}
                          className="text-white p-8 sm:p-10 rounded-2xl shadow-xl space-y-10 transition-colors duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                            {/* Col 1: Thông tin công ty & Logo */}
                            <div className="lg:col-span-4">
                              <div className="flex flex-col gap-2 mb-4">
                                {(settingsForm.logoUrl || appearanceForm.logo_url) ? (
                                  <img src={settingsForm.logoUrl || appearanceForm.logo_url} alt="Logo" className="h-10 w-auto object-contain self-start bg-white/10 p-1 rounded" />
                                ) : null}
                                <span className="text-sm font-black uppercase tracking-widest text-white">
                                  {settingsForm.companyName || 'Công ty TNHH Đầu tư Xây dựng Sbuild'}
                                </span>
                              </div>
                              <p className="text-[12px] opacity-80 leading-relaxed mb-6 font-medium">
                                Nhà cung cấp chuyên nghiệp các giải pháp vật tư, phụ kiện và dụng cụ thi công xây dựng với chất lượng hàng đầu tại Việt Nam.
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                {(settingsForm.socialLinks || []).map((link: any, idx: number) => (
                                  <div key={`preview-soc-${idx}`} className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white">
                                    {getSocialIcon(link.platform)}
                                  </div>
                                ))}
                                {(!settingsForm.socialLinks || settingsForm.socialLinks.length === 0) && (
                                  <span className="text-xs opacity-60 italic">(Chưa có liên kết MXH)</span>
                                )}
                              </div>
                            </div>

                            {/* Dynamic Blocks */}
                            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {settingsForm.footerBlocks.map((block: any, index: number) => (
                                <div key={`preview-block-${block.id || index}`}>
                                  <h3 className="text-[11px] font-bold uppercase opacity-60 tracking-widest mb-4">
                                    {block.title || 'Block tiêu đề'}
                                  </h3>
                                  {block.type === 'links' && (
                                    <ul className="flex flex-col gap-2 font-medium text-[12px] opacity-90">
                                      {block.items?.map((item: any, i: number) => (
                                        <li key={i}>{item.label || item.title || 'Tên liên kết'}</li>
                                      ))}
                                      {(!block.items || block.items.length === 0) && <li className="italic opacity-60">(Trống)</li>}
                                    </ul>
                                  )}
                                  {block.type === 'text' && (
                                    <p className="text-[12px] opacity-80 leading-relaxed font-medium whitespace-pre-line">
                                      {block.content || 'Nội dung văn bản...'}
                                    </p>
                                  )}
                                  {block.type === 'image' && block.url && (
                                    <img src={block.url} alt="Block img" style={{ width: `${block.width || 100}px` }} className="rounded" />
                                  )}
                                </div>
                              ))}
                              {settingsForm.footerBlocks.length === 0 && (
                                <div className="text-xs opacity-60 italic">Bấm "Thêm Block" ở trên để bổ sung cột nội dung.</div>
                              )}
                            </div>

                            {/* Col Contact */}
                            <div className="lg:col-span-4">
                              <h3 className="text-[11px] font-bold uppercase opacity-60 tracking-widest mb-4">Thông tin liên hệ</h3>
                              <ul className="flex flex-col gap-3 text-[12px] font-medium opacity-90">
                                <li className="flex items-start gap-2.5">
                                  <span className="shrink-0 mt-0.5">📍</span>
                                  <span>{settingsForm.address || 'Tầng 5, Tòa nhà Sbuild, Quận 1, TP.HCM'}</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                  <span className="shrink-0">📞</span>
                                  <span>{settingsForm.hotline || '0901 234 567'}</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                  <span className="shrink-0">✉️</span>
                                  <span>{settingsForm.email || 'contact@sbuild.vn'}</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Bottom Bar */}
                          <div className="border-t border-white/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium opacity-75">
                            <p>&copy; {new Date().getFullYear()} {settingsForm.companyName || 'SBUILD'}. Tất cả quyền được bảo lưu.</p>
                            <div className="flex gap-4">
                              <span>Điều khoản dịch vụ</span>
                              <span>Hỗ trợ khách hàng</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSavingSettings}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSavingSettings ? <Loader2 size={16} className="animate-spin" /> : null}
                      Lưu cài đặt
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeMenu === 'media' && (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Thư viện Media</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Quản lý và lưu trữ hình ảnh trên hệ thống.</p>
                  </div>
                </div>

                <div 
                  className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer mb-8
                    ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleMediaUpload(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => handleMediaUpload(e.target.files)}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={40} className="text-red-500 animate-spin mb-3" />
                      <p className="text-sm font-bold text-gray-700">Đang tải ảnh lên...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <UploadCloud size={28} className="text-red-600" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">Kéo thả hình ảnh vào đây</p>
                      <p className="text-sm text-gray-500 font-medium">hoặc click để chọn file từ máy tính</p>
                    </div>
                  )}
                </div>

                {!mediaLoaded && mediaFiles.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="text-red-500 animate-spin" />
                  </div>
                ) : mediaFiles.length === 0 ? (
                  <div className="text-center py-12 border border-gray-100 bg-white rounded-2xl">
                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">Chưa có hình ảnh nào</h3>
                    <p className="text-sm text-gray-500 mt-1">Hãy tải lên hình ảnh đầu tiên của bạn.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                    {mediaFiles.map((file, idx) => (
                      <div key={idx} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          <img 
                            src={file.url} 
                            alt={file.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                            <button 
                              onClick={() => copyToClipboard(file.url)}
                              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-colors"
                              title="Copy URL"
                            >
                              <Copy size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteMedia(file.path)}
                              className="p-2.5 bg-red-500/80 hover:bg-red-600 text-white rounded-xl backdrop-blur-md transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-bold text-gray-900 truncate" title={file.name}>{file.name}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeMenu === 'orders' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý Đơn hàng</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Theo dõi và cập nhật trạng thái đơn hàng.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Filter size={16} />
                      </div>
                      <select 
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none shadow-sm cursor-pointer"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="shipped">Đang giao</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider font-bold text-gray-500">
                        <th className="px-6 py-4">Mã đơn</th>
                        <th className="px-6 py-4">Khách hàng</th>
                        <th className="px-6 py-4">Ngày tạo</th>
                        <th className="px-6 py-4">Tổng tiền</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.filter(o => orderFilter === 'all' || o.status === orderFilter).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{order.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-700">{order.customer}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-500">{order.date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => {
                                setOrders(orders.map(o => o.id === order.id ? { ...o, status: e.target.value } : o));
                                showToast(`Đã cập nhật trạng thái đơn ${order.id}`);
                              }}
                              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-red-500/20 outline-none transition-colors ${
                                order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}
                            >
                              <option value="pending" className="bg-white text-gray-900">Chờ xử lý</option>
                              <option value="paid" className="bg-white text-gray-900">Đã thanh toán</option>
                              <option value="shipped" className="bg-white text-gray-900">Đang giao</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderModalOpen(true);
                              }}
                              className="text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5"
                            >
                              <Eye size={14} />
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.filter(o => orderFilter === 'all' || o.status === orderFilter).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">Không tìm thấy đơn hàng nào.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProductSubmit}
        categories={categories}
        initialData={editingProduct}
      />
      
      <PostFormModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostSubmit}
        categories={postCategories}
        initialData={editingPost}
      />
      <PageFormModal 
        isOpen={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        onSubmit={handlePageSubmit}
        initialData={editingPage}
      />
      <BannerFormModal 
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onSubmit={handleBannerSubmit}
        initialData={editingBanner}
      />
      <OrderDetailModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={(id, status) => {
          setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
          if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status });
          }
          showToast(`Đã cập nhật trạng thái đơn ${id}`);
        }}
      />

      {/* Project Form Modal */}
      <ProjectFormModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        initialData={projectForm}
        onSubmit={(data) => {
          if (projectForm.id) {
            setAdminProjects(prev => prev.map(p => p.id === data.id ? data : p));
            showToast('Đã cập nhật dự án thành công.');
          } else {
            setAdminProjects(prev => [data, ...prev]);
            showToast('Đã thêm dự án mới thành công.');
          }
          setIsProjectModalOpen(false);
        }}
      />
    </div>
  );
}
