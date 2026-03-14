import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/customer/profile - Get current user's profile
export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get customer profile
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', user.email)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      customer: customer || { email: user.email },
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/customer/profile - Update profile
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { first_name, last_name, phone } = body

    // Upsert customer profile
    const { data: customer, error } = await supabase
      .from('customers')
      .upsert({
        email: user.email,
        first_name,
        last_name,
        phone,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customer })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
