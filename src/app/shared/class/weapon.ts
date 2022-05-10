import { genshindb, TYPE_SYS_LANG, Const } from "src/app/shared/shared.module";

export interface WeaponImagesType {
    image: string;
    //突破前
    icon: string;
    //突破後
    awakenicon: string;
}

export interface WeaponCreateOption {
    matchAliases?: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface WeaponListOption {
    // matchCategories: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface WeaponStatus {
    //*********************************
    //            属性情報
    //*********************************
    //レベル
    level: number;
    //突破段階
    ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    //攻撃値
    attack: number;
    //武器突破増加値
    specialized: number;
}

//武器ベース
export class weapon {

    //*********************************
    //            基本情報
    //*********************************
    //名前
    name!: string;
    //由来
    description!: string;
    //レアリティー
    rarity!: number;
    //武器タイプ
    weapontype!: string;
    //突破属性
    substat!: string;
    //武器効果
    effect!: string;
    //突破値
    r1!: string[];
    r2!: string[];
    r3!: string[];
    r4!: string[];
    r5!: string[];

    //*********************************
    //            リソース
    //*********************************
    //画像
    images!: WeaponImagesType;

    //*********************************
    //             その他
    //*********************************
    //レベル基本属性クエリメソッド
    stats!: (level: string | number, option?: "+") => WeaponStatus;

    //コンストラクタ
    constructor(data: any) {
        ({
            name: this.name,
            description: this.description,
            rarity: this.rarity,
            weapontype: this.weapontype,
            substat: this.substat,
            effect: this.effect,
            r1: this.r1,
            r2: this.r2,
            r3: this.r3,
            r4: this.r4,
            r5: this.r5,
            images: this.images,
            stats: this.stats,
        } = data);
    }
}
