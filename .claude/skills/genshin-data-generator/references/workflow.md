# 原神数据配置工作流程

## 完整版本更新流程

### 第一阶段：数据准备

#### 1.1 下载/更新解包数据

确保`src/assets/genshin/`目录下有最新的解包数据文件：

- `avatar_map.json`
- `weapon_map.json`
- `reliquary_set_map.json`

#### 1.2 运行预处理脚本

```bash
cd scripts
python3 preprocess.py
```

**预处理脚本功能**：

- 读取avatar_map.json、weapon_map.json、reliquary_set_map.json
- **移除levelMap字段**（每个角色有90个等级的数据，约占用大量空间）
- 保留核心数据：skills、skillAffixMap、setAffixes
- 提取并组织关键信息：name、desc、paramList、paramDescList、paramMap
- 输出`processed_data.json`（大幅减少文件大小）

**数据保留规则**：

- **avatar_map.json**: 保留skills结构中的name、desc、paramList、paramDescList
- **weapon_map.json**: 保留skillAffixMap中的name、desc、paramList、paramValidIndexes、addProps
- **reliquary_set_map.json**: 保留setAffixes中的name、desc、paramList、paramValidIndexes、addProps
- **删除**: paramDescSplitList（仅用于前端显示）、levelMap（配置生成不需要）

---

### 第二阶段：配置生成

#### 2.1 生成单个角色配置

```bash
cd scripts
python3 generate_config.py --character 10000002
```

生成单个角色的配置，或使用`--all`生成所有角色。

#### 2.2 生成所有角色

```bash
python3 generate_config.py --all --type character
```

#### 2.3 生成武器配置

```bash
python3 generate_config.py --all --type weapon
```

#### 2.4 生成圣遗物配置

```bash
python3 generate_config.py --all --type artifact
```

生成单个角色的配置，或使用`--all`生成所有角色。

#### 2.2 生成所有角色

`bash
python3 generate_config.py --all --type character
`

#### 2.3 生成武器配置

`bash
python3 generate_config.py --all --type weapon
`

#### 2.4 生成圣遗物配置

`bash
python3 generate_config.py --all --type artifact
`

---

### 第三阶段：验证和更新

#### 3.1 验证生成的配置

检查生成的`src/assets/init/data.json`是否：

- JSON格式正确
- indexes映射准确
- 符合interface.ts定义的接口
- 使用const.ts中定义的常量

#### 3.2 检查是否需要更新其他文件

参见[更新检查清单](references/update-checklist.md)判断是否需要修改interface.ts、const.ts、calculator.service.ts

#### 3.3 提交代码

```bash
git add src/assets/init/data.json
git commit -m "update data.json for version X.Y.Z"
```

---

## 常见更新场景

### 场景1：新增角色

**步骤**：

1. ✅ 预处理数据（包含新角色）
2. ✅ 生成新角色配置：`--character 1000XXXX`
3. 📋 检查是否有新机制：
   - 新标签？→在const.ts添加`PROP_TAG_*`
   - 新反应？→在calculator.service.ts添加计算逻辑
   - 新计算乘区？→在const.ts添加`PROP_DMG_RATE_MULTI_*`
4. 如果需要，更新相关文件
5. 验证并提交

### 场景2：角色技能调整

**步骤**：

1. 重新生成该角色配置
2. 对比旧配置，查看变化
3. 根据desc描述调整特殊配置
4. 验证

### 场景3：新增武器/圣遗物

**步骤**：

1. 生成对应配置
2. 验证paramValidIndexes
3. 确认addProps映射正确

### 场景4：新增机制/新反应

**步骤**：

1. 生成基础配置
2. 参考[游戏机制参考](references/game-mechanics.md)
3. 在calculator.service.ts实现新计算逻辑
4. 在const.ts添加新常量
5. 验证并提交

---

## 辅助决策

### 何时需要修改const.ts？

- 新角色有独特技能标签
- 新增元素反应类型
- 新增伤害倍率属性（如元素伤害加成）

### 何时需要修改interface.ts？

- 新增特殊数据结构（如新类型的buff）
- 修改现有接口以支持新机制

### 何时需要修改calculator.service.ts？

- 新增元素反应计算
- 新增特殊伤害计算逻辑
- 修改现有计算公式

---

## 技巧和最佳实践

### 1. desc分析技巧

**关键词映射**：
| desc关键词 | 映射到 |
|-----------|--------|
| "攻击力的30%" | customValue: 0.3 |
| "第1段" | indexes[0] |
| "重击伤害" | attackBonusType: "DMG_BONUS_CHARGED" |
| "普通攻击" | attackBonusType: "DMG_BONUS_NORMAL" |
| "造成X%的冰元素伤害" | elementBonusType: "DMG_BONUS_CRYO", customValue: X |
| "攻击力的X%" | target: ["ATTACK_UP"], customValue: X/100 |

### 2. paramList使用规则

**索引对应**：

- paramList[0]: 通常对应indexes[0]
- paramList[1]: 通常对应indexes[1]
- 对于多段技能，paramList可能包含多个连续索引

### 3. 特殊情况处理

**需要手动检查的场景**：

- 技能有多层嵌套效果
- buff有复杂条件（如"基于队友元素类型"）
- constellation的衍生伤害
- 特殊机制（如芙宁娜的Salon Solitaire）

---

## 测试和问题排查

### 配置未生效

1. 检查indexes是否正确映射到paramList
2. 检查base属性是否正确（ATTACK/HP/DEFENSE）
3. 检查elementBonusType和attackBonusType是否匹配

### JSON格式错误

1. 运行`python3 -m json.tool src/assets/init/data.json`验证格式
2. 检查是否有缺少的逗号或引号

### 性能问题

如果解包数据文件太大导致上下文不足：

1. 桮保运行过预处理脚本
2. 检查processed_data.json大小（应该比原始数据小很多）

---

## 回滚和紧急修复

### 如果配置有问题

1. 重新生成问题配置：`python3 generate_config.py --character <ID>`
2. 手动调整生成的JSON
3. 验证修复

### 如果代码有问题

1. 回滚到上一个稳定提交：`git reset --hard HEAD~1`
2. 重新分析问题
3. 重新修改

---

## 版本标记

在提交时建议使用规范的commit message格式：

```
update data.json for version X.Y.Z

- Add character: <角色名>
- Add weapon: <武器名>
- Add artifact: <圣遗物名>
- Update constants: <新常量>
- Fix calculation: <修复的计算>
```
