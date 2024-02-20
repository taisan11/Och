import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

type Bindings = {
    DB: D1Database;
  };
  

const app = createApp()

// app.post('/',async (c) => {
//     const body = await c.req.parseBody();
  
//     if (body.ok) {
//       const { name, email } = body.form;
// })

showRoutes(app)

export default app
