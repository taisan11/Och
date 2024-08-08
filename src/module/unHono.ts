import { getConnInfo as bunconn } from 'hono/bun'
import { getConnInfo as cfconn } from 'hono/cloudflare-workers'
import { runtime } from "std-env"
import { Context } from 'hono'

export async function getConnInfo(c:Context) {
    if (runtime === 'deno') {
        return import('hono/deno').then((m) => m.getConnInfo(c))
    } 
    if (runtime === 'workerd') {
        return import('hono/cloudflare-workers').then((m) => m.getConnInfo(c))
    }
    const info = c.env.requestIP(c.req.raw)
    if (!info){
      return null
    }
    return {
        remote: {
          address: info.address,
          addressType: info.family === "IPv6" || info.family === "IPv4" ? info.family : void 0,
          port: info.port
        }
      };
    // return import('hono/bun').then((m) => m.getConnInfo(c))
}