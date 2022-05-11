import { genshindb, TYPE_SYS_LANG, Const } from "src/app/shared/shared.module";

export declare type CharTalentCombatPassiveType = 1|2|3|'sp';

export interface CharImagesType {
    card: string;
    portrait: string;
    icon: string;
    sideicon: string;
    cover1: string;
    cover2: string;
    'hoyolab-avatar': string;
}

export interface CharCreateOption {
    matchAliases?: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface CharListOption {
    // matchCategories: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface CharStatus {
    //*********************************
    //            属性情報
    //*********************************
    //レベル
    level: number;
    //突破段階
    ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    //生命値
    hp: number;
    //攻撃値
    attack: number;
    //防御値
    defense: number;
    //キャラ突破増加値
    specialized: number;
}

export interface CharTalentCombatInfo {
    attributes: { labels: string[], parameters: Record<string, number[]> };
    info: string;
    name: string;
    values: CharTalentObject[] | undefined;
}

export interface CharTalentOhterInfo {
    info: string;
    name: string;
    values: undefined;
}

export interface CharTalentObject {
    key: string;
    valuePropKeys: string[];
    prefix: string;
    middles: string[];
    suffix: string;
    isPercent: boolean;
}

export class characterTalents {
    combat1!: CharTalentCombatInfo;
    combat2!: CharTalentCombatInfo;
    combat3!: CharTalentCombatInfo;
    combatsp!: CharTalentCombatInfo;
    passive1!: CharTalentOhterInfo;
    passive2!: CharTalentOhterInfo;
    passive3!: CharTalentOhterInfo;

    //コンストラクタ
    constructor(data: any) {
        ({
            combat1: this.combat1,
            combat2: this.combat2,
            combat3: this.combat3,
            combatsp: this.combatsp,
            passive1: this.passive1,
            passive2: this.passive2,
            passive3: this.passive3,
        } = data);
        // this.combat1.attributes.labels.forEach((_,index,array)=>{
        //     array[index] = this.removeSomeIdentifier(array[index]);
        // })
        // this.combat2.attributes.labels.forEach((_,index,array)=>{
        //     array[index] = this.removeSomeIdentifier(array[index]);
        // })
        // this.combat3.attributes.labels.forEach((_,index,array)=>{
        //     array[index] = this.removeSomeIdentifier(array[index]);
        // })
        // this.combatsp?.attributes.labels.forEach((_,index,array)=>{
        //     array[index] = this.removeSomeIdentifier(array[index]);
        // })
        this.combat1.values = this.getCombatData(1);
        this.combat2.values = this.getCombatData(2);
        this.combat3.values = this.getCombatData(3);
        if(this.combatsp){
            this.combatsp.values = this.getCombatData('sp');
        }
    }

    private getCombatData(index: CharTalentCombatPassiveType){
        let targetCombat: CharTalentCombatInfo;
        switch(index){
            case 1:
                targetCombat = this.combat1;
                break;
            case 2:
                targetCombat = this.combat2;
                break;
            case 3:
                targetCombat = this.combat3;
                break;
            case 'sp':
                targetCombat = this.combatsp;
                break;
        }

        let temp = targetCombat.attributes.labels;
        let results: CharTalentObject[] = [];
        for(let i = 0; i< temp.length; ++i){
            let items = temp[i].split('|');
            let key: string = items[0];
            let valuePropKeys: string[] = [];
            let prefix: string;
            let middles: string[] = [];
            let suffix: string;
            let isPercent: boolean;

            valuePropKeys = items[1].match(/param(\d+)/g) as Array<string>;
            isPercent = items[1].indexOf('P') != -1;

            let others = items[1].split(/\{param\d+:.*?\}/);
            prefix = others[0];
            middles = others.slice(1, others.length - 1);
            suffix = others[others.length - 1];

            results.push({
                key: key,
                valuePropKeys: valuePropKeys,
                prefix: prefix,
                middles: middles,
                suffix: suffix,
                isPercent: isPercent,
            })
        }

        return results;
    }

    private removeSomeIdentifier(origin: string){
        return origin.replace(/\{param(\d+):.*?\}/g,"{param$1}");
    }
}

export interface CharConstellationInfo {
    effect: string;
    name: string;
}

export class characterConstellations {
    c1!: CharConstellationInfo;
    c2!: CharConstellationInfo;
    c3!: CharConstellationInfo;
    c4!: CharConstellationInfo;
    c5!: CharConstellationInfo;
    c6!: CharConstellationInfo;

    //コンストラクタ
    constructor(data: any) {
        ({
            c1: this.c1,
            c2: this.c2,
            c3: this.c3,
            c4: this.c4,
            c5: this.c5,
            c6: this.c6,
        } = data);
    }
}

//キャラクターベース
export class character {

    //*********************************
    //            基本情報
    //*********************************
    //名前
    name!: string;
    fullname!: string;
    //レアリティー
    rarity!: number;
    //元素タイプ
    element!: string;
    //所属
    association!: string;
    //出身
    region!: string;
    //星座名
    constellation!: string;
    //武器タイプ
    weapontype!: string;
    //突破属性
    substat!: string;

    //*********************************
    //            リソース
    //*********************************
    //画像
    images!: CharImagesType;

    //*********************************
    //             その他
    //*********************************
    //レベル基本属性クエリメソッド
    stats!: (level: string | number, option?: "+") => CharStatus;
    //タレント
    talents!: characterTalents | undefined;
    //星座
    constellations!: characterConstellations | undefined;

    //コンストラクタ
    constructor(data: any, talents: any, constellations: any) {
        ({
            name: this.name,
            fullname: this.fullname,
            rarity: this.rarity,
            element: this.element,
            association: this.association,
            region: this.region,
            constellation: this.constellation,
            weapontype: this.weapontype,
            substat: this.substat,
            images: this.images,
            stats: this.stats,
        } = data);
        if (talents) {
            this.talents = new characterTalents(talents);
        }
        if (constellations) {
            this.constellations = new characterConstellations(constellations);
        }
    }
}
