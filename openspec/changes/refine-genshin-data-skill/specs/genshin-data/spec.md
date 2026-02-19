# genshin-data Spec Delta

## Purpose

完善 genshin-data-generator Skill，将其从"配置生成工具"重新定位为"数据预处理和 AI 分析辅助工具"。

---

## MODIFIED Requirements

### Requirement: genshin-data-generator Skill 定位和功能

genshin-data-generator Skill SHALL 作为原神伤害计算器数据配置的辅助工具，负责从游戏解包数据中预处理精简数据，提供数据导出和检查工具，支持 AI 分析和生成 data.json 配置。

#### Scenario: Skill 核心工作流程
- **WHEN** 用户使用 genshin-data-generator Skill 进行数据配置时
- **THEN** SHALL 按照以下流程执行：
  1. **预处理**：运行 `preprocess.py` 将原始解包数据（25MB+）精简为核心数据（7MB）
  2. **AI 分析**：AI 根据精简数据、游戏规则和代码逻辑进行推理
  3. **配置生成**：AI 生成符合 interface.ts 和 const.ts 规范的配置

#### Scenario: 预处理数据输出
- **WHEN** 运行预处理脚本时
- **THEN** SHALL 生成 `processed_data.json` 文件
- **AND** 文件大小 SHALL 约为 7.35 MB（相比原始数据压缩约 70%）
- **AND** SHALL 包含所有四种语言（cn_sim, cn_tra, en, jp）
- **AND** paramMap SHALL 只包含等级 01 和 10

#### Scenario: 数据导出供 AI 分析
- **WHEN** 用户需要分析特定角色/武器/圣遗物数据时
- **THEN** 用户 CAN 使用 `export_data.py` 导出单个数据项
- **AND** 导出的数据 SHALL 包含完整的技能描述和参数列表
- **AND** AI 可以使用这些数据进行分析和推理

---

### Requirement: 预处理脚本优化

预处理脚本 SHALL 优化数据格式，只保留必要的信息，减少文件大小。

#### Scenario: paramMap 等级精简
- **WHEN** 处理技能的 paramMap 时
- **THEN** SHALL 只保留等级 01 和 10 的数据
- **AND** SHALL 移除其他等级的数据（02-09, 11-15）

#### Scenario: 武器精炼等级精简
- **WHEN** 处理武器的 skillAffixMap 时
- **THEN** SHALL 只保留精炼 1 阶（键 '1'）和 5 阶（键 '5'）
- **AND** SHALL 移除精炼 2-4 阶的数据

#### Scenario: 紧凑列表格式
- **WHEN** 输出 JSON 数据时
- **THEN** 数组值 SHALL 显示在一行（不换行）
- **AND** SHALL 保持 JSON 格式的可读性

---

### Requirement: 角色元素推断

由于原始数据中的 tags 字段无效（全部为 ['None']），系统 SHALL 从技能描述中推断角色元素。

#### Scenario: 从技能描述推断元素
- **WHEN** 需要确定角色元素时
- **THEN** 系统 SHALL 分析 skill 或 elementalBurst 的 desc 字段
- **AND** SHALL 查找元素关键词（火元素、水元素、风元素、雷元素、冰元素、岩元素、草元素）
- **AND** SHALL 根据关键词推断对应的元素类型

#### Scenario: 元素推断示例
- **GIVEN** 角色技能描述包含"冰元素伤害"或"冰元素范围伤害"
- **WHEN** 执行元素推断时
- **THEN** 系统 SHALL 推断该角色为冰元素（CRYO）

---

### Requirement: 脚本路径计算一致性

所有脚本 SHALL 使用统一的方式计算项目根目录路径。

#### Scenario: 项目根目录查找
- **WHEN** 脚本需要定位项目根目录时
- **THEN** SHALL 从脚本位置开始向上查找包含 `src` 目录的父目录
- **AND** SHALL 避免使用固定的父目录层级（如 parent.parent.parent）

#### Scenario: 路径验证
- **WHEN** 脚本执行时
- **THEN** PROCESSED_FILE 路径 SHALL 正确指向 `project_root/.claude/skills/genshin-data-generator/output/processed_data.json`
- **AND** DATA_FILE 路径 SHALL 正确指向 `project_root/src/assets/init/data.json`

---

## REMOVED Requirements

### Requirement: 自动配置生成

**REMOVED**: 不再提供自动生成配置的功能。

#### Scenario: 配置生成方式变更
- **WHEN** 用户需要生成角色配置时
- **THEN** SHALL 使用 AI 分析导出的数据
- **AND** SHALL NOT 使用 generate_config.py 自动生成（该脚本已删除）
- **AND** AI SHALL 根据 paramDescList、desc 和代码规范进行推理生成配置

#### Rationale
- 自动生成逻辑无法处理复杂的游戏机制和特殊情况
- AI 推理可以提供更准确的配置
- 简化工具，避免维护复杂的自动判断逻辑
