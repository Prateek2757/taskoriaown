import pool from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT 
        package_id,
        name,
        description,
        price,
        duration_months,
        visibility_stars,
        visibility_description,
        badge,
        free_enquiries,
        enquiry_price,
        discount_percentage,
        has_performance_insights,
        has_verified_badge,
        has_unlocked_inbox,
        display_order
      FROM professional_packages 
      WHERE is_active = true 
      ORDER BY display_order`
    );

    return NextResponse.json({
      success: true,
      packages: result.rows
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}