/**
 * @name sys
 * @description システム全般の変数を放り込む
 */
type sys = {
    plugins:[
        {
            name:string,
            version:string,
            description:string,
        }
    ]
}