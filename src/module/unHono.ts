import { getConnInfo as bunconn } from 'hono/bun'
import { getConnInfo as cfconn } from 'hono/cloudflare-workers'
import { runtime } from "std-env"
import { Context } from 'hono'

export function getConnInfo(c:Context) {
    if (runtime === 'deno') {
        return import('hono/deno').then((m) => m.getConnInfo(c))
    } 
    if (runtime === 'workerd') {
        return cfconn(c)
    }
    return bunconn(c)
}