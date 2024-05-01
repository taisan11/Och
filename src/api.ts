import { Hono } from "hono";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { kakiko } from "./module/kakiko";
import { config } from "./module/config";
import { kakiko_dat } from "./module/kakiko.dat";

const app = new Hono();

app.get('/',async (c) => {
    return c.text('API!!');
})
app.get('/sled/:BBSKEY',async (c) => {
    const BBSKEY = c.req.param('BBSKEY');
    const subject = getSubject(BBSKEY);
    return c.json(subject);
})

export default app;
