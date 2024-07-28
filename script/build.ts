import { CloudflareWokerPlugin } from './build/cloudflare'
// only Bun!!
import { DenoPlugin } from './build/deno'
import { nodelessPlugin } from './build/nodeless'

const type = Bun.argv[2]
async function build() {
  if (type === 'deno') {
    console.log('Deno Build')
    Bun.$`rm -rf ./dist/*`
    Bun.build({
      entrypoints: ['src/server.ts'],
      outdir: 'dist',
      minify: true,
      target: 'bun',
      plugins: [DenoPlugin],
    })
  } else if (type === 'cloudflare') {
    console.log('Cloudflare Worker Build')
    Bun.$`rm -rf ./dist/*`
    Bun.build({
      entrypoints: ['src/server.ts'],
      outdir: 'dist',
      minify: true,
      target: 'bun',
      plugins: [CloudflareWokerPlugin],
    })
  } else {
    console.log('Start Build')
    const result = await Bun.build({
      entrypoints: ['src/server.ts'],
      outdir: 'dist',
      minify: true,
      target: 'bun',
      plugins: [nodelessPlugin],
    })
    console.log(result)
    for (const message of result.logs) {
      // Bun will pretty print the message object
      console.log(message.message)
    }
  }
}
build()
