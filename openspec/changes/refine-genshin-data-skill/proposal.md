# Proposal: 完善 genshin-data-generator Skill

## Why

当前的 `genshin-data-generator` Skill 定位不清晰，存在以下问题需要解决：

1. **定位矛盾**：描述为"配置生成器"，但实际应该是"辅助分析工具"
   - 存在 32KB 的 `generate_config.py` 自动生成脚本
   - 自动判断逻辑复杂且不准确，无法处理特殊情况
   - 与 AI 分析的定位相矛盾

2. **技术债务**：多个脚本的路径计算方式不一致
   - 使用固定的 parent 层级导致路径错误
   - 需要统一为动态查找项目根目录的方式

3. **数据问题**：角色元素无法从 tags 获取
   - 原始数据中 tags 字段全部为 ['None']
   - 需要实现从技能描述推断元素的功能

4. **优化空间**：预处理数据可以进一步精简
   - 当前保留所有 15 个等级的数据
   - 可以只保留等级 1 和 10，减少数据量

通过重新定位和简化，让 Skill 专注于数据预处理和辅助分析，配置生成完全由 AI 推理完成。

---

## What

完善 `genshin-data-generator` Skill，使其成为原神伤害计算器数据配置的辅助工具。

### 主要变更

1. **删除自动生成脚本**：移除 `generate_config.py` (32.6 KB)
2. **修复脚本路径**：统一路径计算方式
3. **实现元素推断**：从技能描述推断角色元素
4. **优化数据格式**：只保留等级 1/10，紧凑列表格式
5. **更新文档定位**：反映新的工作流程

---

## Success Criteria

1. ✅ 删除 `generate_config.py` 自动生成脚本
2. ✅ 修复 `export_data.py` 和 `check_unimplemented.py` 的路径问题
3. ✅ 实现角色元素推断功能（从技能描述推断）
4. ✅ 优化预处理数据格式（只保留等级 01/10，精简武器精炼等级，紧凑列表格式）
5. ✅ 更新 SKILL.md 文档反映新的工作流程
6. ⏳ 提交所有修改到 Git

## Changes Overview

| 类别 | 变更内容 | 影响 |
|------|----------|------|
| **删除** | `generate_config.py` (32.6 KB) | 简化工具，移除自动生成逻辑 |
| **修改** | `preprocess.py` | 优化数据格式（等级 01/10，紧凑列表） |
| **修改** | `export_data.py` | 修复路径计算，更新文档说明 |
| **修改** | `check_unimplemented.py` | 修复路径计算 |
| **修改** | `SKILL.md` | 重新定位，更新工作流程 |

## Related Files

```
.claude/skills/genshin-data-generator/
├── SKILL.md              # 主文档（已更新）
├── scripts/
│   ├── preprocess.py       # 数据预处理（已优化）
│   ├── export_data.py      # 数据导出（已修复路径）
│   └── check_unimplemented.py  # 检查未实现（已修复路径）
├── output/
│   ├── processed_data.json  # 预处理后的数据 (7.35 MB)
│   └── exports/             # 导出的单个数据
└── references/             # 参考文档
```

## Next Steps

提案批准后，需要：

1. **提交当前修改**：将已完成的修改提交到 Git
   - 删除 generate_config.py
   - 修改其他脚本
   - 更新 SKILL.md

2. **测试验证**：
   - 运行预处理脚本验证数据格式
   - 测试数据导出功能
   - 验证 AI 可以正确使用处理后的数据

3. **后续改进**（可选）：
   - 添加更多参考文档到 `references/` 目录
   - 为特殊配置创建示例并归档到 `archive/`
   - 根据实际使用反馈优化文档
