import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export interface UploadResult {
  success: boolean
  publicId?: string
  url?: string
  error?: string
}

/**
 * Upload image from base64 string
 */
export async function uploadImage(
  base64Image: string,
  folder: string = 'aura-home/products'
): Promise<UploadResult> {
  try {
    // Ensure proper data URI format
    const dataUri = base64Image.startsWith('data:') 
      ? base64Image 
      : `data:image/jpeg;base64,${base64Image}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      overwrite: false,
      unique_filename: true
    }) as UploadApiResponse

    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Upload failed'
    }
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  images: string[],
  folder: string = 'aura-home/products'
): Promise<UploadResult[]> {
  const results = await Promise.all(
    images.map(image => uploadImage(image, folder))
  )
  return results
}

/**
 * Delete image by public ID
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get optimized URL for image
 */
export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
      ...(width ? [{ width }] : []),
      ...(height ? [{ height }] : []),
      { crop: 'fill' }
    ]
  })
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 200): string {
  return getOptimizedUrl(publicId, size, size)
}

export { cloudinary }