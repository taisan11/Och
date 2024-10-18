/**
 * @description subject.txtをJSONに変換し、使いやすくする
 * @param subjecttxt subjectファイル
 * @returns { [key: string]: [string, string] } subject for JSON
 */
export function subjectpaser(subjecttxt: string): { [key: string]: [string, string] } {
    const lines: string[] = subjecttxt.replace(/\r\n/g, '\n').split('\n');
    const result: { [key: string]: [string, string] } = {};
    for (const line of lines) {
        const hoi = line.split('<>');
        const unixtime = hoi[0].slice(0,-4);
        const threadName = hoi[1].match(/(.+) \((\d+)\)/);
        if (threadName) {
            result[`${unixtime}`] = [threadName[1], threadName[2]];
        } 
        else {
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
export function datpaser(dattxt: string): {title:string,post: {postid: string;name: string;mail: string;date: string;message: string}[]} {
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
                // message: index === 0 ? parts[4] : parts[3],
                message: parts[3],
            };
            posts.push(post);
        }
    });

    const result = {
        title: title,
        post: posts,
    };
    return result;
}
