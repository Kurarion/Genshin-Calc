import { genshindb, TYPE_SYS_LANG, Const } from "src/app/shared/shared.module";

export interface EnemyImagesType {
    nameicon: string;
}

export interface EnemyCreateOption {
    matchAliases?: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface EnemyListOption {
    // matchCategories: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface EnemyStatus {
    //*********************************
    //            属性情報
    //*********************************
    //レベル
    level: number;
    //生命値
    hp: number;
    //攻撃値
    attack: number;
    //防御値
    defense: number;
}


//キャラクターベース
export class enemy {

    //*********************************
    //            基本情報
    //*********************************
    //名前
    name!: string;
    specialname!: string;
    //レアリティー
    enemytype!: string;
    category!: string;

    //*********************************
    //            リソース
    //*********************************
    //画像
    images!: EnemyImagesType;

    //*********************************
    //             その他
    //*********************************
    //レベル基本属性クエリメソッド
    stats!: (level: string | number, option?: "+") => EnemyStatus;

    //コンストラクタ
    constructor(data: any) {
        ({
            name: this.name,
            specialname: this.specialname,
            enemytype: this.enemytype,
            category: this.category,
            images: this.images,
            stats: this.stats,
        } = data);
    }
}
