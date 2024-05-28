import {Hono} from 'hono';
import { vValidator } from "@hono/valibot-validator";
import { newPost, newThread } from './types';
import { kakiko } from './module/kakiko';
import { kakikoAPI } from './module/kakiko-api';

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
  async(c) => {
    const { ThTitle,name,mail,MESSAGE,BBSKEY } = c.req.valid("json");
    const result = await kakikoAPI({ThTitle,name,mail,MESSAGE,BBSKEY},c,"newth")
    return c.json(result);
  }
);
app.post(
  "/thread/:ThID",
  vValidator("json", newPost, (result, c) => {
    if (!result.success) {
      return c.json({ message: "errorだよん" }, 400);
    }
  }),
  async(c) => {
    const { THID,name,mail,MESSAGE,BBSKEY } = c.req.valid("json");
    const result = await kakikoAPI({ThID:THID,name,mail,MESSAGE,BBSKEY},c,"kakiko")
    return c.json(result);
  }
);
export default app;