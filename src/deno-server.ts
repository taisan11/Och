import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
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
// import { Deno } from '@deno/types'

type Bindings = {
    ip: {
        address: string
    }
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

const server =  Deno.serve((req,info)=>{return app.fetch(req, { ip: { address: info.remoteAddr.hostname } })})
console.log(`Listening on ${server.addr.hostname}:${server.addr.port}`);