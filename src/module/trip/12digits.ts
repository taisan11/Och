import { encode } from 'iconv-cp932'
import { createHash } from 'node:crypto'

/**
 * 12 桁トリップを生成する
 */
export const create12DigitsTrip = (key: string) => {
//   const arrayBuffer = convert(key, { from: 'UNICODE', to: 'SJIS', type: 'arraybuffer', fallback: 'html-entity' })
  const arrayBuffer = encode(key)
  const byteArray = new Uint8Array(arrayBuffer)

  return createHash('sha1').update(byteArray).digest().toString('base64').replace(/\+/g, '.').substr(0, 12)
}