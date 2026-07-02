import { getProfessionalPackagesFromDB } from '@/lib/cache';
import { NextResponse } from 'next/server';

export const revalidate = 604800;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      packages: await getProfessionalPackagesFromDB(),
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
