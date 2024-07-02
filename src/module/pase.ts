/**
 * @description subject.txtをJSONに変換し、使いやすくする
 * @param subjecttxt subjectファイル
 * @returns { [key: string]: [string, string] } subject for JSON
 */
export function subjectpaser(subjecttxt: string): { [key: string]: [string, string] } {
    subjecttxt = subjecttxt.replace(/\r\n/g, '\n');
    const lines: string[] = subjecttxt.split('\n');
    const result: { [key: string]: [string, string] } = {};
    for (const line of lines) {
        const match = line.match(/^(\d+)\.dat<>(.+) \((\d+)\)$/);
        if (match) {
            const [_, unixtime, threadName, responseCount] = match;
            result[`${unixtime}`] = [threadName, responseCount];
        } else {
            throw new Error('Invalid format');
        }
    }
    return result;
}
/**
 * @description datファイルをJSONに変換し、使いやすくする
 * @param {string} dattxt
 * @returns {string}
 */
export function datpaser(dattxt: string):string {
    const lines = dattxt.split("\n");
    const posts: any[] = [];
    let title = "";

    lines.forEach((line, index) => {
        const parts = line.split("<>");
        if (parts.length >= 4) {
            if (index === 0) {
                title = parts[4];
            }
            const post: any = {
                postid: (index + 1).toString(),
                name: parts[0],
                mail: parts[1],
                date: parts[2],
                message: index === 0 ? parts[4] : parts[3],
            };
            posts.push(post);
        }
    });

    const result = {
        title: title,
        post: posts,
    };

    return JSON.stringify(result, null, 2);
}
