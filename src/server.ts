import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { secureHeaders } from 'hono/secure-headers'
import BBS from './UI'
import API from './api'
import OldUI from './oldui'
// import bbsmenuJson from './module/bbsmenu'

const app = new Hono()

app.use(trimTrailingSlash())
export const customLogger = (message: string, ...rest: string[]) => {
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

// app.get("/bbsmenu.json", async (c) => {
//     return c.json(bbsmenuJson());
// })
export default app
// const server =  Bun.serve({
//     port:'8000',
//     fetch(req, server) {
//         return app.fetch(req)
//     }
// })

// console.log(`Listening on ${server.url}`);