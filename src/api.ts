import {Hono} from 'hono';
import { vValidator } from "@hono/valibot-validator";
import { newPost, newThread } from './types';
import { kakikoAPI } from './module/kakiko-api';
import { getSubject, getThread } from './module/storage';
import { getConnInfo } from './module/unHono';

const app = new Hono({});

app.get('/', (c) => {
  return c.text('掲示板APIだよ!!')
})
app.post(
  "/thread/:BBSKEY",
  vValidator("json", newThread, (result, c) => {
    if (!result.success) {
      return c.json({ error: "入力が足りません" }, 400);
    }
  }),
  async(c) => {
    const IP = c.req.header('CF-Connecting-IP')||(await getConnInfo(c)).remote.address||'0.0.0.0'
    const { ThTitle,name,mail,MESSAGE,BBSKEY } = c.req.valid("json");
    const result = await kakikoAPI({ThTitle,name,mail,MESSAGE,BBSKEY,IP},c,"newth")
    return c.json(result);
  }
);
app.post(
  "/thread/:BBSKEY/:ThID",
  vValidator("json", newPost, (result, c) => {
    if (!result.success) {
      return c.json({ error: "入力が足りません" }, 400);
    }
  }),
  async(c) => {
    const IP = c.req.header('CF-Connecting-IP')||(await getConnInfo(c)).remote.address||'0.0.0.0'
    const { THID,name,mail,MESSAGE,BBSKEY } = c.req.valid("json");
    const result = await kakikoAPI({ThID:THID,name,mail,MESSAGE,BBSKEY,IP},c,"kakiko")
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
    return c.json({"error":"スレッドがありません"},400)
  }
  return c.json(THD.data)
})
app.get("/thread/:BBSKEY/:ThID/:res",async(c)=>{
  const BBSKEY = c.req.param().BBSKEY
  const ThID = c.req.param().ThID
  const res = Number(c.req.param().res) -1
  const THD = await getThread(BBSKEY,ThID)
  if (!THD?.has) {
    return c.json({"error":"スレッドがありません"},400)
  }
  return c.json(THD.data.post[res])
})
app.get("/thread")

export default app;