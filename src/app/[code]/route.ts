import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Link } from "@/entities/Link";

// Redirect hand
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params; // <-- IMPORTANT FIX

    const dataSource = await getDataSource();
    const linkRepository = dataSource.getRepository(Link);

    const link = await linkRepository.findOne({ where: { code } });

    if (!link) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Update click stats
    link.totalClicks += 1;
    link.lastClickedAt = new Date();
    await linkRepository.save(link);

    return NextResponse.redirect(link.targetUrl, { status: 302 });
  } catch (error) {
    console.error("Error redirecting:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
