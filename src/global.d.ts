declare module 'unix-crypt-td-js' {
    const any: any;
    export = any;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT: string;
            DB_URI: string;
            JWT_SECRET: string;
        }
    }
}

export {}