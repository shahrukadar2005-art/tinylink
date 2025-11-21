import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Link } from '@/entities/Link';
import { isValidUrl, isValidCode, generateRandomCode } from '@/lib/utils';

// GET /api/links - List all links
export async function GET() {
  try {
    const dataSource = await getDataSource();
    const linkRepository = dataSource.getRepository(Link);
    
    const links = await linkRepository.find({
      order: { createdAt: 'DESC' }
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST /api/links - Create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetUrl, customCode } = body;

    // Validate target URL
    if (!targetUrl || !isValidUrl(targetUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const linkRepository = dataSource.getRepository(Link);

    // Generate or validate code
    let code = customCode;
    if (code) {
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
      
      // Check if code already exists
      const existing = await linkRepository.findOne({ where: { code } });
      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Generate random code
      let attempts = 0;
      do {
        code = generateRandomCode();
        const existing = await linkRepository.findOne({ where: { code } });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);
      
      if (attempts >= 10) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    }

    // Create new link
    const link = linkRepository.create({
      code,
      targetUrl,
      totalClicks: 0,
      lastClickedAt: null
    });

    await linkRepository.save(link);

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}