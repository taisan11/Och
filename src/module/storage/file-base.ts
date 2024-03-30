import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

export function writedat(dat: string, datname: string) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    
}