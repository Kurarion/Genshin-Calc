# Implementation Tasks

## 1. 新增文件创建

- [x] 创建 `scripts/version_manager.py`
- [x] 创建 `scripts/fetch_version.py`
- [x] 创建 `scripts/diff_analyzer.py`

## 2. 现有脚本适配

- [x] 修改 `scripts/preprocess.py` 添加 `--output-dir` 参数
- [x] 修改 `scripts/query_data_config.py` 添加 `--version` 参数

## 3. SKILL.md 更新

- [x] 添加版本管理工作流文档
- [x] 更新文件管理结构说明
- [x] 添加差分分析使用指南

## 4. 规范文档创建

- [x] 创建 `specs/genshin-data-versioning/spec.md`
  - 定义版本元数据格式
  - 定义差分输出格式
  - 定义 API 接口规范

## 5. Git 配置

- [x] 更新 `.gitignore` 排除版本数据目录
- [x] 验证元数据文件可被 Git 追踪

## 6. 脚本修复

- [x] 修复 `fetch_version.py` 的 GitLab API 调用
- [x] 添加 `--repo` 参数支持自定义仓库 URL
- [x] 添加 `--branch` 参数支持自定义分支（master/main）
- [x] 修复 GenshinData Go 工具调用，正确使用 `-targetDir` 和 `-resUrl` 参数
- [x] 改进错误处理和日志输出

## 7. 测试验证

- [ ] 版本获取端到端测试
- [ ] 差分生成测试
- [ ] 未实现检查测试
- [ ] 版本解析测试

## 8. 文档完善

- [x] 添加工作流示例到 SKILL.md
- [ ] 创建迁移指南（如需要）
