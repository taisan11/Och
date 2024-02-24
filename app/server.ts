import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

type Bindings = {
    DB: D1Database;
  };
  

const app = createApp()

showRoutes(app)

export default app
