# Och
強くて賢い掲示板
## バッジ
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
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
## 予定
ストレージ
バリデータはTypeBoxに変更するかも