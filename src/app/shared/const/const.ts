import { MenuInfo, LangInfo, TYPE_GENSHINDB_LANG, TYPE_SYS_LANG, TYPE_TESSERACT_LANG } from 'src/app/shared/shared.module';

export class Const {
  //*********************************
  //        ローカルストレージ
  //*********************************
  static readonly STORAGE_LANG = 'lang';

  //*********************************
  //             言語
  //*********************************
  static readonly LIST_LANG: LangInfo[] = [
    { code: 'cn_sim', displayName: '中文(简)' },
    { code: 'cn_tra', displayName: '中文(繁)' },
    { code: 'en', displayName: 'English' },
    { code: 'jp', displayName: '日本語' },
  ];

  static readonly MAP_TESSERACT_LANG: Record<TYPE_SYS_LANG, TYPE_TESSERACT_LANG> = {
    cn_sim: 'chi_sim',
    cn_tra: 'chi_tra',
    en: 'eng',
    jp: 'jpn',
  };

  static readonly MAP_GENSHINDB_LANG: Record<TYPE_SYS_LANG, TYPE_GENSHINDB_LANG> = {
    cn_sim: 'ChineseSimplified',
    cn_tra: 'ChineseTraditional',
    en: 'English',
    jp: 'Japanese',
  };

  //*********************************
  //          クッキーキー
  //*********************************
  static readonly ID_CAPTURE_ELEMENT = 'toCaptureElement';

  //*********************************
  //            メニュー
  //*********************************
  static readonly menu_1 = 'test1';
  static readonly menu_2 = 'test2';
  static readonly menu_3 = 'test3';

  static readonly menus: MenuInfo[] = [
    {
      name: Const.menu_1,
      link: 'test1',
    },
    {
      name: Const.menu_2,
      link: 'test2',
    },
    {
      name: Const.menu_3,
      link: 'test3',
    },
  ];

  static readonly menuNames: Record<string, string> = {
    test1: 'テスト１',
    test2: 'テスト２',
    test3: 'テスト３',
  };
}
