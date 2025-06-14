import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { etag } from 'hono/etag'
import { secureHeaders } from 'hono/secure-headers'
import BBS from './UI'
import API from './api'
import OldUI from './oldui'
import admin from './admin'
// import bbsmenuJson from './module/bbsmenu'

const app = new Hono()

app.use(trimTrailingSlash())
app.use(logger())
// app.use(compress())
app.use(cors())
// app.use(csrf({origin:(o)=>false}))
app.use(etag())
app.use(secureHeaders())

app.route("/admin", admin);
app.route("/api",API)
app.route("/", OldUI);
app.route("/", BBS);


// app.get("/bbsmenu.json", async (c) => {
//     return c.json(bbsmenuJson());
// })
export default app
