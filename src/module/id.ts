import { SHA512 } from "./angou";

// idは9文字
export async function id(ip: string,itaID: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    const hash = await SHA512(ip + itaID + formattedDate);
    return hash.slice(0, 9);
}