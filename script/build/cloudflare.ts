import { plugin, type BunPlugin } from "bun";
import { nodeless,env,cloudflare } from 'unenv';
import { createRequire } from 'module';
import { join } from 'path';

export const CloudflareWokerPlugin:BunPlugin = {
    name: 'unenv-Cloudflare-Woker',
    setup(build) {
      const envConfig = env(nodeless, cloudflare, {});
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