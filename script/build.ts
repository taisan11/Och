// only Bun!!
import { DenoPlugin } from "./build/deno"
import { nodelessPlugin } from "./build/nodeless"
import { CloudflareWokerPlugin } from "./build/cloudflare"


const type = Bun.argv[2]
console.log('type:'+type)
async function build() {
    if (type === 'deno') {
        console.log('Deno Build')
        Bun.$`rm -rf ./dist/*`
        Bun.build(
            {
                entrypoints: ['src/server.ts'],
                outdir: 'dist',
                minify: true,
                target:'bun',
                plugins: [DenoPlugin]
            },
        )
    } else if (type === 'cloudflare') {
        console.log('Cloudflare Worker Build')
        Bun.$`rm -rf ./dist/*`
        Bun.build(
            {
                entrypoints: ['src/server.ts'],
                outdir: 'dist',
                minify: true,
                target:'bun',
            },
        )
    } else {
    console.log('Start Build')
    Bun.build(
        {
            entrypoints: ['src/server.ts'],
            outdir: 'dist',
            minify: true,
            target:'bun',
            plugins: [nodelessPlugin]
        },
    )
}
}
build()