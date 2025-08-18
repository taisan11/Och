import { createRequire } from 'module';
import { build, Plugin } from 'esbuild';
import { nodeless, deno, env } from 'unenv';

export const DenoPlugin: Plugin = {
    name: 'unenv-Deno',
    setup(build) {
        const envConfig = env(nodeless,{});
        const alias = envConfig.alias;
        const re = new RegExp(`^(${Object.keys(alias).join('|')})$`); // this should be escaped
        //@ts-ignore
        const require = createRequire(import.meta.url);
        const aliasAbsolute = Object.fromEntries(
            Object.entries(alias).map(([key, value]) => [
                key,
                require.resolve(value).replace(/\.cjs$/, '.mjs').replace(/\\/g, '/'),
            ])
        );

        build.onResolve(
            {
                filter: re,
            },
            (args) => {
                const result = aliasAbsolute[args.path];
                return result ? { path: result } : undefined;
            }
        );
    },
};

build({
    entryPoints: ['./src/server.deno.ts'],
    outdir: 'dist',
    minify: true,
    bundle: true,
    platform: 'node',
    target: 'esnext',
    format: 'esm',
    plugins: [DenoPlugin],
    external: [
        './node_modules/unstorage/drivers/fs-lite.cjs',
        './node_modules/unstorage/drivers/fs-lite.mjs',
        './node_modules/unstorage/drivers/fs.cjs',
        './node_modules/unstorage/drivers/fs.mjs',
    ],
});
console.log('Build complete');