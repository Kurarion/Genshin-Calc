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
   * 处理文本中的超链接标记，返回处理后的HTML字符串
   * @param text 原始文本
   * @returns 处理后的HTML字符串
   */
  processHyperlinks(text: string): Observable<string> {
    if (!text) {
      return new Observable(observer => observer.next(text));
    }
    
    // 获取当前语言
    return this.languageService.getLang().pipe(
      map(currentLang => {
        // 使用正则表达式匹配原始超链接标记 {LINK#id}text{LINK#}
        const rawLinkRegex = /\{LINK#([A-Za-z]*\d+)\}(.*?)\{\/LINK\}/g;

        return text.replace(rawLinkRegex, (_match, linkId, linkText) => {
          // 提取数字部分（去除字母前缀）
          const numericId = linkId.replace(/^[A-Za-z]+/, '');

          // 获取超链接数据
          const hyperlinkData = GenshinDataService.getHyperlink(numericId);
          if (!hyperlinkData) {
            // 如果没有找到数据，返回原始文本
            return linkText;
          }

          // 返回带有title属性的HTML元素（title通常被Angular保留）
          return `<span class="${Const.HYPERLINK_CSS_CLASS}" title="${linkId}">${this.escapeHtml(linkText)}</span>`;
        });
      })
    );
  }

  /**
   * 获取超链接的详细内容（包含所有语言）
   * @param linkId 超链接ID
   * @returns 包含所有语言内容的对象
   */
  getHyperlinkContentById(linkId: string): Observable<any> {
    // 提取数字部分（去除字母前缀）
    const numericId = linkId.replace(/^[A-Za-z]+/, '');

    const hyperlinkData = GenshinDataService.getHyperlink(numericId);
    if (!hyperlinkData) {
      return new Observable(observer => {
        observer.next({});
        observer.complete();
      });
    }

    // 预加载所有语言内容
    const allLanguageContent: any = {};

    // 处理所有可用语言
    const languages = [Const.LAN_CHS, Const.LAN_CHT, Const.LAN_EN, Const.LAN_JP];

    languages.forEach(lang => {
      const content = this.getHyperlinkContent(hyperlinkData, lang);
      if (content) {
        allLanguageContent[lang] = content;
      }
    });

    // 立即返回所有语言内容
    return new Observable(observer => {
      observer.next(allLanguageContent);
      observer.complete();
    });
  }

  /**
   * 根据当前语言选择显示内容
   * @param allLanguageContent 包含所有语言内容的对象
   * @returns 当前语言的内容
   */
  getContentForCurrentLanguage(allLanguageContent: any): string {
    try {
      const currentLang = this.languageService.getCurrentLang();

      // 首先尝试当前语言
      if (allLanguageContent[currentLang]) {
        return allLanguageContent[currentLang];
      }

      // 尝试默认语言
      if (allLanguageContent[Const.DEFAULT_LANG]) {
        return allLanguageContent[Const.DEFAULT_LANG];
      }

      // 尝试英文
      if (allLanguageContent[Const.LAN_EN]) {
        return allLanguageContent[Const.LAN_EN];
      }

      // 如果都没有，返回第一个可用语言
      const availableLanguages = Object.keys(allLanguageContent);
      if (availableLanguages.length > 0) {
        return allLanguageContent[availableLanguages[0]];
      }

      return '';
    } catch (error) {
      // 回退：返回第一个可用语言
      const availableLanguages = Object.keys(allLanguageContent);
      if (availableLanguages.length > 0) {
        return allLanguageContent[availableLanguages[0]];
      }
      return '';
    }
  }

  /**
   * 获取手动文本映射的内容
   * @param textMapHash 文本映射哈希值
   * @returns 文本内容
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
   * 从超链接数据中获取当前语言的内容
   * @param hyperlinkData 超链接数据
   * @param lang 语言代码
   * @returns 本地化内容
   */
  private getHyperlinkContent(hyperlinkData: HyperlinkData, lang: string): string {
    // 首先尝试获取当前语言的内容
    let content = hyperlinkData.content[lang];

    // 如果当前语言没有内容，尝试获取默认语言的内容
    if (!content && lang !== Const.DEFAULT_LANG) {
      content = hyperlinkData.content[Const.DEFAULT_LANG];
    }

    // 如果还是没有内容，尝试获取英文内容
    if (!content && lang !== Const.LAN_EN) {
      content = hyperlinkData.content[Const.LAN_EN];
    }

    // 如果仍然没有内容，返回空字符串
    if (!content) {
      return '';
    }

    // 处理内容中的标记，与utility.go中的处理保持一致
    content = this.processContentTags(content);

    return content;
  }

  /**
   * 处理内容中的各种标记标签
   * @param content 原始内容
   * @returns 处理后的内容
   */
  private processContentTags(content: string): string {
    // 处理颜色标签 <color=#...> -> <font color=...>
    content = content.replace(/<color=#([^>]+)>/g, '<font color="$1">');
    content = content.replace(/<\/color>/g, '</font>');

    // 处理换行符 \n -> <br>
    content = content.replace(/\\n/g, '<br>');

    // 处理参数标签 {PARAM#...} - 保持原样或转换为显示友好的格式
    content = content.replace(/\{PARAM#[^}]+\}/g, (match) => {
      // 简单处理：提取参数标识符并显示
      const paramId = match.match(/PARAM#([^|]+)/)?.[1];
      return `<span style="color: #FFD700; font-weight: bold;">[${paramId}]</span>`;
    });

    // 处理其他可能的标记
    content = content.replace(/\{[^}]+\}/g, '<span style="color: #FF9999;">?</span>');

    return content;
  }

  /**
   * 检查文本是否包含超链接标记
   * @param text 文本
   * @returns 是否包含超链接
   */
  hasHyperlinks(text: string): boolean {
    if (!text) return false;
    const rawLinkRegex = /\{LINK#([A-Za-z]*\d+)\}/g;
    return rawLinkRegex.test(text);
  }

  /**
   * 从文本中提取所有超链接ID
   * @param text 文本
   * @returns 超链接ID数组
   */
  extractHyperlinkIds(text: string): string[] {
    if (!text) return [];

    const ids: string[] = [];
    let match;

    // 使用匹配原始LINK#标记的正则表达式
    const rawLinkRegex = /\{LINK#([A-Za-z]*\d+)\}/g;

    // 重置正则表达式的lastIndex
    rawLinkRegex.lastIndex = 0;

    while ((match = rawLinkRegex.exec(text)) !== null) {
      ids.push(match[1]);
    }

    return ids;
  }

  /**
   * HTML转义函数
   * @param text 需要转义的文本
   * @returns 转义后的文本
   */
  private escapeHtml(text: string): string {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}