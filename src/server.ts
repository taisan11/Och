import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { SocketAddress } from 'bun'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { etag } from 'hono/etag'
import { secureHeaders } from 'hono/secure-headers'
import BBS from './UI'
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
// app.use(compress())
// app.use(cors())
// app.use(csrf())
app.use(etag())
// app.use(secureHeaders())

app.route("/api",API)
app.route("/", BBS);

const server =  Bun.serve({
    port:'8000',
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) })
    }
})

console.log(`Listening on ${server.url}`);