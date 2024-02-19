import { createRoute } from 'honox/factory'
import Counter from '../islands/counter'

export default createRoute((c) => {
  return c.render(
    <div>
      <h1>Hello, Hono!</h1>
      <Counter />
    </div>,
    { title: "Hono" }
  )
})
