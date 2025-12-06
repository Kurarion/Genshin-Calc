# Project Context

## Purpose
Genshin-Calc 是一个原神伤害计算器应用，旨在为玩家提供精确的角色伤害计算、圣遗物优化、武器选择和队伍搭配建议。该应用支持多语言（简体中文、繁体中文、英文、日文），并可以通过 Enka.Network API 导入游戏数据，帮助玩家优化角色配置和提升游戏体验。

## Tech Stack

### Frontend
- **前端框架**: Angular 14.2.12
- **UI 组件库**: Angular Material 14.2.12
- **编程语言**: TypeScript 4.6.2
- **图表库**: ngx-echarts 14.0.0 (用于伤害可视化)
- **状态管理**: Angular Services + RxJS
- **构建工具**: Angular CLI 14.2.12, Webpack 5.75.0
- **样式**: SCSS, Angular Material 主题系统
- **国际化**: @ngx-translate/core 14.0.0
- **数据存储**: 本地存储 (localStorage)
- **PWA 支持**: @angular/service-worker 14.2.12

### Backend / Tooling
- **数据处理**: Go 1.18 (CLI 工具)
- **数据格式**: JSON (静态资源)

### Development & Testing
- **测试框架**: Karma 6.4.1, Jasmine 4.5.0
- **代码规范**: ESLint 8.31.0, Prettier 2.8.1
- **包管理**: npm
- **版本控制**: Git

## Project Conventions

### Code Style
- **TypeScript**: 遵循 Angular 官方风格指南，使用严格模式
- **命名约定**:
  - 组件: kebab-case (例: character-detail)
  - 类: PascalCase (例: CharacterService)
  - 方法/变量: camelCase (例: calculateDamage)
  - 常量: UPPER_SNAKE_CASE (例: MAX_LEVEL)
- **文件组织**:
  - 按功能模块组织 (features/, shared/, root/)
  - 每个功能模块包含组件、服务、管道和指令
  - 共享组件和工具统一放在 shared/ 目录
- **导入顺序**: 1. Angular 模块 2. 第三方库 3. 项目内部模块 4. 相对路径导入

### Architecture Patterns
- **模块化设计**:
  - Feature modules: character, homePage
  - Shared module: 通用组件、服务、管道、指令
  - Lazy loading: 按需加载功能模块
- **服务层分离**:
  - 业务逻辑封装在服务中 (GenshinDataService, HyperlinkService 等)
  - 组件负责展示和用户交互
- **数据流**:
  - 单向数据流，使用 RxJS Observables 处理异步操作
  - 静态数据通过 Go 工具预处理为 JSON
  - 动态数据通过 API 获取
- **依赖注入**: 全面使用 Angular 依赖注入系统
- **类型安全**: 使用 TypeScript 接口定义所有数据结构
- **错误处理**: 统一错误处理机制，使用 Angular 服务集中管理

### Project Structure
```
src/
├── app/
│   ├── features/                 # 功能模块
│   │   ├── character/           # 角色计算模块
│   │   │   ├── component/       # 角色相关组件
│   │   │   │   ├── artifact/    # 圣遗物管理
│   │   │   │   ├── character/   # 角色选择与属性
│   │   │   │   ├── weapon/      # 武器选择
│   │   │   │   ├── talent/      # 天赋技能
│   │   │   │   ├── constellation/# 命座效果
│   │   │   │   ├── enemy/       # 敌人配置
│   │   │   │   ├── team/        # 队伍配置
│   │   │   │   └── dps/         # DPS 计算
│   │   │   └── character.module.ts
│   │   └── homePage/           # 首页模块
│   ├── shared/                 # 共享模块
│   │   ├── component/         # 可复用组件
│   │   ├── service/           # 业务服务
│   │   │   ├── genshin/       # 原神相关服务
│   │   │   └── hyperlink/     # 超链接处理服务
│   │   ├── directive/         # 自定义指令
│   │   ├── pipe/             # 自定义管道
│   │   ├── const/            # 常量配置
│   │   └── interface/        # TypeScript 接口
│   ├── root/                 # 根布局组件
│   └── environments/         # 环境配置
├── assets/                   # 静态资源
│   ├── i18n/                # 国际化文件 (4种语言)
│   ├── genshin/             # 游戏数据 (Go 工具生成)
│   └── icons/               # 图标资源
└── styles.css              # 全局样式

genshindata/                # Go 数据处理工具
├── clac.go                # 主要数据处理逻辑
├── const.go               # 常量定义
├── datatype.go            # 数据类型
├── genshintype.go         # 原神特定类型
└── utility.go             # 工具函数

openspec/                  # OpenSpec 规范管理
├── project.md            # 项目上下文 (当前文件)
├── specs/                # 当前已实现的功能规范
├── changes/              # 变更提案
│   └── archive/          # 已完成的变更
└── AGENTS.md             # AI 助手指南
```

