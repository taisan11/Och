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
import OldUI from './oldui'

type Bindings = {
    ip: SocketAddress
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(trimTrailingSlash())
const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest)
}

app.use(logger(customLogger))
// app.use(compress())
app.use(cors())
// app.use(csrf())
app.use(etag())
app.use(secureHeaders())

app.route("/", OldUI);
app.route("/api",API)
app.route("/", BBS);

export default {
    async fetch(request) {
        let headers = new Headers();
        return app.fetch(request, { ip: {address:headers.get("cf-connecting-ip")} });
    },
}