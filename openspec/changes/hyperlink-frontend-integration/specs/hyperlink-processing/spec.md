# 超链接处理规范

## 概述

本规范定义了原神数据中超链接功能的处理方式，包括后端数据生成、前端数据加载、前端解析和显示的完整流程。

## ADDED Requirements

### 1. 后端超链接标记处理

#### Requirement: 保留超链接标记
- **Description**: 后端处理文本时，应保留超链接标记而不是替换为空白
- **Implementation**: 修改 `genshindata/utility.go` 中的正则表达式处理
- **Scenario**:
  - 当处理技能描述文本时，包含 `{LINK#210101}...{/LINK}` 标记的文本应被转换为 `<span class="hyperlink" data-link-id="210101">...</span>`
  - 当处理武器特效文本时，包含超链接标记的文本应同样被转换

#### Requirement: 正确生成超链接数据
- **Description**: 后端应正确生成包含多语言内容的超链接数据
- **Implementation**: 修正 `GenshinHyperLinkNameData` 和 `GenshinManualTextMapData` 数据结构
- **Scenario**:
  - 当从 `HyperLinkNameExcelConifgData.json` 读取数据时，应将 `TextMapContentTextMapHash` 转换为实际的多语言文本内容
  - 当从 `ManualTextMapConfigData.json` 读取数据时，应将 `TextMapContentTextMapHash` 转换为实际的多语言文本内容

#### Requirement: 确保JSON文件正确保存
- **Description**: 后端应确保生成的JSON文件包含所有必要的超链接数据
- **Implementation**: 修改 `genshindata/clac.go` 中的数据保存逻辑
- **Scenario**:
  - 确保生成 `hyperlink_map.json` 文件并包含超链接数据
  - 确保生成 `manual_textmap_map.json` 文件并包含术语数据
  - 确保生成 `push_tips_map.json` 文件并包含教学提示数据
  - 确保生成 `tutorial_detail_map.json` 文件并包含教学详细内容数据

### 2. 前端数据加载

#### Requirement: 添加超链接数据加载常量
- **Description**: 前端应添加必要的常量以支持超链接数据加载
- **Implementation**: 修改 `src/app/shared/const/const.ts`
- **Scenario**:
  - 在 `SYS_JSON_URLS` 中添加超链接相关文件的路径映射
  - 在 `SYS_JSON_LIST` 中添加新的数据项
  - 添加 `SYS_JSON_DATA_GENSHIN_HYPERLINK` 等新常量

#### Requirement: 修改应用初始化
- **Description**: 前端应用应在启动时加载超链接相关数据
- **Implementation**: 修改 `src/app/app.component.ts` 中的 `initializeAppFactory` 方法
- **Scenario**:
  - 在应用启动时加载超链接数据并初始化到 `GenshinDataService`
  - 加载术语数据并初始化到 `GenshinDataService`
  - 加载教学提示数据并初始化到 `GenshinDataService`
  - 加载教学详细内容数据并初始化到 `GenshinDataService`

#### Requirement: 扩展数据服务
- **Description**: 前端数据服务应支持超链接相关数据的存储和访问
- **Implementation**: 修改 `src/app/shared/service/genshin/genshin-data.service.ts`
- **Scenario**:
  - 添加 `dataHyperlinkMap`、`dataManualTextMap` 等静态变量
  - 添加 `initHyperlinkData`、`initManualTextMapData` 等初始化方法
  - 添加 `getHyperlinkData`、`getManualTextMapData` 等获取方法

### 2. 前端超链接处理服务

#### Requirement: 解析超链接标记
- **Description**: 前端服务应能解析文本中的超链接标记并转换为可交互的HTML元素
- **Implementation**: 创建 `HyperlinkService` 并实现解析逻辑
- **Scenario**:
  - 当服务接收到包含 `<span class="hyperlink" data-link-id="210101">...</span>` 的文本时，应能正确识别并处理
  - 当解析超链接标记时，应保留原始文本内容作为显示文本

#### Requirement: 获取超链接内容
- **Description**: 前端服务应能根据超链接ID获取相应的详细内容
- **Implementation**: 实现内容获取和缓存机制
- **Scenario**:
  - 当请求ID为"210101"的超链接内容时，服务应从超链接数据中获取相应内容
  - 当超链接内容不存在时，应返回null或默认内容

