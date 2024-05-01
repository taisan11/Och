import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { SocketAddress } from 'bun'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger } from 'hono/logger'
import BBS from './BBS'
import TBS from './TBS'
import admin from './admin'
import API from './api'

type Bindings = {
    ip: SocketAddress
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(trimTrailingSlash())
export const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest)
}
app.use(logger(customLogger))
// 下記の2つは取り外し可能です
app.route("/TBS", TBS);
app.route("/api",API)
app.route("/", BBS);
app.route("/",admin)
// app.get('*', serveStatic({root: './html'}))

const server =  Bun.serve({
    port:'8000',
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) })
    }
})

console.log(`Listening on ${server.url}`);