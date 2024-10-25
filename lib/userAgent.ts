import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

export const detectDevice = async () => {
  if (typeof process === 'undefined') {
    throw new Error('[Server method] you are importing a server-only module outside of server')
  }

  const { get } = await headers()
  const ua = get('user-agent')

  const device = new UAParser(ua || '').getDevice()

  return {
    isMobile: device.type === 'mobile',
    isTablet: device.type === 'tablet',
    isMobileDevice: device.type === 'mobile' || device.type === 'tablet',
  }
}
