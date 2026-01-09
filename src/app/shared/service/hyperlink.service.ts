import { Injectable } from '@angular/core';
import { GenshinDataService, LanguageService, Const } from '../shared.module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface HyperlinkData {
  id: string;
  textMapContentHash: number;
  content: Record<string, string>;
  paramTypes: string[];
}

export interface ManualTextMapData {
  id: number;
  textMapContentHash: number;
  content: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class HyperlinkService {
  constructor(
    private languageService: LanguageService
  ) {}

  /**
   * テキスト内のハイパーリンクタグを処理し、処理済みのHTML文字列を返す
   * @param text 元のテキスト
   * @returns 処理済みのHTML文字列
   */
  processHyperlinks(text: string): Observable<string> {
    if (!text) {
      return new Observable(observer => observer.next(text));
    }

    // 現在の言語を取得
    return this.languageService.getLang().pipe(
      map(currentLang => {
        // 生のハイパーリンクタグに一致する正規表現を使用 {LINK#id}text{LINK#}
        const rawLinkRegex = /\{LINK#([A-Za-z]*\d+)\}(.*?)\{\/LINK\}/g;

        return text.replace(rawLinkRegex, (_match, linkId, linkText) => {
          // 数値部分を抽出（アルファベットプレフィックスを削除）
          const numericId = linkId.replace(/^[A-Za-z]+/, '');

          // ハイパーリンクデータを取得
          const hyperlinkData = GenshinDataService.getHyperlink(numericId);
          if (!hyperlinkData) {
            // データが見つからない場合、元のテキストを返す
            return linkText;
          }

          // title属性を持つHTML要素を返す（titleは通常Angularによって保持される）
          return `<span class="${Const.HYPERLINK_CSS_CLASS}" title="${linkId}">${this.escapeHtml(linkText)}</span>`;
        });
      })
    );
  }

  /**
   * ハイパーリンクの詳細コンテンツを取得する（全言語含む）
   * @param linkId ハイパーリンクID
   * @returns 全言語のコンテンツを含むオブジェクト
   */
  getHyperlinkContentById(linkId: string): Observable<any> {
    // 数値部分を抽出（アルファベットプレフィックスを削除）
    const numericId = linkId.replace(/^[A-Za-z]+/, '');

    const hyperlinkData = GenshinDataService.getHyperlink(numericId);
    if (!hyperlinkData) {
      return new Observable(observer => {
        observer.next({});
        observer.complete();
      });
    }

    // 全言語のコンテンツをプリロード
    const allLanguageContent: any = {};

    // 利用可能な全言語を処理
    const languages = [Const.LAN_CHS, Const.LAN_CHT, Const.LAN_EN, Const.LAN_JP];

    languages.forEach(lang => {
      const content = this.getHyperlinkContent(hyperlinkData, lang);
      if (content) {
        allLanguageContent[lang] = content;
      }
    });

    // 全言語のコンテンツを即座に返す
    return new Observable(observer => {
      observer.next(allLanguageContent);
      observer.complete();
    });
  }

  /**
   * 現在の言語に基づいて表示するコンテンツを選択する
   * @param allLanguageContent 全言語のコンテンツを含むオブジェクト
   * @returns 現在の言語のコンテンツ
   */
  getContentForCurrentLanguage(allLanguageContent: any): string {
    try {
      const currentLang = this.languageService.getCurrentLang();

      // まず現在の言語を試す
      if (allLanguageContent[currentLang]) {
        return allLanguageContent[currentLang];
      }

      // デフォルト言語を試す
      if (allLanguageContent[Const.DEFAULT_LANG]) {
        return allLanguageContent[Const.DEFAULT_LANG];
      }

      // 英語を試す
      if (allLanguageContent[Const.LAN_EN]) {
        return allLanguageContent[Const.LAN_EN];
      }

      // すべてがない場合、最初の利用可能な言語を返す
      const availableLanguages = Object.keys(allLanguageContent);
      if (availableLanguages.length > 0) {
        return allLanguageContent[availableLanguages[0]];
      }

      return '';
    } catch (error) {
      // フォールバック：最初の利用可能な言語を返す
      const availableLanguages = Object.keys(allLanguageContent);
      if (availableLanguages.length > 0) {
        return allLanguageContent[availableLanguages[0]];
      }
      return '';
    }
  }

  /**
   * 手動テキストマップのコンテンツを取得する
   * @param textMapHash テキストマップハッシュ値
   * @returns テキストコンテンツ
   */
  getManualTextMapContent(textMapHash: number): Observable<string> {
    const manualTextMapData = GenshinDataService.getManualTextMap(textMapHash.toString());
    if (!manualTextMapData) {
      return new Observable(observer => observer.next(''));
    }
    
    return this.languageService.getLang().pipe(
      map(currentLang => {
        return manualTextMapData.content[currentLang] || manualTextMapData.content[Const.DEFAULT_LANG] || '';
      })
    );
  }

  /**
   * ハイパーリンクデータから現在の言語のコンテンツを取得する
   * @param hyperlinkData ハイパーリンクデータ
   * @param lang 言語コード
   * @returns ローカライズされたコンテンツ
   */
  private getHyperlinkContent(hyperlinkData: HyperlinkData, lang: string): string {
    // まず現在の言語のコンテンツを取得しようとする
    let content = hyperlinkData.content[lang];

    // 現在の言語にコンテンツがない場合、デフォルト言語のコンテンツを取得しようとする
    if (!content && lang !== Const.DEFAULT_LANG) {
      content = hyperlinkData.content[Const.DEFAULT_LANG];
    }

    // まだコンテンツがない場合、英語のコンテンツを取得しようとする
    if (!content && lang !== Const.LAN_EN) {
      content = hyperlinkData.content[Const.LAN_EN];
    }

    // 依然としてコンテンツがない場合、空文字列を返す
    if (!content) {
      return '';
    }

    // コンテンツ内のタグを処理する（utility.goの処理と整合性を保つ）
    content = this.processContentTags(content);

    return content;
  }

  /**
   * コンテンツ内の各種タグを処理する
   * @param content 元のコンテンツ
   * @returns 処理済みのコンテンツ
   */
  private processContentTags(content: string): string {
    // カラータグの処理 <color=#...> -> <font color=...>
    content = content.replace(/<color=#([^>]+)>/g, '<font color="$1">');
    content = content.replace(/<\/color>/g, '</font>');

    // 改行文字の処理 \n -> <br>
    content = content.replace(/\\n/g, '<br>');

    // パラメータタグの処理 {PARAM#...} - そのまま維持するか表示に適した形式に変換する
    content = content.replace(/\{PARAM#[^}]+\}/g, (match) => {
      // シンプルな処理：パラメータ識別子を抽出して表示する
      const paramId = match.match(/PARAM#([^|]+)/)?.[1];
      return `<span style="color: #FFD700; font-weight: bold;">[${paramId}]</span>`;
    });

    // その他の可能なタグを処理
    content = content.replace(/\{[^}]+\}/g, '<span style="color: #FF9999;">?</span>');

    return content;
  }

  /**
   * テキストにハイパーリンクタグが含まれているかチェックする
   * @param text テキスト
   * @returns ハイパーリンクが含まれているか
   */
  hasHyperlinks(text: string): boolean {
    if (!text) return false;
    const rawLinkRegex = /\{LINK#([A-Za-z]*\d+)\}/g;
    return rawLinkRegex.test(text);
  }

  /**
   * テキストから全ハイパーリンクIDを抽出する
   * @param text テキスト
   * @returns ハイパーリンクIDの配列
   */
  extractHyperlinkIds(text: string): string[] {
    if (!text) return [];

    const ids: string[] = [];
    let match;

    // 生のLINK#タグに一致する正規表現を使用
    const rawLinkRegex = /\{LINK#([A-Za-z]*\d+)\}/g;

    // 正規表現のlastIndexをリセット
    rawLinkRegex.lastIndex = 0;

    while ((match = rawLinkRegex.exec(text)) !== null) {
      ids.push(match[1]);
    }

    return ids;
  }

  /**
   * HTMLエスケープ関数
   * @param text エスケープするテキスト
   * @returns エスケープ済みのテキスト
   */
  private escapeHtml(text: string): string {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}