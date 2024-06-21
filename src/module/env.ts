import { Context } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { getConnInfo as getConnInfoBun } from 'hono/bun'
import { getConnInfo as getConnInfoCF } from 'hono/cloudflare-workers'
import type { ConnInfo } from 'hono/conninfo'
import { getConnInfo as getConnInfoDeno } from 'hono/deno'

export function getConnInfo(c:Context):ConnInfo|void {
    if (getRuntimeKey() === "bun") {
        return getConnInfoBun(c)
    } else if (getRuntimeKey() === "deno") {
        return getConnInfoDeno(c)
    } else if (getRuntimeKey() === "edge-light") {
        return
    } else if (getRuntimeKey() === "fastly") {
        return
    } else if (getRuntimeKey() === "node") {
        return
    } else if (getRuntimeKey() === "workerd") {
        return getConnInfoCF(c)
    } else if (getRuntimeKey() === "other") {
        return
    }
    return
}
