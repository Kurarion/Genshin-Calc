import { Injectable } from '@angular/core';
import { HttpService } from '../shared.module';
import { character } from '../class/character';

/**
 * 背景画像の読み込みとエラー処理サービス
 */
@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService {

  private cache = new Map<string, string>();
  private loadingPromises = new Map<string, Promise<string>>();
  private objectUrls = new Set<string>(); // クリーンアップ用にobject URLを追跡

  constructor(private httpService: HttpService) {}

  /**
   * 画像URLの形式を検証する
   */
  validateImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // base64エンコードされた画像かチェック
    if (url.startsWith('data:image/')) {
      return true;
    }

    // 有効なHTTP/HTTPS URLかチェック
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * キャラクターのデフォルト背景を取得する
   */
  getDefaultBackground(): string {
    return ''; // 白背景
  }

  /**
   * キャラクターの英名に基づいてassets背景パスを取得する
   */
  getAssetsBackgroundPath(characterData?: character): string {
    if (!characterData?.name?.en) {
      return '';
    }

    const englishName = characterData.name.en.trim();

    // 正確な名前が存在するかチェック
    const fileName = englishName;
    const path = `assets/background/${fileName}.png`;

    return path;
  }

  /**
   * タイムアウト付きの画像読み込み
   */
  private loadImageWithTimeout(url: string, timeout: number = 5000): Promise<Blob | null> {
    return Promise.race([
      this.httpService.get<Blob>(url, 'blob', true, false),
      new Promise<null>((resolve) =>
        setTimeout(() => {
          resolve(null); // 未処理の拒否を避けるために、拒否の代わりにnullを返す
        }, timeout)
      )
    ]);
  }

  /**
   * assets背景画像を読み込む
   */
  async loadAssetsBackground(characterData?: character): Promise<string> {
    const assetsPath = this.getAssetsBackgroundPath(characterData);
    if (!assetsPath) {
      return '';
    }

    // まずキャッシュをチェック
    if (this.cache.has(assetsPath)) {
      return this.cache.get(assetsPath)!;
    }

    // 既に読み込み中かチェック
    if (this.loadingPromises.has(assetsPath)) {
      return this.loadingPromises.get(assetsPath)!;
    }

    // 読み込みPromiseを作成
    const loadingPromise = this.performAssetsBackgroundLoad(assetsPath);
    this.loadingPromises.set(assetsPath, loadingPromise);

    try {
      const result = await loadingPromise;
      this.cache.set(assetsPath, result);
      return result;
    } finally {
      this.loadingPromises.delete(assetsPath);
    }
  }

  /**
   * 実際のassets背景読み込みを実行する
   */
  private async performAssetsBackgroundLoad(assetsPath: string): Promise<string> {
    try {

      // より短いタイムアウトでassets背景を読み込む（ローカルファイルは高速であるべき）
      const blob = await this.loadImageWithTimeout(assetsPath, 10000); // assets用10秒タイムアウト
      if (blob) {
        const objectUrl = window.URL.createObjectURL(blob);
        this.objectUrls.add(objectUrl);
        return objectUrl;
      }
    } catch (error) {
      console.warn(`Failed to load assets background: ${assetsPath}`, error);
    }

    return '';
  }

  /**
   * fallback戦略を使用して画像を読み込む
   */
  async loadImageWithFallback(url: string, characterId?: string, characterData?: character): Promise<string> {
    // まずキャッシュをチェック
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // 既に読み込み中かチェック
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // 読み込みPromiseを作成
    const loadingPromise = this.performImageLoadWithFallback(url, characterId);
    this.loadingPromises.set(url, loadingPromise);

    try {
      const result = await loadingPromise;
      this.cache.set(url, result);
      return result;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  /**
   * 実際の画像読み込みとfallbackを実行する
   */
  private async performImageLoadWithFallback(url: string, characterId?: string, characterData?: character): Promise<string> {

    // まず、キャラクターの英名に基づいてassetsから読み込みを試みる（ローカルファイルは高速であるべき）
    if (characterData) {
      const assetsBackground = await this.loadAssetsBackground(characterData);
      if (assetsBackground) {
        return assetsBackground;
      }
    }

    // assets背景がなく、URLも提供されていない場合、即座に白背景を返す
    if (!url || url === '') {
      return this.getDefaultBackground();
    }

    // URL形式を検証
    if (!this.validateImageUrl(url)) {
      return this.getDefaultBackground();
    }

    // 元の画像の読み込みを試みる（ハングアップを防ぐためにタイムアウト付き）
    try {
      const blob = await this.loadImageWithTimeout(url);
      if (blob) {
        const objectUrl = window.URL.createObjectURL(blob);
        this.objectUrls.add(objectUrl);
        return objectUrl;
      }
    } catch (error) {
      console.warn(`Failed to load background image: ${url}`, error);
      // 追加処理を避けるためにhandleBackgroundLoadErrorを呼び出さない
    }

    // デフォルト背景（白背景）への最終fallback
    return this.getDefaultBackground();
  }

  /**
   * 特定のURLまたは全キャッシュをクリアする
   */
  clearCache(url?: string): void {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }

  /**
   * キャッシュサイズを取得する（デバッグ用）
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * メモリリークを防ぐためにobject URLsをクリーンアップする
   */
  cleanupObjectUrls(): void {
    for (const url of this.objectUrls) {
      if (url.startsWith('blob:')) {
        try {
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Failed to revoke object URL:', url, error);
        }
      }
    }
    this.objectUrls.clear();
  }

  /**
   * 特定のobject URLをクリーンアップする
   */
  revokeObjectUrl(url: string): void {
    if (url.startsWith('blob:') && this.objectUrls.has(url)) {
      try {
        window.URL.revokeObjectURL(url);
        this.objectUrls.delete(url);
      } catch (error) {
        console.warn('Failed to revoke object URL:', url, error);
      }
    }
  }

  /**
   * 追跡中のobject URL数を取得する（デバッグ用）
   */
  getObjectUrlCount(): number {
    return this.objectUrls.size;
  }
}