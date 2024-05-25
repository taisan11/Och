import {Hono} from 'hono';
import { vValidator } from "@hono/valibot-validator";
import { newThread } from './types';

const app = new Hono({});

app.get('/', (c) => {
  return c.text('掲示板APIだよ!!')
})

app.post(
  "/thread",
  vValidator("json", newThread, (result, c) => {
    if (!result.success) {
      return c.json({ message: "errorだよん" }, 400);
    }
  }),
  (c) => {
    const { ThTitle,name,mail,MESSAGE,BBSKEY } = c.req.valid("json");
    console.log(ThTitle,name,mail,MESSAGE,BBSKEY);
    return c.text("ok");
  }
);

export default app;