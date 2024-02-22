import { createRoute } from "honox/factory";

export default createRoute((c) => {
    return c.render(
        <div align="center">
            <div class="iyan_desc">
            <p>「ハッキング」から「今晩のおかず」までを手広くカバーする巨大掲示板群</p>
            <p>『Och』へようこそ!!!!!!!!!!!!</p>
            <p>『２ちゃんねる』って何？という方は<a href="http://info.2ch.sc/guide/">インフォメーション</a>をご覧ください。</p>
            </div>
            <br/>
            <div>
            <p>そんなわけ?で、ベータテスト、、、というか作り途中です</p>
            <p>システムを一から作ったり、手直ししたりで、十分にテストは出来てないので、壊れたり、荒れたりすると思いますが、</p>
            <p>ネットのサービスってそんなもんなんで、まぁ、気にせずにお楽しみください。</p>
            <p>あと、メッセージとかもだいぶコピペなので気を付けてね!!</p>
            <h3>板一覧</h3>
            <p>・<a href="./test/read.cgi/kb">テスト用板</a></p>
        </div></div>
    );
});