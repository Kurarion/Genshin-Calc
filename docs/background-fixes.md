# Background Loading Fixes

## 问题修复

本次修复解决了以下关键问题：

### 1. UI 卡顿问题

**问题**: 当角色没有背景图片时，UI会出现卡顿
**原因**:
- 异步加载逻辑阻塞了UI线程
- 错误处理不当导致长时间等待

**解决方案**:
- 将背景加载改为完全异步，不阻塞UI
- 保持imgState初始为CSS_STATUS_BEFORE，只在背景加载完成后设置为CSS_STATUS_FIN
- 使用2秒超时加载assets文件，5秒超时加载远程URL
- 修复动画状态转换，确保背景淡入效果正常工作

### 2. Assets背景图片无法加载

**问题**: 存在于 `assets/background/` 目录的背景图片没有被正确加载
**原因**:
- HTML模板中的 `*ngIf="backgroundURL"` 导致空背景时整个div不显示
- 文件名映射逻辑有问题

**解决方案**:
- 修改HTML模板：移除 `*ngIf`，改用条件样式
- 添加白色背景作为默认显示：`[style.background-color]="!backgroundURL ? '#ffffff' : 'none'"`
- 优化文件名映射逻辑，支持空格和特殊字符

## 技术实现

### 修改的核心文件

1. **MainComponent HTML模板**
   ```html
   <div
     class="background"
     [style.background-image]="backgroundURL ? 'url(' + backgroundURL + ')' : 'none'"
     [style.background-color]="!backgroundURL ? '#ffffff' : 'none'"
   >
   ```

2. **BackgroundImageService**
   - 改进超时处理，使用resolve而不是reject
   - 为assets加载使用更短的超时时间（2秒）
   - 简化fallback逻辑，快速返回默认背景

3. **MainComponent**
   - 异步背景加载不阻塞UI
   - 正确处理动画状态：初始为CSS_STATUS_BEFORE，加载完成后转换为CSS_STATUS_FIN
   - 保留背景淡入动画效果

## 背景加载优先级

1. **Assets文件**: `assets/background/{CharacterEnglishName}.png`
2. **原始URL**: 角色数据中的background URL
3. **白色背景**: 空字符串 + CSS背景色

## 支持的角色背景

目前assets/background目录中包含以下角色的背景：
- Aino.png
- Arlecchino.png
- Charlotte.png
- Chasca.png
- Chevreuse.png
- Chiori.png
- Citlali.png
- Clorinde.png
- Furina.png
- Neuvillette.png
- Wriothesley.png
- 等等...

## 性能优化

- **异步加载**: 不阻塞UI线程
- **快速超时**: assets文件2秒，远程URL 5秒
- **内存管理**: 自动清理object URLs
- **缓存机制**: 避免重复加载

## 测试建议

1. 测试有assets背景的角色（如Furina、Neuvillette）
2. 测试没有assets背景的角色
3. 测试旅行者角色
4. 测试网络断开情况
5. 验证UI响应性

所有修复都向后兼容，不会影响现有功能。