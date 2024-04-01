import { resolve } from "pathe";
import { config } from "../src/module/config";

async function main() {
    // console.log(await config())
    const c = await config()
    console.log(c.config)
    console.log(resolve(process.cwd(), 'data'))
}

main()