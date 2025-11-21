import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Link } from "@/entities/Link";

// GET /api/links/:code - Get stats for one code
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params; // FIXED

    const dataSource = await getDataSource();
    const linkRepository = dataSource.getRepository(Link);

    const link = await linkRepository.findOne({ where: { code } });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      { error: "Failed to fetch link" },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - Delete link
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params; // FIXED

    const dataSource = await getDataSource();
    const linkRepository = dataSource.getRepository(Link);

    const link = await linkRepository.findOne({ where: { code } });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    await linkRepository.remove(link);

    return NextResponse.json(
      { message: "Link deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}
