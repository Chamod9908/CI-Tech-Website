import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.tiff', '.tif', '.psd', '.ai'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 });
    }

    // 2. Validate File Type
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: `File type not supported. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` }, { status: 400 });
    }

    // 3. Generate secure, unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}${ext}`;
    const secureUploadsDir = path.join(process.cwd(), 'secure_uploads');

    // 4. Ensure directory exists
    await fs.mkdir(secureUploadsDir, { recursive: true });

    // 5. Save file in secure_uploads
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(secureUploadsDir, filename), buffer);

    return NextResponse.json({
      success: true,
      filename: file.name,
      fileType: file.type || ext.replace('.', ''),
      fileSize: file.size,
      url: `/secure_uploads/${filename}`,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}

