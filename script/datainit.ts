import { defaults } from "../src/module/config";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

const storage = createStorage({ driver: fsDriver({ base: "./data" }), });

async function main() {
    await storage.setItem('system.config.ts', defaults)
    process.stdout.write('初期板名(半角英字):');
    for await (const line of console) {
        console.log(`You typed: ${line}`);
        await storage.setItem(`/${line}/SUBJECT.TXT`,'')
        return
    }
}

main()