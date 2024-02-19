import { createRoute } from 'honox/factory'
import Counter from '../islands/counter'

export default createRoute((c) => {
  return c.render(
    <div>
      <h1>Och</h1>
      <p>0ではないOな掲示板を</p>
      <a href="./top">入口</a>
    </div>,
    { title: "Och" }
  )
})
