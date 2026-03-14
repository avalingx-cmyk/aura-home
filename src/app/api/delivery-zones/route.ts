import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/delivery-zones - List delivery zones
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('delivery_zones')
    .select('*')
    .eq('active', true)
    .order('fee')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ zones: data })
}