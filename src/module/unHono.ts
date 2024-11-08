import { runtime } from "std-env"
import { Context } from 'hono'
import type {ConnInfo} from "hono/conninfo"

export async function getConnInfo(c:Context):Promise<ConnInfo> {
    if (runtime === 'deno') {
        return import('hono/deno').then((m) => m.getConnInfo(c))
    } 
    if (runtime === 'workerd') {
        return import('hono/cloudflare-workers').then((m) => m.getConnInfo(c))
    }
    if (runtime === 'bun') {
      return import('hono/bun').then((m) => m.getConnInfo(c))
    }
    return {
      remote: {
        address:"0.0.0.0"
      }
    }
}