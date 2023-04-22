
<p align="center">
    <img src="./logo-readme.png" height="120">
    <br>
    <strong>因提瓦特</strong>
<p>
<div align="center">
    <a href="https://discord.com/invite/GXjtmmFcYT">
        <img alt="Discord" src="https://img.shields.io/discord/1081186577570598914?color=blue&label=Discord&logo=Discord&style=flat-square" height="20">
    </a>
    <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=bi_PmMZ3t762gUCQ2CP1tOOzWbt7W1wx&jump_from=webapi&authKey=UPbPdmCHGuPomLNVj6uajaBwwk6G28u4mXCVr1ra5IRAtgJMy9TGDp+uFvGxJiHy">
        <img alt="Discord" src="https://img.shields.io/badge/QQ%20Group-635139720-green?logo=Tencent QQ&style=flat-square" height="20">
    </a>
    <a href="https://github.com/Kurarion/Genshin-Calc">
        <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Kurarion/Genshin-calc?color=yellow&label=Stars&logo=GitHub&style=flat-square" height="20">
    </a>
</div>
<p align="center">
    <a href="./README.md">English</a> | 
    <a href="./README_CH_SIM.md">简体中文</a> | 
    繁體中文 | 
    <a href="./README_JP.md">日本語</a>
<p>

## 應用特色

+ 支持全角色，3星以上武器，**5星20級聖遺物**相關計算

+ 支持使用Enka.API（一款公開的第三方遊戲展示面板角色數據查詢API）導入遊戲展示面板角色數據（需在遊戲中公開面板角色信息）

+ 數據實時計算以及數據本地自動保存

+ 全技能傷害（含反應）詞條與武器各精煉變化下傷害數值提升對比折線

+ 依據輔助角色實際數據計算的隊伍Buff（需要初始化或導入輔助角色的數據）

+ 豐富的自定義Buff

+ 聖遺物成長標簽

+ 聖遺物副詞條最優化計算（依據特定技能信息，求解最優副詞條占比，可限定暴擊率最高值）：

1. 通過將實際副詞條占比向最優計算結果靠攏可以在限定詞條數下最優化特定傷害
（註：由於實際各聖遺物詞條數不一定完全現實，僅供主要提升方向參考）

2. 在想"雲"一名角色強度（特定武器，特定buff，特定隊友下等）時，沒有具體的聖遺物詞條信息，又不明確詞條選擇時，可以利用此功能在僅限定聖遺物主詞條下，快速估測各個角色相同詞條數下的相對強度
（註：本項目目前僅提供各技能傷害數值，不含DPS計算，手法以及操作軸需要通過其他途徑計算）

+ 本項目為PWA應用，可本地安裝及離線使用（註：本地安裝也仍需聯網使用Enka數據導入功能以及加載各圖片資源）

## 食用地址

+ <a href="https://genshin-calc.sirokuma.cc/" target="_blank">因提瓦特</a>

## 使用用例
+ 很抱歉，目前僅製作了簡體中文版的用例，望見諒
<div>
    <img src="./doc/new/anime_cn_sim_1.webp">
    <br>
    <img src="./doc/new/anime_cn_sim_2.webp">
    <br>
    <img src="./doc/new/anime_cn_sim_3.webp">
</div>

## 相關說明

■角色 

+ 角色天賦可控製Buff（僅相關數值計算）默認關閉狀態
+ 角色命座所有Buff（僅相關數值計算）默認關閉狀態

■武器

+ 武器效果可控製Buff（僅相關數值計算）默認關閉狀態
+ 武器僅支持3星及其以上的武器

■聖遺物

+ 聖遺物四件套可控製Buff（僅相關數值計算）默認關閉狀態
+ 聖遺物僅支持20級5星聖遺物

■聖遺物自動計算

+ 一個詞條的定義為每次提升的最大值（如：暴擊率為3.9%）可具體到小數點一位（如：0.1個詞條對應暴擊率為0.39%，2.7%暴擊率對應0.7個詞條）
+ 如計算目標為附魔後的普通攻擊或重擊傷害，計算前請務必檢查普通攻擊裏的附魔是否處於對應的附魔狀態
+ 本計算為當前環境下的計算，即當本功能區內的詞條數變更以外的任何與目標計算相關的屬性或Buff發生變化時，需要重新計算（如：武器精煉或相關Buff的開關）
+ 為減小自動計算的資源開銷，目前小數值詞條並不納入計算範圍（小攻擊，小生命，小防禦）

■聖遺物標簽（成長/稀有）

+ 成長/稀有標簽值並不能很好地評價一個聖遺物的好壞與否，只是單純評價一個聖遺物的稀有程度（即初始與每次+4後提升的各數值幅度）
+ 成長是非線性的，涉及每次的成長值與成長次數，而並非最終詞條數值的線性值差，越大的成長值且越多的成長次數可以顯著提升成長標簽值，意味著越接近XX之王（例如：防禦高達35.7%的防禦之王）
+ 稀有度則是各成長度的總和，意味著聖遺物的獲取和強化難度（值越高越稀有），同時也請註意它並不意味著此聖遺物是有效的稀有，但我認為你無論何時你都不應該把一個稀有度超過100%的聖遺物當狗糧٩(ˊᗜˋ*)و 

## 其他

■自動保存

+ 所有用戶數據使用瀏覽器的LocalStorage技術，可以通過右下角菜單「・・・」中的「數據清除」來重置數據

+ ~~暫時不支持自動清理（手動清理流程`<Chrome>`：點擊`菜單`旁`原神傷害計算`回到派蒙首頁 -> 開發者工具`<F12>` -> `Application` -> `Storage` -> 點擊[`Clear site data`] -> 刷新頁面`<F5>`即可完成清理）~~


## 本地搭建

本項目為基於`Angular`開發的無後端的Web應用，僅靠本項目可實現本地構建，步驟如下

■環境需求

+ <a href="https://nodejs.org/en/download/" target="_blank">Node.js</a> (推薦v16.15.0)
+ <a href="https://go.dev/dl/" target="_blank">Golang</a> (推薦1.16.3以上)

■下載

```
git clone https://github.com/Kurarion/Genshin-Calc.git
cd Genshin-Calc
npm install
```
■遊戲數據初始化

由於Dimbreath的Github倉庫被製裁，以下代碼暫時無法直接使用
```
npm run generateGenshinData
```
也許你應該使用其他原神Data的數據Raw Url或者是本地文件
+ 使用其他原神Data的倉庫Raw Url，例如割草機Resources
```
go run GenshinData -resUrl=https://gitlab.com/????/GC-Resources/-/raw/3.?/Resources/
```
+ 使用本地文件
```
go run GenshinData -localResPath=./GenshinData
```
遊戲版本更新後或者需要使用測試及自定義數據時需再執行`遊戲數據初始化代碼`以生成項目必要的最新數據並需向<a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/assets/init/data.json" target="_blank">`src/assets/init/data.json`</a>中追加更新內容的配置

接口參考: <a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/app/shared/interface/interface.ts" target="_blank">`src/app/shared/interface/interface.ts`</a>

常量參考: <a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/app/shared/const/const.ts" target="_blank">`src/app/shared/const/const.ts`</a>

■測試

```
//使用angular-cli
npm run start
```
■構建
```
//build後使用http-server本地服務器
npm run build
npm run serve
```

## 感謝

+ <a href="https://github.com/EnkaNetwork/API-docs/" target="_blank">Enka.Network API</a>