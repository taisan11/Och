import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import BBS from './BBS'

const app = new Hono()

app.route("/", BBS);
app.get('*', serveStatic({root: './html'}))
export default app
