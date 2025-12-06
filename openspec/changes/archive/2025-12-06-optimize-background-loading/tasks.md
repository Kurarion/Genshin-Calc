# 背景图片加载优化任务清单

## 任务1: 创建BackgroundImageService服务
**文件**: `src/app/shared/service/background-image.service.ts`

### 子任务:
- [x] 创建BackgroundImageService类，包含所有必要方法
- [x] 实现isTravelerCharacter()方法来识别旅行者角色
- [x] 实现validateImageUrl()方法来预检查URL有效性
- [x] 实现loadImageWithFallback()方法来处理图片加载和错误
- [x] 实现getDefaultBackground()方法来获取默认背景
- [x] 添加相关的TypeScript接口定义
- [x] 添加内存管理和URL清理功能

## 任务2: 创建背景图片配置
**文件**: `src/app/shared/const/background.config.ts`

### 子任务:
- [x] 定义BackgroundConfig接口
- [x] 创建默认背景配置对象
- [x] 配置旅行者专用背景URL
- [x] 设置超时时间和备用背景列表
- [x] 添加本地CSS背景作为最终fallback
- [x] 优化base64编码的SVG背景图片大小

## 任务3: 修改MainComponent背景初始化逻辑
**文件**: `src/app/features/character/component/main/main.component.ts`

### 子任务:
- [x] 注入BackgroundImageService依赖
- [x] 重构initializeBackGroundImage()方法使用新服务
- [x] 添加加载状态和错误状态处理
- [x] 更新相关的错误处理逻辑
- [x] 保持现有的动画和状态转换逻辑
- [x] 移除不再需要的HttpService依赖

## 任务4: 添加默认背景图片资源
**文件**: `src/assets/background/`

### 子任务:
- [x] 创建通用默认背景图片（建议使用轻量级渐变或图案）
- [x] 创建旅行者专用背景图片
- [x] 准备备用背景图片列表
- [x] 确保所有默认背景图片都经过优化，大小控制在合理范围内

## 任务5: 更新SharedModule
**文件**: `src/app/shared/shared.module.ts`

### 子任务:
- [x] 将BackgroundImageService添加到exports数组中
- [ ] 导出相关的配置和接口
- [x] 确保服务在整个应用中可用（通过providedIn: 'root'）

## 任务6: 添加单元测试
**文件**: `src/app/shared/service/background-image.service.spec.ts`

### 子任务:
- [x] 测试isTravelerCharacter()方法的各种输入
- [x] 测试validateImageUrl()方法的URL验证逻辑
- [x] 测试loadImageWithFallback()的成功和失败场景
- [x] 测试超时机制的正确性
- [x] 测试默认背景选择的逻辑
- [x] 测试缓存机制和内存管理功能

## 任务7: 添加集成测试
**文件**: `src/app/features/character/component/main/main.component.spec.ts`

### 子任务:
- [x] 测试旅行者角色的背景加载
- [x] 测试普通角色的背景加载
- [x] 测试网络错误时的fallback行为
- [x] 测试背景图片加载的性能表现
- [x] 验证UI动画在新逻辑下的正确性

## 任务8: 性能验证和优化
**目标**: 确保新实现不会影响应用性能

### 子任务:
- [x] 测量背景图片加载时间，确保符合5秒超时要求
- [x] 验证缓存机制的有效性
- [x] 测试在不同网络条件下的表现
- [x] 确认内存使用合理，没有内存泄漏
- [x] 验证错误处理不会产生控制台错误（只有警告）
- [x] 添加object URL清理机制防止内存泄漏

## 任务9: 文档更新
**文件**: 相关文档和注释

### 子任务:
- [x] 为BackgroundImageService添加JSDoc注释
- [x] 更新组件相关的注释说明
- [x] 记录配置项的使用方法
- [x] 添加故障排除指南到项目文档
- [x] 创建完整的优化文档

## 验收标准

1. **功能验收**:
   - 旅行者角色显示正确的默认背景
   - 普通角色在背景加载失败时显示默认背景
   - 背景加载时间不超过5秒
   - UI保持响应，无卡顿现象

2. **性能验收**:
   - 背景加载错误不影响其他UI元素
   - 缓存机制有效，重复访问时无网络请求
   - 内存使用稳定，无内存泄漏

3. **代码质量验收**:
   - 单元测试覆盖率达到80%以上
   - 代码符合项目编码规范
   - 错误处理完整且适当
   - 配置灵活，易于维护

## 依赖关系

- 任务1和任务2可以并行进行
- 任务3依赖任务1和任务2的完成
- 任务4可以独立进行，但任务3需要任务4的资源
- 任务5依赖任务1的完成
- 任务6和任务7依赖对应的功能任务完成
- 任务8在所有功能任务完成后进行
- 任务9在整个开发过程中持续进行