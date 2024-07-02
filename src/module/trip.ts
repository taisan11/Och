import {encode} from "iconv-cp932";
import crypt from 'unix-crypt-td-js'
import { createHash } from 'node:crypto'

type Options = Partial<{
  hideWhitespace: boolean
}>

const rawKeyPettern = /^#[0-9A-Fa-f]{16}[.\/0-9A-Za-z]{0,2}$/
/**
 * @param text 文章
 * @returns 入力不可文字を変換した文章
 */
const maskSpecialSymbols = (text: string) => text.replace(/★/g, '☆').replace(/◆/g, '◇')
/**
 * @param key 一つ目の#を覗いた鍵となる部分。
 * @returns 
 */
const create12DigitsTrip = (key: string) => {
  //   const arrayBuffer = convert(key, { from: 'UNICODE', to: 'SJIS', type: 'arraybuffer', fallback: 'html-entity' })
    const arrayBuffer = encode(key)
    const byteArray = new Uint8Array(arrayBuffer)
    // 余裕があったらawaitを使用したweb標準の物を使いたい
    return createHash('sha1').update(byteArray).digest().toString('base64').replace(/\+/g, '.').substr(0, 12)
}
/**
 * @param key 一つ目の#を覗いた鍵となる部分。
 * @returns 
 */
const create10DigitsTrip = (key: string) => {
  const saltSuffixString = 'H.'
//   const encodedKeyString = convert(key, { from: 'UNICODE', to: 'SJIS', fallback: 'html-entity' })
    const encodedKeyString = encode(key).toString()

  const salt = `${encodedKeyString}${saltSuffixString}`
    // 1 文字目から 2 文字を取得する
    .substr(1, 2)
    // . から z までの文字以外を . に置換する
    .replace(/[^\.-z]/g, '.')
    // 配列にする
    .split('')
    // salt として使えない記号をアルファベットに置換する
    .map((string) => {
      if (string === ':') return 'A'
      if (string === ';') return 'B'
      if (string === '<') return 'C'
      if (string === '=') return 'D'
      if (string === '>') return 'E'
      if (string === '?') return 'F'
      if (string === '@') return 'G'
      if (string === '[') return 'a'
      if (string === '\\') return 'b'
      if (string === ']') return 'c'
      if (string === '^') return 'd'
      if (string === '_') return 'e'
      if (string === '`') return 'f'

      return string
    })
    // 文字列にする
    .join('')

  return (crypt(encodedKeyString, salt) as string).substr(-10, 10)
}
/**
 * @param key 一つ目の#を覗いた鍵となる部分。
 * @returns 
 */
const createRawKeyTrip = (key: string) => {
  const saltSuffixString = '..'

  const rawKey = key
    // 2 文字目以降の全ての文字列を取得
    .substr(1)
    // 2 文字ごとに配列に分割する
    .match(/.{2}/g)!
    // ASCII コードを ASCII 文字に変換する
    .map((hexadecimalASCIICode) => {
      const demicalASCIICode = parseInt(hexadecimalASCIICode, 16)

      return String.fromCharCode(demicalASCIICode)
    })
    // 文字列にする
    .join('')

  const salt = `${key}${saltSuffixString}`.substr(17, 2)

  return (crypt(rawKey, salt) as string).substr(-10, 10)
}
/**
 * 
 * @param key 一つ目の#を覗いた鍵となる部分。
 * @returns trip
 */
export const createTripByKey = (key: string) => {
//   const encodedKeyString = convert(key, { from: 'UNICODE', to: 'SJIS', fallback: 'html-entity' })
    const encodedKeyString = encode(key).toString()

  // 10 桁トリップ
  if (encodedKeyString.length < 12) return create10DigitsTrip(key)

  // 生キートリップ
  if (encodedKeyString.startsWith('#') || encodedKeyString.startsWith('$')) {
    // 拡張用のため ??? を返す
    if (!rawKeyPettern.test(encodedKeyString)) return '???'

    return createRawKeyTrip(key)
  }

  // 12 桁トリップ
  return create12DigitsTrip(key)
}
/**
 * 
 * @param text 文章(名前など)
 * @param options 設定する。
 * @returns tripに変換された文章とその他の文字列
 */
export const createTripByText = (text: string, options?: Options) => {
  const indexOfSharp = (() => {
    const indexOfHalfWidthSharp = text.indexOf('#')
    const indexOfFullWidthSharp = text.indexOf('＃')

    if (indexOfHalfWidthSharp >= 0) return indexOfHalfWidthSharp
    if (indexOfFullWidthSharp >= 0) return indexOfFullWidthSharp

    return -1
  })()

  if (indexOfSharp < 0) return maskSpecialSymbols(text)

  const name = text.substr(0, indexOfSharp)
  const key = text.substr(indexOfSharp + 1)

  const whitespaceIfNeeded = options?.hideWhitespace ? '' : ' '

  return `${maskSpecialSymbols(name)}${whitespaceIfNeeded}◆${createTripByKey(key)}`
}

export const createTrip = (text: string, options?: Options) => createTripByText(text, options)