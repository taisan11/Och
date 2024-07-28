import type { Context } from 'hono'
import { getConnInfo as bunconn } from 'hono/bun'
import { getConnInfo as cfconn } from 'hono/cloudflare-workers'
import { getConnInfo as denoconn } from 'hono/deno'
import { runtime } from 'std-env'

export function getConnInfo(c: Context) {
  if (runtime === 'deno') {
    return denoconn(c)
  } else if (runtime === 'workerd') {
    return cfconn(c)
  } else {
    return bunconn(c)
  }
}
