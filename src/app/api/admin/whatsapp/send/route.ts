import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { 
  generateOrderStatusUpdateMessage, 
  formatPhoneNumberForWhatsApp,
  createWhatsAppLink 
} from '@/lib/whatsapp'

// POST /api/admin/whatsapp/send - Send WhatsApp notification for order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, status, send_to_customer } = body

    if (!order_id || !status) {
      return NextResponse.json({ 
        error: 'order_id and status required' 
      }, { status: 400 })
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 })
    }

    // Check if customer opted in for WhatsApp
    if (!order.whatsapp_opt_in && !send_to_customer) {
      return NextResponse.json({
        success: true,
        message: 'Customer did not opt-in for WhatsApp notifications',
        skipped: true
      })
    }

    // Generate WhatsApp message
    const message = generateOrderStatusUpdateMessage(
      order.order_number,
      status,
      order.shipping_name
    )

    // Format customer phone number for WhatsApp
    const customerPhone = formatPhoneNumberForWhatsApp(order.shipping_phone)

    // Create WhatsApp link for manual sending
    const whatsappLink = createWhatsAppLink(customerPhone, message)

    // For automated sending, integrate with WhatsApp Business API here
    // For now, return the link for admin to click and send manually

    return NextResponse.json({
      success: true,
      message: 'WhatsApp notification ready',
      whatsapp_link: whatsappLink,
      customer_phone: customerPhone,
      order_number: order.order_number,
      status: status,
      // Note: In production, you'd integrate with WhatsApp API to send automatically
      // Example with Twilio:
      // await twilioClient.messages.create({
      //   from: 'whatsapp:+14155238886',
      //   to: `whatsapp:${customerPhone}`,
      //   body: message
      // })
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

// GET /api/admin/whatsapp/config - Get WhatsApp configuration
export async function GET() {
  try {
    const { 
      isWhatsAppEnabled, 
      getWhatsAppConfig 
    } = await import('@/lib/whatsapp')
    
    const config = getWhatsAppConfig()
    const enabled = isWhatsAppEnabled()

    return NextResponse.json({
      enabled,
      config: {
        phoneNumber: config.phoneNumber,
        businessName: config.businessName,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
