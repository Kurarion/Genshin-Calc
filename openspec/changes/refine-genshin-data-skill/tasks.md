# Tasks: 完善 genshin-data-generator Skill

## Task 1: 提交当前修改到 Git

**Status**: 待执行

**描述**: 将已完成的脚本修改提交到 Git 仓库

**验证**:
- [ ] 运行 `git status` 确认所有修改都已正确暂存
- [ ] 运行 `git diff --staged` 检查变更内容
- [ ] 创建规范的 commit message

**Commit Message 建议**:
```
refactor(genshin-data-skill): 重新定位为数据辅助工具并简化脚本

- 删除 generate_config.py：自动生成逻辑与 AI 分析定位矛盾
- 修复脚本路径计算问题：使用统一的项目根目录查找方式
- 更新 SKILL.md：明确定位为 AI 分析辅助工具，更新工作流程
- 优化预处理数据格式：只保留等级 1 和 10，紧凑列表格式
- 实现元素推断功能：从技能描述推断角色元素（解决 tags 无效问题）

工作流程变更：
- 之前：预处理 → 自动生成配置
- 现在：预处理 → AI 分析推理 → 手动生成配置

相关文件：
- 删除: scripts/generate_config.py
- 修改: scripts/preprocess.py, export_data.py, check_unimplemented.py
- 修改: SKILL.md (重新定位，更新流程和文档)
```

---

## Task 2: 验证工具功能完整性

**Status**: 待执行

**描述**: 测试所有脚本功能确保正常工作

**验证步骤**:
1. **预处理脚本测试**:
   - [ ] 运行 `python3 preprocess.py`
   - [ ] 验证 processed_data.json 格式正确
   - [ ] 确认文件大小合理（约 7.35 MB）
   - [ ] 检查数据包含所有四种语言

2. **数据导出脚本测试**:
   - [ ] 测试角色数据导出：`python3 export_data.py --type character --id 10000002`
   - [ ] 测试武器数据导出：`python3 export_data.py --type weapon --id 11301`
   - [ ] 测试圣遗物数据导出：`python3 export_data.py --type artifact --id 301`
   - [ ] 验证导出文件格式正确

3. **检查脚本测试**:
   - [ ] 测试角色检查：`python3 check_unimplemented.py --type character`
   - [ ] 验证输出格式正确

4. **端到端测试**:
   - [ ] 完整运行一次工作流程
   - [ ] 验证 AI 可以正确读取和使用导出的数据

---

## Task 3: 创建使用文档和示例（可选）

**Status**: 待评估

**描述**: 为 AI 分析创建参考文档和示例

**可选任务**:
1. [ ] 在 `references/` 目录添加"AI 分析指南"
2. [ ] 在 `archive/` 目录创建特殊配置示例
3. [ ] 添加常见配置场景的分析示例
4. [ ] 创建角色配置分析案例

**依赖**: 完成任务 1 和 2 后，根据实际使用需求决定是否执行

---

## Task 4: 优化文档结构（可选）

**Status**: 待评估

**描述**: 根据实际使用体验优化文档组织

**可选改进**:
1. [ ] 添加快速参考卡片（cheatsheet）
2. [ ] 创建常见问题 FAQ
3. [ ] 添加故障排除指南
4. [ ] 优化 SKILL.md 的目录结构

**依赖**: 完成任务 1-2 并收集实际使用反馈后
