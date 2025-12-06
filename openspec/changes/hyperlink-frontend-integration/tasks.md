# 超链接前端集成实施任务

## 后端修改任务

### 1. 修改正则表达式处理
- [x] 修改 `genshindata/utility.go` 中的 `regexLayout3Replaced` 和 `regexLayout4Replaced`
- [x] 保留 `{LINK#id}...{/LINK}` 标记而不是替换为空白
- [x] 添加新的正则表达式来识别和处理超链接标记
- [x] 测试修改后的正则表达式处理是否正确

### 2. 修正数据结构
- [x] 修正 `genshindata/genshintype.go` 中的 `GenshinPushTipsListData` 结构
- [x] 修正 `genshindata/genshintype.go` 中的 `GenshinTutorialDetailData` 结构
- [x] 修正 `genshindata/genshintype.go` 中的 `GenshinHyperLinkNameData` 结构
- [x] 修正 `genshindata/genshintype.go` 中的 `GenshinManualTextMapData` 结构
- [x] 确保数据结构能够正确映射到前端需要的格式

### 3. 确保数据正确生成
- [x] 验证从 `@/tmp/ExcelBinOutput/HyperLinkNameExcelConifgData.json` 读取的数据
- [x] 验证从 `@/tmp/ExcelBinOutput/ManualTextMapConfigData.json` 读取的数据
- [x] 验证从 `@/tmp/ExcelBinOutput/PushTipsConfigData.json` 读取的数据
- [x] 验证从 `@/tmp/ExcelBinOutput/TutorialDetailExcelConfigData.json` 读取的数据
- [x] 确保TextMapHash能够正确映射到各种语言的实际文本

### 4. 确保JSON文件正确保存
- [x] 验证 `hyperlink_map.json` 文件正确生成并包含超链接数据
- [x] 验证 `manual_textmap_map.json` 文件正确生成并包含术语数据
- [x] 验证 `push_tips_map.json` 文件正确生成并包含教学提示数据
- [x] 验证 `tutorial_detail_map.json` 文件正确生成并包含教学详细内容数据

## 前端开发任务

### 5. 添加数据加载常量
- [x] 在 `src/app/shared/const/const.ts` 中添加超链接相关常量
- [x] 添加 `SYS_JSON_DATA_GENSHIN_HYPERLINK` 常量
- [x] 添加 `SYS_JSON_DATA_GENSHIN_MANUAL_TEXTMAP` 常量
- [x] 添加 `SYS_JSON_DATA_GENSHIN_PUSH_TIPS` 常量
- [x] 添加 `SYS_JSON_DATA_GENSHIN_TUTORIAL_DETAIL` 常量
- [x] 在 `SYS_JSON_URLS` 中添加对应的文件路径
- [x] 在 `SYS_JSON_LIST` 中添加新的数据项

### 6. 修改应用初始化
- [x] 在 `src/app/app.component.ts` 中添加超链接数据加载
- [x] 添加 `GenshinDataService.initHyperlinkData(data)` 调用
- [x] 添加 `GenshinDataService.initManualTextMapData(data)` 调用
- [x] 添加 `GenshinDataService.initPushTipsData(data)` 调用
- [x] 添加 `GenshinDataService.initTutorialDetailData(data)` 调用
- [x] 确保数据加载完成后调用 `genshinDataService.update()`

### 7. 扩展数据服务
- [x] 在 `src/app/shared/service/genshin/genshin-data.service.ts` 中添加静态数据变量
- [x] 添加 `static dataHyperlinkMap: Record<string, any>`
- [x] 添加 `static dataManualTextMap: Record<string, any>`
- [x] 添加 `static dataPushTipsMap: Record<string, any>`
- [x] 添加 `static dataTutorialDetailMap: Record<string, any>`
- [x] 添加相应的初始化方法

### 8. 创建超链接处理服务
- [x] 创建 `src/app/shared/service/hyperlink.service.ts`
- [x] 实现超链接标记解析逻辑，解析 `{LINK#id}...{/LINK}` 标记
- [x] 从超链接数据中获取相应内容
- [x] 支持多语言环境下的超链接内容显示
- [x] 将服务集成到现有的数据服务中

### 9. 创建超链接显示组件
- [x] 创建 `src/app/shared/component/hyperlink-tooltip/hyperlink-tooltip.component.ts`
- [x] 创建 `src/app/shared/component/hyperlink-tooltip/hyperlink-tooltip.component.html`
- [x] 创建 `src/app/shared/component/hyperlink-tooltip/hyperlink-tooltip.component.css`
- [x] 实现特殊样式的超链接文本显示
- [x] 实现鼠标悬停时显示详细内容的工具提示
- [x] 添加样式和动画效果

### 10. 修改现有显示组件
- [x] 修改 `src/app/features/character/component/talent/talent.component.html`
- [x] 修改 `src/app/features/character/component/constellation/constellation.component.html`
- [x] 修改 `src/app/features/character/component/extra-info/extra-info.component.html`
- [x] 修改 `src/app/features/character/component/weapon/weapon.component.html`
- [x] 使用 `innerHTML` 替代 `innerText` 以支持HTML超链接
- [x] 集成超链接处理服务和组件
- [x] 确保不影响现有功能的正常工作

## 集成和测试任务

### 11. 功能集成
- [x] 将超链接组件添加到共享模块
- [x] 更新必要的导入和声明
- [x] 确保超链接服务在应用启动时正确初始化
- [x] 验证数据加载和处理的正确性

### 12. 多语言测试
- [x] 测试简体中文环境下的超链接显示
- [x] 测试繁体中文环境下的超链接显示
- [x] 测试英文环境下的超链接显示
- [x] 测试日文环境下的超链接显示
- [x] 确保所有语言环境下都能正确显示超链接内容

### 13. 性能优化
- [x] 优化超链接解析性能
- [x] 实现超链接内容的缓存机制
- [x] 减少不必要的DOM操作
- [x] 确保大量超链接不会影响页面渲染性能

### 14. 错误处理和边界情况
- [x] 处理超链接ID不存在的情况
- [x] 处理超链接内容为空的情况
- [x] 处理网络请求失败的情况
- [x] 添加适当的错误提示和降级方案

## 文档和部署任务

### 11. 文档更新
- [x] 更新组件使用文档
- [x] 添加超链接处理API文档
- [x] 更新开发指南
- [x] 添加示例代码和最佳实践

### 12. 部署和发布
- [x] 准备生产环境配置
- [x] 执行全面的回归测试
- [x] 准备发布说明
- [x] 执行部署计划