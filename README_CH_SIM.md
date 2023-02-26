
<p align="center">
    <img src="./logo-readme.png" height="120">
    <br>
    因提瓦特
<p>


<p align="center">
    <a href="./README.md">English</a> | 
    简体中文 | 
    <a href="./README_CH_TRA.md">繁體中文</a> | 
    <a href="./README_JP.md">日本語</a>
<p>

## 应用特色

+ 支持全角色，3星以上武器，**5星20级圣遗物**相关计算

+ 支持使用Enka.API（一款公开的第三方游戏展示面板角色数据查询API）导入游戏展示面板角色数据（需在游戏中公开面板角色信息）

+ 数据实时计算以及数据本地自动保存

+ 全技能伤害（含反应）词条与武器各精炼变化下伤害数值提升对比折线

+ 依据辅助角色实际数据计算的队伍Buff（需要初始化或导入辅助角色的数据）

+ 丰富的自定义Buff

+ 圣遗物成长标签

+ 圣遗物副词条最优化计算（依据特定技能信息，求解最优副词条占比，可限定暴击率最高值）：

1. 通过将实际副词条占比向最优计算结果靠拢可以在限定词条数下最优化特定伤害
（注：由于实际各圣遗物词条数不一定完全现实，仅供主要提升方向参考）

2. 在想"云"一名角色强度（特定武器，特定buff，特定队友下等）时，没有具体的圣遗物词条信息，又不明确词条选择时，可以利用此功能在仅限定圣遗物主词条下，快速估测各个角色相同词条数下的相对强度
（注：本项目目前仅提供各技能伤害数值，不含DPS计算，手法以及操作轴需要通过其他途径计算）

+ 本项目为PWA应用，可本地安装及离线使用（注：本地安装也仍需联网使用Enka数据导入功能以及加载各图片资源）

## 食用地址

+ <a href="https://genshin-calc.sirokuma.cc/" target="_blank">因提瓦特</a>

## 使用用例
<div>
    <img src="./doc/new/anime_cn_sim_1.webp">
    <br>
    <img src="./doc/new/anime_cn_sim_2.webp">
    <br>
    <img src="./doc/new/anime_cn_sim_3.webp">
</div>

## 相关说明

■角色 

+ 角色天赋可控制Buff（仅相关数值计算）默认关闭状态
+ 角色命座所有Buff（仅相关数值计算）默认关闭状态

■武器

+ 武器效果可控制Buff（仅相关数值计算）默认关闭状态
+ 武器仅支持3星及其以上的武器

■圣遗物

+ 圣遗物四件套可控制Buff（仅相关数值计算）默认关闭状态
+ 圣遗物仅支持20级5星圣遗物
+ 圣遗物用户自定义套装无数量上限，但通过Enka导入的数据时，如已超过10个则将自动替换最后一套设置为Enka数据

■圣遗物自动计算

+ 一个词条的定义为每次提升的最大值（如：暴击率为3.9%）可具体到小数点一位（如：0.1个词条对应暴击率为0.39%，2.7%暴击率对应0.7个词条）
+ 如计算目标为附魔后的普通攻击或重击伤害，计算前请务必检查普通攻击里的附魔是否处于对应的附魔状态
+ 本计算为当前环境下的计算，即当本功能区内的词条数变更以外的任何与目标计算相关的属性或Buff发生变化时，需要重新计算（如：武器精炼或相关Buff的开关）
+ 为减小自动计算的资源开销，目前小数值词条并不纳入计算范围（小攻击，小生命，小防御）

■圣遗物标签（成长/稀有）

+ 成长/稀有标签值并不能很好地评价一个圣遗物的好坏与否，只是单纯评价一个圣遗物的稀有程度（即初始与每次+4后提升的各数值幅度）
+ 成长是非线性的，涉及每次的成长值与成长次数，而并非最终词条数值的线性值差，越大的成长值且越多的成长次数可以显著提升成长标签值，意味着越接近XX之王（例如：防御高达35.7%的防御之王）
+ 稀有度则是各成长度的总和，意味着圣遗物的获取和强化难度（值越高越稀有），同时也请注意它并不意味着此圣遗物是有效的稀有，但我认为你无论何时你都不应该把一个稀有度超过100%的圣遗物当狗粮٩(ˊᗜˋ*)و 

## 其他

■自动保存

+ 所有用户数据使用浏览器的LocalStorage技术，可以通过右下角菜单「・・・」中的「数据清除」来重置数据

+ ~~暂时不支持自动清理（手动清理流程`<Chrome>`：点击`菜单`旁`原神伤害计算`回到派蒙首页 -> 开发者工具`<F12>` -> `Application` -> `Storage` -> 点击[`Clear site data`] -> 刷新页面`<F5>`即可完成清理）~~


## 本地搭建

本项目为基于`Angular`开发的无后端的Web应用，仅靠本项目可实现本地构建，步骤如下

■环境需求

+ <a href="https://nodejs.org/en/download/" target="_blank">Node.js</a> (推荐v16.15.0)
+ <a href="https://go.dev/dl/" target="_blank">Golang</a> (推荐1.16.3以上)

■下载

```
git clone https://github.com/Kurarion/Genshin-Calc.git
cd Genshin-Calc
npm install
```
■游戏数据初始化

由于Dimbreath的Github仓库被制裁，以下代码暂时无法直接使用
```
npm run generateGenshinData
```
也许你应该使用其他原神Data的数据Raw Url或者是本地文件
+ 使用其他原神Data的仓库Raw Url，例如割草机Resources
```
go run GenshinData -resUrl=https://gitlab.com/????/GC-Resources/-/raw/3.?/Resources/
```
+ 使用本地文件
```
go run GenshinData -localResPath=./GenshinData
```
游戏版本更新后或者需要使用测试及自定义数据时需再执行`游戏数据初始化代码`以生成项目必要的最新数据并需向<a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/assets/init/data.json" target="_blank">`src/assets/init/data.json`</a>中追加更新内容的配置

接口参考: <a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/app/shared/interface/interface.ts" target="_blank">`src/app/shared/interface/interface.ts`</a>

常量参考: <a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/app/shared/const/const.ts" target="_blank">`src/app/shared/const/const.ts`</a>

■测试

```
//使用angular-cli
npm run start
```
■构建
```
//build后使用http-server本地服务器
npm run build
npm run serve
```

## 感谢

+ <a href="https://github.com/EnkaNetwork/API-docs/" target="_blank">Enka.Network API</a>