### Testing Strategy
- **单元测试**: 对所有服务和业务逻辑编写单元测试
- **组件测试**: 对关键组件进行集成测试
- **E2E 测试**: 对主要用户流程进行端到端测试
- **测试覆盖率**: 目标覆盖率 > 80%
- **测试命名**: 使用描述性测试名称，遵循 "should [expected behavior] when [condition]" 模式

### Git Workflow
- **分支策略**: GitFlow (main, develop, feature/*, release/*, hotfix/*)
- **提交规范**: 使用约定式提交 (Conventional Commits)
  - feat: 新功能
  - fix: 修复 bug
  - docs: 文档更新
  - style: 代码格式调整
  - refactor: 代码重构
  - test: 测试相关
  - chore: 构建过程或辅助工具的变动
- **代码审查**: 所有功能分支必须经过代码审查才能合并
- **版本管理**: 使用语义化版本控制 (SemVer)

## Domain Context

### 原神游戏机制
- **元素系统**: 七种元素 (风、岩、雷、草、水、火、冰) 及其相互作用
- **伤害计算**: 基于攻击力、伤害加成、暴击率、暴击伤害、敌人抗性等因素
- **圣遗物系统**: 5个部位 (生之花、死之羽、时之沙、空之杯、理之冠) 及不同套装效果
- **角色天赋**: 普通攻击、元素战技、元素爆发三种天赋类型
- **武器系统**: 不同武器类型 (单手剑、双手剑、长柄武器、弓、法器) 及其特效
- **队伍系统**: 4人队伍，角色间存在协同效应和元素反应

### 数据来源
- **游戏数据**: 从原神官方资源提取，通过 Go 工具处理和格式化
- **用户数据**: 通过 Enka.Network API 导入玩家实际游戏数据
- **本地存储**: 用户配置和计算结果保存在浏览器本地存储中

## Important Constraints

### 性能约束
- **前端性能**: 应用首次加载时间 < 3秒，交互响应时间 < 200ms
- **数据加载**: 大量游戏数据需要高效加载和缓存策略
- **计算性能**: 复杂伤害计算需要在 100ms 内完成

### 兼容性约束
- **浏览器支持**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **移动端支持**: 响应式设计，支持主流移动设备
- **PWA 兼容**: 支持离线使用和安装到主屏幕

### 数据约束
- **数据准确性**: 所有计算结果必须与游戏内实际表现一致
- **数据更新**: 游戏版本更新时需要及时更新数据
- **多语言支持**: 所有文本内容必须支持四种语言

## External Dependencies

### API 依赖
- **Enka.Network API**: 用于导入玩家游戏数据
  - 端点: https://enka.network/api/uid/{uid}
  - 限制: 每分钟 100 次请求
  - 数据: 角色详情、圣遗物、武器、天赋等信息

### 资源依赖
- **原神游戏资源**: 
  - 角色图像、图标、特效等视觉资源
  - 游戏数据文件 (角色属性、武器数据、圣遗物数据等)
- **第三方库依赖**:
  - Angular Material: UI 组件库
  - ngx-translate: 国际化支持
  - RxJS: 响应式编程
  - lodash: 工具函数库

### 开发工具依赖
- **Go 工具链**: 用于处理游戏数据和生成静态资源
- **Angular CLI**: 用于项目构建、开发和测试
- **ESLint & Prettier**: 代码规范和格式化
