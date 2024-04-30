import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { SocketAddress } from 'bun'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger } from 'hono/logger'
import BBS from './BBS'
import TBS from './TBS'
import admin from './admin'

type Bindings = {
    ip: SocketAddress
  }
  

const app = new Hono<{ Bindings: Bindings }>()

app.use(trimTrailingSlash())
export const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest)
}
app.use(logger(customLogger))
// app.use(async (c, next) => {
//     // Print IP
//     console.log(c.env.ip)
//     await next()
// })
// app.get('/',(c) => c.text('Hello World'))
app.route("/", BBS);
app.route("/",admin)
app.route("/TBS", TBS);
// app.get('*', serveStatic({root: './html'}))

Bun.serve({
    port:'8000',
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) })
    }
})