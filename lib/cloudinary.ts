import { v2 as cloudinary } from 'cloudinary'
import { toWebp } from './sharp'
import { env } from '@/utils/env'
import { isImageURI } from '@/utils/helper'
import type { UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
})

/**
 * upload base64 file to cloudinary
 * @param {string} dataURI base64
 * @param {string} path images/userId
 * @param {string} name userId-imageId
 * @returns {string} url from cloudinary
 */
export async function uploadImage(
  dataURI: string,
  path: string,
  name: string,
  size?: { width: number; height: number }
) {
  if (!isImageURI(dataURI)) {
    throw new Error('invalid data')
  }

  const webp = await toWebp(dataURI, size)

  if (!webp || !path || !name) {
    throw new Error('invalid params')
  }

  const fileSizeInMB = webp.length / (1024 * 1024)
  if (fileSizeInMB > 10) {
    throw new Error('file size cannot exceed 10mb')
  }

  const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          asset_folder: path,
          public_id: name,
          overwrite: true,
          use_asset_folder_as_public_id_prefix: true,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            return reject(error || new Error('upload failed'))
          }
          return resolve(uploadResult)
        }
      )
      .end(webp)
  })

  return `${uploadResult.secure_url}?t=${Date.now()}`
}
