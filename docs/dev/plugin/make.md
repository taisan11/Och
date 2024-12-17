# Pluginの作り方
テンプレートは`/src/plugin/och_template_plugin.ts`です。
Pluginは2~3個の要素を出力します。それらの要素を一つずつ解説します。
## PluginInfo
PluginInfoはname,description,typeを出力します。
nameは名前、descriptionは説明、typeはTSdocを見ればわかりますが、ここで指定したタイプの時呼び出されます。
あとversionも出力できます。特にversionダウンができないとかいう機能はありません。
## main
これは関数となって、引数のデータを使用して、返却します。
## ConfigList
ConfigListをもとにconfig画面などを生成します。
特にまだ意味はありません