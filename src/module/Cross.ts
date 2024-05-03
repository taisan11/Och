// クロスプラットフォームにするための条件分岐
import { config } from './config'
// Websocket
import { createBunWebSocket } from 'hono/bun'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

export function UpgradeWS(functions:Function) {
    const plat = config().preference.site.use
    if (plat === "bun") {
        const { upgradeWebSocket, websocket } = createBunWebSocket()
        return upgradeWebSocket(functions)
    } else if (plat === "cloudflare") {
        return upgradeWebSocket(functions)
    }
    function BunWS() {
        const { upgradeWebSocket, websocket } = createBunWebSocket()
        return websocket
    }
}