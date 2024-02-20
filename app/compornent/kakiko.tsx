export default function kakiko(props) {
    return (
        <main>
            <form action="" method="post">
                <label htmlFor="name">名前</label>
                <input type="text" id="name" name="name" />
                <label htmlFor="mail">メール</label>
                <input type="text" id="mail" name="mail" />
                <label htmlFor="comment">コメント</label>
                <textarea id="comment" name="comment" />
                <button type="submit">投稿</button>
            </form>
        </main>
    )
  }