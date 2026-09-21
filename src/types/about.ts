export interface AboutPageConfig {
  // 1. Hero
  hero: {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
  };
  // 2. Chúng tôi là ai
  whoWeAre: {
    badge: string;
    heading: string;
    description: string;
    image: string;
    featurePills: Array<{ id: string; label: string; icon: string }>;
  };
  // 3. Sứ mệnh & Tầm nhìn
  missionVision: {
    mission: {
      badge: string;
      title: string;
      description: string;
    };
    vision: {
      badge: string;
      title: string;
      description: string;
    };
  };
  // 4. Giải pháp cho từng hạng mục
  solutions: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      link: string;
    }>;
  };
  // 5. Giá trị cốt lõi
  coreValues: {
    badge: string;
    title: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  // 6. Đội ngũ phát triển SBUILD
  team: {
    badge: string;
    title: string;
    subtitle: string;
    image: string;
    pillars: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  // 7. Đối tác khách hàng
  partners: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      label: string;
      icon: string;
    }>;
  };
  // 8. CTA Banner
  ctaBanner: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
}

export const DEFAULT_ABOUT_PAGE_CONFIG: AboutPageConfig = {
  hero: {
    breadcrumbHome: 'Trang chủ',
    breadcrumbCurrent: 'Giới thiệu',
    badge: 'VỀ SBUILD',
    title: 'VẬT TƯ & GIẢI PHÁP HOÀN THIỆN CÔNG TRÌNH',
    subtitle: 'Từ lựa chọn vật liệu đến từng chi tiết hoàn thiện, SBUILD đồng hành cùng nhu cầu thi công thực tế.',
    ctaText: 'KHÁM PHÁ GIẢI PHÁP',
    ctaLink: '#solutions',
    backgroundImage: '/images/about/about-hero.jpg'
  },
  whoWeAre: {
    badge: 'CHÚNG TÔI LÀ AI',
    heading: 'Hoàn thiện bắt đầu từ lựa chọn đúng',
    description: 'SBUILD cung cấp nẹp, vật tư và giải pháp phục vụ hoàn thiện xây dựng. Chúng tôi kết nối sản phẩm với ứng dụng, giúp khách hàng lựa chọn phù hợp với từng hạng mục thi công.',
    image: '/images/about/about-tile-trim.jpg',
    featurePills: [
      { id: '1', label: 'NẸP CHUYÊN DỤNG', icon: 'Layers' },
      { id: '2', label: 'VẬT TƯ THI CÔNG', icon: 'Wrench' },
      { id: '3', label: 'PHỤ GIA XÂY DỰNG', icon: 'FlaskConical' }
    ]
  },
  missionVision: {
    mission: {
      badge: 'SỨ MỆNH',
      title: 'Chỉn chu từ những chi tiết nhỏ',
      description: 'Cung cấp vật tư và giải pháp phù hợp, góp phần tạo nên những công trình được hoàn thiện chính xác và đồng bộ.'
    },
    vision: {
      badge: 'TẦM NHÌN',
      title: 'Đối tác cho nhu cầu hoàn thiện',
      description: 'Hướng tới trở thành đối tác cung ứng được tin cậy bởi nhà thầu, đội thi công, kiến trúc sư và đại lý.'
    }
  },
  solutions: {
    badge: 'SẢN PHẨM',
    title: 'Giải pháp cho từng hạng mục',
    subtitle: 'Danh mục vật tư gắn với nhu cầu hoàn thiện và thi công.',
    items: [
      {
        id: '1',
        title: 'Nẹp & profile hoàn thiện',
        description: 'Nẹp nhựa, nhôm, inox và profile chuyên dụng.',
        image: '/images/about/solution-profiles.jpg',
        link: '/products'
      },
      {
        id: '2',
        title: 'Dụng cụ & phụ kiện',
        description: 'Dụng cụ thi công, phụ kiện máy móc và liên kết.',
        image: '/images/about/solution-tools.jpg',
        link: '/products'
      },
      {
        id: '3',
        title: 'Hóa chất & phụ gia',
        description: 'Phụ gia xây dựng và phụ gia xi măng.',
        image: '/images/about/solution-chemicals.jpg',
        link: '/products'
      }
    ]
  },
  coreValues: {
    badge: 'GIÁ TRỊ CỐT LÕI',
    title: 'Lựa chọn phù hợp. Thi công chỉn chu.',
    items: [
      {
        id: '1',
        title: 'Ứng dụng thực tế',
        description: 'Gắn với nhu cầu thi công trong thực tế.',
        icon: 'Settings'
      },
      {
        id: '2',
        title: 'Vật liệu phù hợp',
        description: 'Lựa chọn theo từng hạng mục và điều kiện công trình.',
        icon: 'Layers'
      },
      {
        id: '3',
        title: 'Chi tiết đồng bộ',
        description: 'Đa dạng vật tư, đồng bộ trong hoàn thiện.',
        icon: 'Puzzle'
      },
      {
        id: '4',
        title: 'Thông tin rõ ràng',
        description: 'Cập nhật đặc tính và ứng dụng sản phẩm.',
        icon: 'FileText'
      }
    ]
  },
  team: {
    badge: 'CON NGƯỜI',
    title: 'Đội ngũ phát triển SBUILD',
    subtitle: 'Cùng kết nối sản phẩm, nhu cầu thi công và trải nghiệm khách hàng.',
    image: '/images/about/about-team.jpg',
    pillars: [
      {
        id: '1',
        title: 'Phát triển sản phẩm',
        description: 'Nghiên cứu và lựa chọn vật tư phù hợp với nhu cầu thị trường và thực tiễn thi công.',
        icon: 'Box'
      },
      {
        id: '2',
        title: 'Tư vấn giải pháp',
        description: 'Đồng hành cùng khách hàng trong việc lựa chọn và ứng dụng sản phẩm.',
        icon: 'MessageSquare'
      },
      {
        id: '3',
        title: 'Vận hành & cung ứng',
        description: 'Đảm bảo nguồn hàng và hỗ trợ kịp thời cho các hạng mục thi công.',
        icon: 'Truck'
      }
    ]
  },
  partners: {
    badge: 'ĐỐI TÁC KHÁCH HÀNG',
    title: 'Kết nối cùng người làm công trình',
    subtitle: 'SBUILD đồng hành cùng nhiều đối tượng trong ngành xây dựng hoàn thiện.',
    items: [
      { id: '1', label: 'NHÀ THẦU', icon: 'Building' },
      { id: '2', label: 'ĐỘI THI CÔNG', icon: 'HardHat' },
      { id: '3', label: 'KIẾN TRÚC SƯ', icon: 'DraftingCompass' },
      { id: '4', label: 'ĐẠI LÝ', icon: 'Handshake' }
    ]
  },
  ctaBanner: {
    title: 'Cùng tìm giải pháp cho công trình của bạn',
    subtitle: 'Trao đổi nhu cầu để lựa chọn vật tư phù hợp với từng hạng mục.',
    buttonText: 'LIÊN HỆ SBUILD',
    buttonLink: '/contact'
  }
};
