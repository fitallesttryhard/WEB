import { saveArticle } from '../src/articleServices';

const sbuildArticles = [
  {
    title: 'Phân Tích Các Tiêu Chuẩn Lắp Đặt Giàn Giáo Mới Nhất Năm 2026',
    category: 'Kỹ Thuật Thi Công',
    cover_image: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Tìm hiểu các tiêu chuẩn mới nhất trong việc lắp đặt và tháo dỡ giàn giáo, đảm bảo an toàn thi công ở mức độ cao nhất.',
    html_content: `
      <p>Giàn giáo là thiết bị thiết yếu trên mọi công trình xây dựng. Trong năm 2026, các tiêu chuẩn an toàn lao động đối với việc sử dụng giàn giáo đã có những thay đổi đáng kể nhằm giảm thiểu tối đa tai nạn lao động.</p>
      <h3>1. Yêu cầu về vật liệu</h3>
      <p>Ống thép mạ kẽm hiện tại là vật liệu tiêu chuẩn để sản xuất giàn giáo, thay vì thép đen như trước đây, do khả năng chịu lực và chống ăn mòn vượt trội.</p>
      <h3>2. Tiêu chuẩn lắp ráp</h3>
      <p>Hệ giàn giáo cần được khóa chặt bởi các cùm xoay đạt chuẩn. Hệ thống mâm giáo, thang leo phải có khóa chống trượt an toàn tuyệt đối. Khoảng cách giữa các tầng giáo không vượt quá 2m.</p>
      <p>S-BUILD tự hào là đơn vị phân phối và cung cấp giải pháp giàn giáo đạt tiêu chuẩn quốc tế, bảo vệ mọi công trình an toàn tuyệt đối.</p>
    `,
    author: 'Ban Kỹ Thuật S-BUILD'
  },
  {
    title: 'Giải Pháp Nẹp Inox Chữ U Trong Thi Công Nội Thất Hiện Đại',
    category: 'Cẩm Nang Vật Tư',
    cover_image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Ứng dụng linh hoạt của nẹp inox chữ U tạo điểm nhấn tinh tế cho vách tường, ron sàn gỗ, và khung cửa.',
    html_content: `
      <p>Nẹp inox chữ U là một trong những phụ kiện hoàn thiện không thể thiếu trong các công trình mang phong cách thiết kế hiện đại, từ căn hộ chung cư cao cấp đến các khu nghỉ dưỡng.</p>
      <h3>Ưu điểm của nẹp U Inox 304</h3>
      <ul>
        <li><strong>Chống gỉ sét:</strong> Inox 304 mạ PVD đảm bảo độ bền màu tuyệt đối trong mọi điều kiện thời tiết.</li>
        <li><strong>Thiết kế sắc nét:</strong> Đường nét gọn gàng giúp che khuyết điểm tại các khe nối vật liệu.</li>
        <li><strong>Ứng dụng đa dạng:</strong> Tạo đường ron âm trên vách ốp gỗ, chạy viền chỉ tường, bo cạnh gương.</li>
      </ul>
      <p>Với bộ sưu tập màu sắc đa dạng như Vàng Gương, Trắng Xước, Đen Mờ, S-BUILD đem đến cho kiến trúc sư sự linh hoạt trong từng thiết kế.</p>
    `,
    author: 'Ban Kỹ Thuật S-BUILD'
  },
  {
    title: 'Hướng Dẫn Lựa Chọn Ván Khuê (Cốp Pha) Cho Công Trình Chịu Tải Cao',
    category: 'Kỹ Thuật Thi Công',
    cover_image: 'https://images.unsplash.com/photo-1621844962450-48e0d456720f?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Cốp pha gỗ phủ phim hay cốp pha thép? Hãy cùng S-BUILD so sánh và lựa chọn giải pháp tối ưu cho tiến độ và chi phí.',
    html_content: `
      <p>Trong quá trình đổ bê tông, ván khuôn (cốp pha) đóng vai trò định hình và chịu lực cực kỳ quan trọng. Chọn sai loại ván khuôn có thể gây ra hiện tượng phình, bục bê tông.</p>
      <h3>Cốp pha gỗ phủ phim</h3>
      <p>Là lựa chọn phổ biến cho sàn và vách tầng. Ưu điểm là nhẹ, dễ cắt gọt, bề mặt nhẵn mịn (tiết kiệm chi phí trát trần). Tuy nhiên, số lần tái sử dụng thường chỉ từ 6-8 lần.</p>
      <h3>Cốp pha thép, nhôm</h3>
      <p>Cho khả năng chịu tải vượt trội, không biến dạng, có thể tái sử dụng hàng trăm lần. Đây là phương án tuyệt vời cho các dự án cao tầng với thiết kế móng, vách lặp lại.</p>
      <p>Liên hệ ngay với S-BUILD để được tư vấn thiết kế hệ thống cốp pha phù hợp nhất với kết cấu dự án của bạn.</p>
    `,
    author: 'Phòng Dự Án S-BUILD'
  },
  {
    title: 'Tối Ưu Hóa Chi Phí Vật Tư Với Ống Thép Đen Và Thép Mạ Kẽm',
    category: 'Thị Trường & Báo Giá',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Phân tích chênh lệch giá thành và tuổi thọ giữa ống thép đen và ống thép mạ kẽm để tối ưu ngân sách công trình.',
    html_content: `
      <p>Lựa chọn giữa thép đen và thép mạ kẽm luôn là bài toán chi phí mà các nhà thầu cần giải quyết. Việc phân bổ đúng loại vật tư cho từng hạng mục giúp giảm đáng kể chi phí ban đầu mà vẫn đảm bảo tuổi thọ công trình.</p>
      <h3>Ống thép mạ kẽm nhúng nóng</h3>
      <p>Được sử dụng cho các hạng mục ngoài trời, tiếp xúc trực tiếp với môi trường hoặc đi ngầm dưới đất. Lớp kẽm dày bảo vệ lõi thép bên trong khỏi sự ăn mòn điện hóa.</p>
      <h3>Ống thép đen</h3>
      <p>Phù hợp với các hệ thống đường ống dẫn khí, hệ thống PCCC trong nhà hoặc các cấu kiện được bọc bê tông. Giá thành rẻ hơn từ 15-20% so với thép mạ kẽm.</p>
      <p>S-BUILD tự hào cung cấp các sản phẩm ống thép từ các thương hiệu hàng đầu như Hòa Phát, Hoa Sen với mức chiết khấu cực tốt.</p>
    `,
    author: 'Phòng Mua Hàng S-BUILD'
  },
  {
    title: 'Cải Tiến Thẩm Mỹ Công Trình Cùng Nẹp Bo Góc Tròn Bằng Nhôm',
    category: 'Cẩm Nang Vật Tư',
    cover_image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Nẹp bo góc tròn bằng nhôm mang lại diện mạo mềm mại, hiện đại và bảo vệ các cạnh góc tường khỏi va đập nứt vỡ.',
    html_content: `
      <p>Khác biệt với nẹp bo góc vuông V, nẹp góc tròn tạo ra những đường cong mềm mại tại các cạnh cột, mép tường ốp gạch men, mang lại cảm giác an toàn và thân thiện, đặc biệt thích hợp cho bệnh viện, trường mầm non.</p>
      <h3>Lợi ích vượt trội</h3>
      <ul>
        <li><strong>An toàn tuyệt đối:</strong> Loại bỏ hoàn toàn cạnh sắc nhọn, giảm sát thương khi va chạm.</li>
        <li><strong>Thi công nhanh chóng:</strong> Không cần cắt líp gạch 45 độ, vừa giảm tỷ lệ hao hụt gạch, vừa tiết kiệm nhân công.</li>
        <li><strong>Độ bền cao:</strong> Phôi nhôm cao cấp kết hợp mạ Anode giúp nẹp không bị oxy hóa hay bay màu trong môi trường ẩm.</li>
      </ul>
      <p>S-BUILD luôn có sẵn số lượng lớn nẹp bo góc tròn với nhiều kích thước và màu sắc, phục vụ tức thì mọi nhu cầu của nhà thầu.</p>
    `,
    author: 'Ban Kỹ Thuật S-BUILD'
  },
  {
    title: 'Các Loại Kích Tăng Giàn Giáo Phổ Biến Và Cách Lựa Chọn',
    category: 'Kỹ Thuật Thi Công',
    cover_image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Sự khác biệt giữa kích U và kích bằng. Làm thế nào để điều chỉnh chiều cao hệ chống một cách chính xác và an toàn.',
    html_content: `
      <p>Kích tăng (kích đế, kích đầu) là thiết bị hỗ trợ điều chỉnh độ cao linh hoạt cho hệ thống giàn giáo, giúp hệ chống vững chắc trên mọi bề mặt không bằng phẳng.</p>
      <h3>1. Kích Tăng Bằng (Kích Đế)</h3>
      <p>Được đặt ở phía dưới chân giàn giáo, tiếp xúc trực tiếp với mặt đất. Loại kích này giúp giàn giáo cân bằng, tránh nghiêng đổ. Yêu cầu độ dày ống ren từ 4mm trở lên để đảm bảo tải trọng.</p>
      <h3>2. Kích Tăng U (Kích Đầu)</h3>
      <p>Lắp trên đỉnh giàn giáo, thiết kế hình chữ U để đỡ xà gồ thép (hệ đỡ cốp pha). Độ vươn an toàn của kích tăng không được vượt quá 2/3 tổng chiều dài của kích.</p>
      <p>Tại S-BUILD, các sản phẩm kích tăng đều được tiện ren ống thép nguyên bản, đảm bảo khả năng chịu lực tuyệt đối, không trượt ren khi đội tải nặng.</p>
    `,
    author: 'Phòng Kỹ Thuật S-BUILD'
  },
  {
    title: 'Xu Hướng Sử Dụng Nẹp Đồng Nguyên Chất Trong Kiến Trúc Tân Cổ Điển',
    category: 'Cẩm Nang Vật Tư',
    cover_image: 'https://images.unsplash.com/photo-1598928305112-9c17e3be93c9?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Nẹp đồng mang đến vẻ đẹp vĩnh cửu, sang trọng và đậm chất quyền quý cho các công trình Tân Cổ Điển.',
    html_content: `
      <p>Trong các thiết kế Tân Cổ Điển (Neoclassic), chất liệu đồng nguyên chất luôn được ưu ái sử dụng nhờ màu sắc ấm áp, rực rỡ và khả năng kháng khuẩn tự nhiên.</p>
      <h3>Vì sao chọn Nẹp Đồng?</h3>
      <p>Nẹp đồng có đặc tính dẻo dai, dễ uốn cong linh hoạt theo các mảng tường vòm, đường ron sàn cong lượn. Màu sắc của đồng thau càng dùng lâu càng tạo ra độ patina (lên nước đồng) cổ kính tự nhiên, rất phù hợp với phong cách sang trọng.</p>
      <h3>Ứng dụng phổ biến</h3>
      <ul>
        <li>Nẹp chống trơn trượt mũi bậc cầu thang đá hoa cương.</li>
        <li>Chỉ T ron nối giữa gỗ và gạch men.</li>
        <li>Nẹp bo viền gương, viền tranh trang trí nội thất.</li>
      </ul>
      <p>S-BUILD cam kết cung cấp nẹp đồng nguyên chất tỉ lệ đồng cao, gia công sắc xảo, không bị lẫn tạp chất gây gãy giòn.</p>
    `,
    author: 'Bộ phận Kiến Trúc S-BUILD'
  },
  {
    title: 'Tầm Quan Trọng Của Ván Ép Phủ Phim Chất Lượng Cao Đối Với Thẩm Mỹ Bê Tông',
    category: 'Kỹ Thuật Thi Công',
    cover_image: 'https://images.unsplash.com/photo-1504307651254-35680f356f27?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Bê tông siêu phẳng, không cần trát là xu hướng thi công hiện đại nhờ vào việc sử dụng ván ép phủ phim chất lượng cao.',
    html_content: `
      <p>Thi công "bê tông trần" (Exposed Concrete) đang là xu hướng kiến trúc được ưa chuộng. Để đạt được bề mặt bê tông láng mịn, đồng màu, chất lượng của ván ép phủ phim đóng vai trò quyết định.</p>
      <h3>Tiêu chí chọn Ván Ép Phủ Phim</h3>
      <p>Lớp phim Dynea mượt mà giúp chống thấm nước, ngăn chặn bề mặt bê tông dính vào ván. Cốt gỗ cứng (Hardwood) nhiều lớp, ép keo WBP chống sôi giúp tấm ván không bị tách lớp, phồng rộp khi tiếp xúc với xi măng và nước ngoài trời.</p>
      <p>Với ván phủ phim S-BUILD cung cấp, nhà thầu hoàn toàn có thể tự tin tháo dỡ cốp pha nhanh chóng, bề mặt bê tông phẳng lỳ, tiết kiệm tối đa chi phí nhân công trát hoàn thiện.</p>
    `,
    author: 'Ban Kỹ Thuật S-BUILD'
  },
  {
    title: 'Giải Pháp Cốp Pha Nhựa: Nhẹ - Bền - Thân Thiện Môi Trường',
    category: 'Cẩm Nang Vật Tư',
    cover_image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Cốp pha nhựa là vật liệu xanh, tái sử dụng lên đến 100 lần, mang lại hiệu quả kinh tế và thi công vượt trội.',
    html_content: `
      <p>Trong bối cảnh ngành xây dựng đang hướng tới phát triển bền vững, cốp pha nhựa composite đang dần thay thế gỗ và thép ở nhiều hạng mục công trình.</p>
      <h3>Đặc tính nổi bật của Cốp Pha Nhựa</h3>
      <ul>
        <li><strong>Siêu nhẹ:</strong> Nhẹ hơn 50% so với gỗ và 70% so với thép, giúp công nhân vận chuyển và lắp đặt dễ dàng mà không cần dùng nhiều sức hay cần cẩu.</li>
        <li><strong>Độ bền siêu hạng:</strong> Không thấm nước, không mục nát, không han gỉ. Khả năng tái sử dụng thực tế từ 60 đến 100 lần.</li>
        <li><strong>Bề mặt hoàn thiện tốt:</strong> Bê tông không bám dính vào nhựa, tháo dỡ rất nhẹ nhàng, bề mặt sau khi tháo láng mịn, phẳng.</li>
      </ul>
      <p>Dù chi phí đầu tư ban đầu cao hơn cốp pha gỗ, nhưng tính trên toàn vòng đời dự án, cốp pha nhựa do S-BUILD phân phối giúp tiết kiệm đáng kể chi phí cốp pha và quản lý vật tư.</p>
    `,
    author: 'Phòng Vật Tư S-BUILD'
  },
  {
    title: 'Báo Giá Và Quy Trình Cung Ứng Nẹp Nhôm Chữ L Cho Các Dự Án Lớn',
    category: 'Thị Trường & Báo Giá',
    cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Tìm hiểu quy trình đặt hàng, sản xuất và cung ứng nẹp nhôm chữ L số lượng lớn, đảm bảo tiến độ gắt gao của tổng thầu.',
    html_content: `
      <p>Nẹp nhôm chữ L (Nẹp kết thúc) thường được sử dụng ở mép kết thúc của thảm, sàn gỗ, hoặc bậc cầu thang để che chắn bảo vệ mép vật liệu và chống vấp ngã.</p>
      <h3>Năng lực cung ứng của S-BUILD</h3>
      <p>Đối với các siêu dự án chung cư, bệnh viện, khách sạn, nhu cầu về nẹp nhôm chữ L có thể lên tới hàng chục nghìn mét. S-BUILD tự hào sở hữu hệ thống kho bãi rộng lớn, chuỗi cung ứng trực tiếp từ nhà máy sản xuất nhôm đạt tiêu chuẩn ISO.</p>
      <p>Quy trình bao gồm:</p>
      <ol>
        <li>Tiếp nhận bản vẽ thiết kế và bóc tách khối lượng.</li>
        <li>Sản xuất mẫu trình duyệt (Mockup) trong vòng 3 ngày.</li>
        <li>Sản xuất đại trà và đóng gói theo từng mã căn hộ/tầng.</li>
        <li>Giao hàng cuốn chiếu theo đúng tiến độ thi công thực tế tại công trường.</li>
      </ol>
      <p>Chủ đầu tư và nhà thầu có nhu cầu vui lòng gửi bản vẽ qua email để nhận báo giá dự án cạnh tranh nhất từ S-BUILD.</p>
    `,
    author: 'Phòng Dự Án S-BUILD'
  }
];

async function main() {
  console.log('Đang tạo 10 bài viết cho S-BUILD...');
  for (const article of sbuildArticles) {
    const { success, data, error } = await saveArticle(article);
    if (success) {
      console.log('✅ Đã lưu thành công: ' + data?.title);
    } else {
      console.log('❌ Lỗi lưu bài: ' + article.title, error);
    }
  }
  console.log('✅ Hoàn tất việc tạo 10 bài viết.');
}

main().catch(console.error);
