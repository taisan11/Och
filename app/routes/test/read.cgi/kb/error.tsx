import type { Context } from "hono";

export default function readCGI(c: Context) {
    const query = c.req.query('e')
    switch (query) {
        case '0':
            return (
                <div>
                    <h1>エラー</h1>
                    <p>内容がないようですWW</p>
                </div>
            )
        case '1':
            return (
                <div>
                    <h1>エラー</h1>
                    <p>名前を入力しろください</p>
                </div>
            )
        case '2':
            return (
                <div>
                    <h1>エラー</h1>
                    <p>タイトルがないんで...</p>
                    <p>スレッドIDがないんで...</p>
                </div>
            )
    }
}