import {Hono} from 'hono';
import { vValidator } from "@hono/valibot-validator";
import { newPost, newThread } from './types';
import { kakikoAPI } from './module/kakiko-api';
import { getSubject, getThread } from './module/storage';

const app = new Hono({});

app.get('/', (c) => {
  return c.text('掲示板APIだよ!!')
})
app.post(
  "/thread/:BBSKEY",
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
  "/thread/:BBSKEY/:ThID",
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
app.get("/thread/:BBSKEY",async(c)=>{
  const BBSKEY = c.req.param().BBSKEY
  const SUBJECTJSON = await getSubject(BBSKEY)
  if (!SUBJECTJSON?.has) {
    return c.json({"error":"指定された板がありません"})
  }
  if (!SUBJECTJSON.data) {
    return c.json({"error":"板にスレッドがありません"})
  }
  return c.json(SUBJECTJSON.data)
})
app.get("/thread/:BBSKEY/:ThID",async(c)=>{
  const BBSKEY = c.req.param().BBSKEY
  const ThID = c.req.param().ThID
  const THD = await getThread(BBSKEY,ThID)
  if (!THD?.has) {
    return c.json({"error":"スレッドがねえ"})
  }
  return c.json(THD.data)
})
app.get("/thread/:BBSKEY/:ThID/:res",async(c)=>{
  const BBSKEY = c.req.param().BBSKEY
  const ThID = c.req.param().ThID
  const res = Number(c.req.param().res) -1
  const THD = await getThread(BBSKEY,ThID)
  if (!THD?.has) {
    return c.json({"error":"スレッドがねえ"})
  }
  return c.json(THD.data.post[res])
})
app.get("/thread")

export default app;