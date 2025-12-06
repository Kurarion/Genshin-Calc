import { Injectable } from '@angular/core';
import { HttpService } from '../shared.module';
import { character } from '../class/character';

/**
 * Background image loading and error handling service
 * 背景图片加载和错误处理服务
 */
@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService {

  private cache = new Map<string, string>();
  private loadingPromises = new Map<string, Promise<string>>();
  private objectUrls = new Set<string>(); // Track object URLs for cleanup

  constructor(private httpService: HttpService) {}

  /**
   * Validate image URL format
   * 验证图片URL格式
   */
  validateImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // Check if it's a base64 encoded image
    if (url.startsWith('data:image/')) {
      return true;
    }

    // Check if it's a valid HTTP/HTTPS URL
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Get default background for character
   * 获取角色的默认背景
   */
  getDefaultBackground(): string {
    return ''; // White background
  }

  /**
   * Get assets background path based on character English name
   * 根据角色英文名获取assets背景路径
   */
  getAssetsBackgroundPath(characterData?: character): string {
    if (!characterData?.name?.en) {
      return '';
    }

    const englishName = characterData.name.en.trim();

    // Check if exact name exists
    const fileName = englishName;
    const path = `assets/background/${fileName}.png`;

    return path;
  }

  /**
   * Load image with timeout
   * 带超时的图片加载
   */
  private loadImageWithTimeout(url: string, timeout: number = 5000): Promise<Blob | null> {
    return Promise.race([
      this.httpService.get<Blob>(url, 'blob', true, false),
      new Promise<null>((resolve) =>
        setTimeout(() => {
          resolve(null); // Return null instead of rejecting to avoid unhandled rejections
        }, timeout)
      )
    ]);
  }

  /**
   * Load assets background image
   * 加载assets背景图片
   */
  async loadAssetsBackground(characterData?: character): Promise<string> {
    const assetsPath = this.getAssetsBackgroundPath(characterData);
    if (!assetsPath) {
      return '';
    }

    // Check cache first
    if (this.cache.has(assetsPath)) {
      return this.cache.get(assetsPath)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(assetsPath)) {
      return this.loadingPromises.get(assetsPath)!;
    }

    // Create loading promise
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
   * Perform the actual assets background loading
   * 执行实际的assets背景加载
   */
  private async performAssetsBackgroundLoad(assetsPath: string): Promise<string> {
    try {

      // Load assets background with shorter timeout (local files should be fast)
      const blob = await this.loadImageWithTimeout(assetsPath, 10000); // 10 second timeout for assets
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
   * Load image with fallback strategy
   * 使用fallback策略加载图片
   */
  async loadImageWithFallback(url: string, characterId?: string, characterData?: character): Promise<string> {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // Create loading promise
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
   * Perform the actual image loading with fallback
   * 执行实际的图片加载和fallback
   */
  private async performImageLoadWithFallback(url: string, characterId?: string, characterData?: character): Promise<string> {

    // First, try to load from assets based on character English name (this should be fast for local files)
    if (characterData) {
      const assetsBackground = await this.loadAssetsBackground(characterData);
      if (assetsBackground) {
        return assetsBackground;
      }
    }

    // If no assets background and no URL provided, return white background immediately
    if (!url || url === '') {
      return this.getDefaultBackground();
    }

    // Validate URL format
    if (!this.validateImageUrl(url)) {
      return this.getDefaultBackground();
    }

    // Try to load the original image (with timeout to prevent hanging)
    try {
      const blob = await this.loadImageWithTimeout(url);
      if (blob) {
        const objectUrl = window.URL.createObjectURL(blob);
        this.objectUrls.add(objectUrl);
        return objectUrl;
      }
    } catch (error) {
      console.warn(`Failed to load background image: ${url}`, error);
      // Don't call handleBackgroundLoadError to avoid additional processing
    }

    // Final fallback to default background (white background)
    return this.getDefaultBackground();
  }

  /**
   * Clear cache for a specific URL or all cache
   * 清除特定URL或全部缓存
   */
  clearCache(url?: string): void {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache size (for debugging)
   * 获取缓存大小（用于调试）
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Cleanup object URLs to prevent memory leaks
   * 清理object URLs以防止内存泄漏
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
   * Cleanup specific object URL
   * 清理特定的object URL
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
   * Get number of tracked object URLs (for debugging)
   * 获取跟踪的object URL数量（用于调试）
   */
  getObjectUrlCount(): number {
    return this.objectUrls.size;
  }
}