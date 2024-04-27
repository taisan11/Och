import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger } from 'hono/logger'
import BBS from './BBS'

const app = new Hono()

app.use(trimTrailingSlash())
app.use(logger())
// app.get('/',(c) => c.text('Hello World'))
app.route("/", BBS);
// app.get('*', serveStatic({root: './html'}))
export default app
