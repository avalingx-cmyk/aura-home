import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/delivery-zones - List delivery zones
export async function GET() {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('active', true)
    .order('fee')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ zones: data })
}