import 'server-only'

import * as _ from 'lodash-es'
import mimeTypes from 'mime-types'
import { Storage } from '@google-cloud/storage'
import { toWebp } from './sharp'
import { env } from '@/utils/env'

const { gcp } = env

const storage = new Storage({
  projectId: gcp.projectId,
  credentials: {
    client_email: gcp.clientEmail,
    private_key: gcp.privateKey,
  },
})

/**
 * upload base64 file to gcp bucket
 * @param {string} dataURI base64
 * @param {string} path images/userId
 * @param {string} name userId-imageId
 * @returns {string} url from gcp bucket
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

  // convert dataURI to buffer
  // const { buffer, fileName, contentType } = dataURItoBuffer(webp, name)

  // get bucket
  const bucket = storage.bucket(gcp.bucketName)

  //  upload
  const file = bucket.file(`${path}/${name}.webp`)
  const metadata = { contentType: 'image/webp' }
  await file.save(webp, { metadata })

  // avoid cache
  const gcpUrl = `https://storage.googleapis.com/${gcp.bucketName}/${file.name}?t=${Date.now()}`
  return gcpUrl
}

const dataURItoBuffer = (dataURI: string, name: string) => {
  // data:image/png;base64,iVBORw0...
  const arr = dataURI.split(',')
  const matches = arr[0].match(/:(.*?);/)
  const type = _.get(matches, [1], 'undefined')
  // mimeTypes
  const extension = mimeTypes.extension(type)
  if (!extension) {
    throw new Error(`invalid mimeTypes: ${type}`)
  }

  const contentType = `image/${extension}`
  const fileName = `${name}.${extension}`
  const buffer = Buffer.from(arr[1], 'base64')
  return { fileName, contentType, extension, buffer }
}

export function isImageURI(str?: string) {
  if (!str) return false

  const regex = /^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/]+={0,2}$/
  return regex.test(str)
}
