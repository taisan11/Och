// only Bun!!
import { DenoPlugin } from "./build/deno"
import { nodelessPlugin } from "./build/nodeless"
import { CloudflareWokerPlugin } from "./build/cloudflare"
import {statSync,existsSync} from 'fs';

const type = Bun.argv[2]
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
                plugins: [CloudflareWokerPlugin]
            },
        )
    } else {
    console.log('Start Build')
    const result = await Bun.build(
        {
            entrypoints: ['src/server.ts'],
            outdir: 'dist',
            minify: true,
            target:'bun',
            plugins: [nodelessPlugin],
            
        },
    )
    console.log(result)
    for (const message of result.logs) {
        // Bun will pretty print the message object
        console.log(message.message);
    }
}}
build().then(() => {
    const path = './dist/server.js';
    if (existsSync(path)) {
        const stats = statSync(path);
        console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
    }
})