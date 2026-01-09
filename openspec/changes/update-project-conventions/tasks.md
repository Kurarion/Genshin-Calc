# Implementation Tasks

## 1. 文档更新
- [x] 1.1 检查并更新 `openspec/project.md` 中的技术栈版本号
- [x] 1.2 更新 `project.md` 中的项目架构描述以匹配实际代码
- [x] 1.3 在 `project.md` 的 Code Style 部分添加注释语言规范
- [x] 1.4 更新 `project.md` 的 Testing Strategy 部分，改为仅代码 Review
- [x] 1.5 将 `openspec/workflow-guide.md` 中的 OpenSpec 工作流程核心内容整合到 `project.md`
- [x] 1.6 删除 `openspec/workflow-guide.md` 文件

## 2. 后端代码注释修正 (Go → 中文)
- [x] 2.1 检查并修正 `genshindata/clac.go` 中的注释
- [x] 2.2 检查并修正 `genshindata/const.go` 中的注释
- [x] 2.3 检查并修正 `genshindata/datatype.go` 中的注释
- [x] 2.4 检查并修正 `genshindata/genshintype.go` 中的注释
- [x] 2.5 检查并修正 `genshindata/utility.go` 中的注释

## 3. 前端代码注释修正 (仅限前几次提案中的文件，中文 → 日文)
- [x] 3.1 修正 `src/app/shared/service/hyperlink.service.ts` 中的中文注释为日文
- [x] 3.2 修正 `src/app/shared/component/hyperlink/hyperlink.component.ts` 中的中文注释为日文
- [x] 3.3 修正 `src/app/shared/component/hyperlink-tooltip/hyperlink-tooltip.component.ts` 中的中文注释为日文
- [x] 3.4 修正 `src/app/shared/directive/hyperlink.directive.ts` 中的中文注释为日文
- [x] 3.5 修正 `src/app/shared/pipe/hyperlink.pipe.ts` 中的中文注释为日文
- [x] 3.6 修正 `src/app/shared/directive/hyperlink-interaction.directive.ts` 中的中文注释为日文

## 4. 验证
- [x] 4.1 验证所有 Go 文件注释已统一为中文
- [x] 4.2 验证指定的前端文件注释已统一为日文
- [x] 4.3 确认 `workflow-guide.md` 已被删除
- [x] 4.4 确认 `project.md` 已正确更新并整合了工作流程内容

## 注意事项
- 在修正注释时，确保不改变代码逻辑
- 注释翻译应保持原意，使用自然流畅的目标语言
- 对于无法直接翻译的专有名词，可以保留原文或添加括号说明
- 仅需修正上述列出的前端文件，其他前端文件无需改动
