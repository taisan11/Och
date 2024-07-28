import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { trimTrailingSlash } from 'hono/trailing-slash'
import BBS from './UI'
import API from './api'
import OldUI from './oldui'

const app = new Hono()

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

app.route('/', OldUI)
app.route('/api', API)
app.route('/', BBS)

export default app