### 3. 前端超链接显示组件

#### Requirement: 显示超链接文本
- **Description**: 组件应显示特殊样式的超链接文本，区别于普通文本
- **Implementation**: 创建 `HyperlinkComponent` 并定义样式
- **Scenario**:
  - 当渲染超链接文本时，应使用蓝色字体和下划线样式
  - 当鼠标悬停在超链接上时，应改变样式以提供视觉反馈

#### Requirement: 显示工具提示
- **Description**: 组件应在鼠标悬停时显示超链接的详细内容
- **Implementation**: 使用Angular Material的MatTooltip功能
- **Scenario**:
  - 当鼠标悬停在超链接上时，应在适当位置显示详细内容的工具提示
  - 工具提示应支持多语言内容显示

### 4. 多语言支持

#### Requirement: 多语言超链接内容
- **Description**: 超链接功能应支持所有应用语言环境
- **Implementation**: 在数据结构和处理逻辑中支持多语言
- **Scenario**:
  - 当应用语言为简体中文时，超链接内容应显示简体中文版本
  - 当应用语言为英文时，超链接内容应显示英文版本
  - 当特定语言的内容不存在时，应显示默认语言内容

## MODIFIED Requirements

### 1. 文本显示组件

#### Requirement: 支持HTML内容显示
- **Description**: 修改现有文本显示组件以支持HTML内容，从而支持超链接
- **Implementation**: 将 `innerText` 替换为 `innerHTML`
- **Scenario**:
  - 当显示技能描述时，组件应能正确渲染包含超链接的HTML内容
  - 当显示武器特效时，组件应能正确渲染包含超链接的HTML内容

## REMOVED Requirements

### 1. 超链接标记替换

#### Requirement: 移除超链接标记替换
- **Description**: 移除将超链接标记替换为空白的处理逻辑
- **Implementation**: 修改 `genshindata/utility.go` 中的正则表达式替换
- **Scenario**:
  - 当处理包含超链接标记的文本时，不再将这些标记替换为空白
  - 保留超链接标记以便前端处理

## Implementation Details

### 后端实现

1. **正则表达式修改**:
   ```go
   // 修改前
   const regexLayout3Replaced = ``
   const regexLayout4Replaced = ``
   
   // 修改后
   const regexLayout3Replaced = `<span class="hyperlink" data-link-id="$1">`
   const regexLayout4Replaced = `</span>`
   ```

2. **数据结构修正**:
   ```go
   type GenshinHyperLinkNameData struct {
       Id                 string            `json:"id"`
       TextMapContentHash uint64            `json:"textMapContentHash"`
       Content            map[string]string `json:"content"`
       ParamTypes         []string          `json:"paramTypes"`
   }
   ```

### 前端实现

1. **服务接口**:
   ```typescript
   interface HyperlinkService {
     parseHyperlinks(text: string): string;
     getHyperlinkContent(id: string): HyperlinkContent | null;
     initHyperlinkData(): Promise<void>;
   }
   ```

2. **组件接口**:
   ```typescript
   interface HyperlinkComponent {
     @Input() linkId: string;
     @Input() content: string;
   }
   ```

## Testing Requirements

### 单元测试
- 测试超链接标记解析逻辑
- 测试超链接内容获取逻辑
- 测试组件渲染和交互

### 集成测试
- 测试服务与组件的集成
- 测试多语言环境下的功能
- 测试与现有组件的集成

### 端到端测试
- 测试完整的用户交互流程
- 测试不同场景下的超链接显示
- 测试错误处理和边界情况

## Performance Requirements

### 数据加载
- 超链接数据应在应用初始化时加载
- 实现数据缓存机制避免重复请求

### 渲染性能
- 超链接解析不应显著影响文本渲染性能
- 大量超链接场景下应保持良好性能

## Accessibility Requirements

### 键盘导航
- 超链接应支持键盘导航
- 工具提示应支持键盘访问

### 屏幕阅读器
- 超链接应包含适当的ARIA属性
- 工具提示内容应能被屏幕阅读器读取

## Security Requirements

### XSS防护
- 超链接内容应经过适当的HTML转义
- 防止恶意脚本注入

### 内容验证
- 验证超链接ID的有效性
- 限制超链接内容的长度和格式