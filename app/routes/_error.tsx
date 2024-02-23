import { ErrorHandler } from 'hono'

const handler: ErrorHandler = (e, c) => {
  return c.render(
  <>
  <h1>えらー</h1>
  <p> {e.message}</p>
  </>
  )
}

export default handler