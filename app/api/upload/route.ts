import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, uploadImages } from '@/lib/cloudinary'

/**
 * POST /api/upload - Upload single or multiple images
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { image, images, folder = 'aura-home/products' } = body

    // Single image upload
    if (image) {
      const result = await uploadImage(image, folder)
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          url: result.url,
          publicId: result.publicId
        })
      }
      
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }

    // Multiple images upload
    if (images && Array.isArray(images)) {
      const results = await uploadImages(images, folder)
      
      const successful = results.filter(r => r.success)
      
      if (successful.length > 0) {
        return NextResponse.json({
          success: true,
          uploaded: successful.length,
          total: images.length,
          urls: successful.map(r => r.url),
          publicIds: successful.map(r => r.publicId)
        })
      }
      
      return NextResponse.json({
        success: false,
        error: 'All uploads failed'
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'No image(s) provided'
    }, { status: 400 })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: error.message || 'Upload failed'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/upload - Delete image
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({
        error: 'publicId required'
      }, { status: 400 })
    }

    const { deleteImage } = await import('@/lib/cloudinary')
    const deleted = await deleteImage(publicId)

    return NextResponse.json({
      success: deleted
    })

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}