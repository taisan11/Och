import type { Context } from 'hono'

export default function About(c: Context) {
    const id = c.req.param('id')
    return <h1>I'm {id}!</h1>
}