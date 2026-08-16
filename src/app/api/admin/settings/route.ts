import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Route guard: restrict to staff
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
    }

    const body = await req.json();
    const { faqs, ...settings } = body;

    // Save settings and FAQs atomically
    await prisma.$transaction(async (tx) => {
      // 1. Upsert site settings
      for (const [key, value] of Object.entries(settings)) {
        await tx.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }

      // 2. Sync FAQs (delete old ones and recreate in order)
      if (Array.isArray(faqs)) {
        await tx.faq.deleteMany({});
        for (let i = 0; i < faqs.length; i++) {
          const f = faqs[i];
          if (f.question.trim() && f.answer.trim()) {
            await tx.faq.create({
              data: {
                question: f.question,
                answer: f.answer,
                orderIndex: i,
                isEnabled: true,
              },
            });
          }
        }
      }
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings save error:', error);
    return NextResponse.json({ error: 'Failed to update store settings' }, { status: 500 });
  }
}
