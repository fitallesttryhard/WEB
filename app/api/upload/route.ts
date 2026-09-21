import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file tải lên' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Xác định thư mục lưu trữ
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Đặt tên file an toàn
    const originalName = file.name || 'banner.png';
    const ext = path.extname(originalName) || '.png';
    const cleanExt = ext.toLowerCase();
    const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${cleanExt}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: originalName,
      size: buffer.length
    });
  } catch (error: any) {
    console.error('Lỗi khi tải ảnh lên server:', error);
    return NextResponse.json({ success: false, error: error.message || 'Lỗi xử lý file tải lên' }, { status: 500 });
  }
}
