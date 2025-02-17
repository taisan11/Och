# Och
強くて賢い掲示板
## ファイル構成
```
root/
　├ src/
　　　　├admin.tsx //管理画面
　　　　├BBS.tsx // read.cgi+BBS.cgi
　　　　├serch.tsx //検索
　　　　├TBS.tsx // New design
　　　　├ module/
　　　　　　　　　├KAS.ts //メッセージなどを処理する奴
　　　　　　　　　├config-loader.ts //コンフィグを見て色々なところに分配する
　　　　　　　　　├storage.ts // 保存関係を管理
　　　　　　　　　├storage/
　　　　　　　　　　　　　　├/ ストレージローダーを書く
　　　　　　　　　　　　　　├file-base.ts //ファイルで保存 
```
## 仕様|思想
この掲示板は設計段階から分離可能な設計をしています。
故にモジュールの部分は一般的にライブラリとして外部からも使用できます。