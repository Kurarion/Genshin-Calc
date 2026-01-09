# Change: Update Project Conventions in project.md

## Why
当前 `project.md` 文件中的项目约定、技术栈版本和架构描述与实际项目状态存在不符之处。同时需要明确添加代码注释的语言规范（前端使用日文注释，后端使用中文注释），更新测试工作流程（仅进行代码Review），并将 `openspec/workflow-guide.md` 中的有用内容整合到 `project.md` 中以简化项目文档结构。

## What Changes
- **更新技术栈版本**：修正 Angular、TypeScript 及其他依赖的版本号以匹配实际项目状态
- **更新项目架构描述**：确保架构模式与当前代码实现一致
- **添加代码注释规范**：
  - 前端代码（TypeScript/HTML/CSS）统一使用**日文**注释
  - 后端代码（Go）统一使用**中文**注释
- **更新测试策略**：
  - 移除测试覆盖率要求和测试编写任务
  - 改为仅进行代码 Review
  - 如需临时测试代码，测试完成后必须删除
- **整合文档并移除冗余文件**：
  - 将 `workflow-guide.md` 中的 OpenSpec 工作流程核心内容整合到 `project.md`
  - 删除 `openspec/workflow-guide.md` 文件
- **修正不符合规范的现有注释**：将前几次提案中创建的前端代码中文注释改为日文

## Impact
- Affected specs: [genshin-data](specs/genshin-data/spec.md)
- Affected code:
  - `openspec/project.md` - 主要更新目标，将整合工作流程内容
  - `openspec/workflow-guide.md` - 将被删除，内容整合到 project.md
  - 前端代码（仅前几次提案中创建的文件，包含中文注释）：
    - `src/app/shared/service/hyperlink.service.ts`
    - `src/app/shared/component/hyperlink/hyperlink.component.ts`
    - `src/app/shared/component/hyperlink-tooltip/hyperlink-tooltip.component.ts`
    - `src/app/shared/directive/hyperlink.directive.ts`
    - `src/app/shared/pipe/hyperlink.pipe.ts`
    - `src/app/shared/directive/hyperlink-interaction.directive.ts`
  - 后端代码 (genshindata/*.go) - 需要将非中文注释改为中文
- Breaking changes: None (文档和注释更新，不影响功能)
