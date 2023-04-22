
<p align="center">
    <img src="./logo-readme.png" height="120">
    <br>
    <strong>Inteyvat</strong>
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
    English | 
    <a href="./README_CH_SIM.md">简体中文</a> | 
    <a href="./README_CH_TRA.md">繁體中文</a> | 
    <a href="./README_JP.md">日本語</a>
<p>

## Application Feature

+ Support all characters, weapons of more than 3 stars, **5 stars and level 20 artifact** calculations

+ Support Enka.API (a public third-party game display panel character data query API) to import the game display panel character data (the panel character information needs to be pubic in the game)

+ Real-time data calculation and local automatic data save

+ Full skill damage (including reaction) broken line of damage value increase under each refining change of weapon and artifact property promotion

+ Team Buff that calculated based on the actual data of auxiliary characters (data of auxiliary characters need to be initialized or imported firstly)

+ Rich custom Buff

+ artifact growth label

+ The optimization calculation of the artifact property (specific skill information with the limition of maximum critical rate):

1. The specific damage can be optimized under the limited number of step by closing the proportion of actual artifact property to the optimal calculation result

(Note: because the actual number of entries of each artifact is not necessarily completely realistic, it is only for reference in the main direction of ascension)

2. When want to know the strength of a character (specific weapon, specific Buff, specific teammate, etc.), if there is no specific information of artifact or the selection of artifact, you can use this to quickly estimate the relative strength of each character under the same number of step under the condition that only the main property of artifact is limited

(Note: At present, this project only provides the damage value of each skill, excluding the DPS calculation. The manipulation and operation axis need to be calculated by other ways)

+ This project is a PWA, which can be installed locally and used offline (Note: local installation also require net for Enka.API and image resources)

## Try It

+ <a href="https://genshin-calc.sirokuma.cc/" target="_blank">Inteyvat</a>

## Use Case

+ Sorry, there are only examples in Chinese at present.
<div>
    <img src="./doc/new/anime_cn_sim_1.webp">
    <br>
    <img src="./doc/new/anime_cn_sim_2.webp">
    <br>
    <img src="./doc/new/anime_cn_sim_3.webp">
</div>

## Description

■ Characters

+ All talent Buffs are off by default

+ All constellation Buffs are off by default

■ Weapons

+ All effect Buffs are off by default

+ Only weapons of 3 stars and above

■ Artifact

+ The artifact Buffs are off by default

+ Only support level 20 5-star artifact

■ Automatic calculation of artifact

+ The definition of a step is the maximum value of each increase (for example, the critical rate is 3.9%), which can be specified to one decimal place (for example, 0.1 step corresponds to the critical rate of 0.39%, 2.7% corresponds to 0.7 step)

+ If the calculation target is the normal attack damage after enchantment, please check whether the enchantment in the normal attack is in the corresponding enchantment state before calculation

+ This calculation is under the current context, that is, when any attribute or Buff related to the target calculation other than the number of step in this function area changed, it needs to be recalculated (such as the switch of weapon refining or related Buff)

+ In order to reduce the resource cost of automatic calculation, the value property steps are not included in the calculation scope (small attack value, small HP value, small defense value)

■ Artifact labels (growth/rarity)

+ The growth/rarity tag value can't evaluate the quality of a artifact very well, but simply evaluate the rarity of a artifact (that is, the value range of the initial value and each increase after+4)

+ Growth is non-linear, involving the difference between the growth value and growth times each increase, rather than the linear value of the final step value. The larger the growth value and the more growth times, the higher the growth tag value, which means the closer to the King of XX (for example, the King of Defense with a 35.7% defense or more)

+ The rarity is the sum of all growth, which means the difficulty of obtaining the artifact (the higher the value, the rarer it is). At the same time, please note that it does not mean that the artifact are effective rare, but I think you should not use a artifact with a rarity of more than 100% as dog food at any time ٩ ( ˊ ᗜ ˋ*)و

## Other

■ Auto save

+ All user data use the browser's LocalStorage, and can be reset through"Data Clear" in the [...] menu in the lower right corner

## Running Locally

This project is a noBackend web application developed with `Angular`, which can be built locally only by this project. The steps are as follows

■ Requirements

+ <a href="https://nodejs.org/en/download/" target="_blank">Node. js</a> (v16.15.0 is recommended)

+ <a href="https://go.dev/dl/" target="_blank">Golang</a> (above 1.16.3 is recommended)

■ Download

```
git clone https://github.com/Kurarion/Genshin-Calc.git
cd Genshin-Calc
npm install
```
■ Game data initialize

The following code cannot be used currently because Dimbreath's GenshinData repository was sanctioned

```
npm run generateGenshinData
```

Maybe you should use the data of other Genshin Impact data Raw Url or local file

+ Raw Url, a repository of Genshin Impact Data, such as Grasscutter Resources
```
go run GenshinData -resUrl=https://gitlab.com/????/GC-Resources/-/raw/3.?/Resources/
```

+ Use local file
```
go run GenshinData -localResPath=./GenshinData
```

After the game version is updated or when the test and custom data need to be used, the `Game data initialize` needs to be executed again to generate the latest data for the project, and the configuration of the updated content needs to be added to <a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/assets/init/data.json" target="_blank">`src/assets/init/data.json`</a>

Interface reference: <a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/app/shared/interface/interface.ts" target="_blank">`src/app/shared/interface/interfaces.ts`</a>

Constant reference: <a href="https://github.com/Kurarion/Genshin-Calc/tree/main/src/app/shared/const/const.ts" target="_blank">`src/app/shared/const/const.ts`</a>

■ Test
```
//use angular-cli
npm run start
```
■ Build
```
//use http-server after building
npm run build
npm run serve
```

## Thanks
+ <a href="https://github.com/EnkaNetwork/API-docs/" target="_blank">Enka.Network API</a>