import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { trimTrailingSlash } from 'hono/trailing-slash'
import BBS from './UI'
import API from './api'
import OldUI from './oldui'

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

app.route('/', OldUI)
app.route('/api', API)
app.route('/', BBS)

const server = Bun.serve({
  port: '8000',
  fetch(req, server) {
    return app.fetch(req)
  },
})

console.log(`Listening on ${server.url}`)
