import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AH-${timestamp}-${random}`
}

// GET /api/orders - List orders
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('id')
  const orderNumber = searchParams.get('order_number')
  const customerEmail = searchParams.get('customer_email')

  // Get single order by ID or order number
  if (orderId || orderNumber) {
    let query = supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*)')
    
    if (orderId) {
      query = query.eq('id', orderId)
    } else if (orderNumber) {
      query = query.eq('order_number', orderNumber)
    }

    const { data, error } = await query.single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ order: data })
  }

  // List orders (optionally filtered by customer email)
  let query = supabaseAdmin
    .from('orders')
    .select('*, items:order_items(*)')
  
  if (customerEmail) {
    query = query.eq('shipping_email', customerEmail)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: data })
}

// POST /api/orders - Create order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, shipping, payment_method, notes } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    // Calculate subtotal
    let subtotal = 0
    for (const item of items) {
      subtotal += parseFloat(item.price) * item.quantity
    }

    // Get delivery zone fee
    let shippingFee = 0
    if (shipping.zone) {
      const { data: zone } = await supabaseAdmin
        .from('delivery_zones')
        .select('fee')
        .eq('name', shipping.zone)
        .single()
      shippingFee = zone?.fee || 0
    }

    const total = subtotal + shippingFee
    const orderNumber = generateOrderNumber()

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: 'pending',
        subtotal,
        shipping_fee: shippingFee,
        total,
        payment_method,
        payment_status: 'pending',
        shipping_name: shipping.name,
        shipping_phone: shipping.phone,
        shipping_email: shipping.email,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_zone: shipping.zone,
        delivery_date: shipping.delivery_date,
        delivery_time_slot: shipping.delivery_time_slot,
        notes
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: parseFloat(item.price) * item.quantity
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: orderItems
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/orders - Update order status
export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, status, payment_status } = body

  const updateData: any = {}
  if (status) updateData.status = status
  if (payment_status) updateData.payment_status = payment_status

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ order: data })
}