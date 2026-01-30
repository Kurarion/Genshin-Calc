---
name: genshin-data-generator
description: 原神角色伤害计算器数据配置辅助工具。从游戏解包数据预处理精简数据，提供数据导出和检查工具，支持AI分析和生成data.json配置。
---

# 原神数据配置辅助工具

## ⚠️ 核心理念

**这个工具不会自动生成配置**。配置生成需要 AI 根据预处理后的数据进行推理、分析和判断。

**工作流程**：
1. **预处理**：将原始解包数据（25MB+）精简为核心数据（7MB）
2. **AI 分析**：AI 根据精简数据、游戏规则和代码逻辑进行推理
3. **配置生成**：AI 生成符合 interface.ts 和 const.ts 规范的配置

## ⚠️ 重要规则

**永远不要直接读取 `src/assets/genshin` 以下的内容！**

这些解包数据文件（avatar_map.json 12MB, weapon_map.json 13MB等）体积巨大，直接读取会：
- 占用大量上下文
- 导致处理缓慢
- 可能超出token限制

**正确做法**：使用 `scripts/preprocess.py` 预处理后，只读取 `processed_data.json`。

## 文件管理结构

```
.claude/skills/genshin-data-generator/
├── output/              # 临时生成的文件（Git忽略）
│   ├── processed_data.json      # 预处理后的数据
│   └── exports/                # 导出的单个角色/武器/圣遗物数据
├── archive/             # 版本归档（可选Git管理）
│   └── v4.x.x/          # 按版本归档的重要中间结果
├── scripts/             # 脚本文件（Git管理）
├── references/          # 参考文档（Git管理）
└── SKILL.md             # 主文档（Git管理）
```

### 目录说明

- **output/**: 临时文件，每次运行后可以删除，不进入Git
- **archive/**: 重要版本的特殊配置示例，可选择性提交到Git
- **scripts/**: 核心脚本，必须Git管理
- **references/**: 参考文档，必须Git管理

### 归档策略

当遇到特殊情况（如新机制、特殊标签、复杂buff）时：

1. 在 `archive/vX.Y.Z/` 创建版本文件夹
2. 保存特殊配置示例
3. 添加README说明特殊处理方法
4. 可选提交到Git作为后续参考

## 快速开始

使用此 Skill 进行版本更新时，按以下流程操作：

### 1. 数据预处理（首次或大版本更新）

```bash
cd .claude/skills/genshin-data-generator/scripts
python3 preprocess.py
```

这将从解包数据中提取核心信息，去除levelmap等无用数据，生成`output/processed_data.json`。

**输出示例**：

```
开始预处理数据...
  输入目录: ./src/assets/genshin
  输出文件: ./.claude/skills/genshin-data-generator/output/processed_data.json
  处理角色数据...
  处理武器数据...
  处理圣遗物数据...

预处理完成！
原始avatar_map.json: 12.25 MB
原始weapon_map.json: 13.00 MB
输出processed_data.json: 7.35 MB
压缩率: 70.90%
```

### 2. 导出特定数据供 AI 分析

**导出角色数据**：

```bash
cd .claude/skills/genshin-data-generator/scripts
python3 export_data.py --type character --id 10000002
```

**导出武器数据**：

```bash
python3 export_data.py --type weapon --id 11301
```

**导出圣遗物数据**：

```bash
python3 export_data.py --type artifact --id 301
```

数据将导出到 `output/exports/` 目录，方便 AI 参考和分析。

### 3. 检查未实现数据

了解哪些数据尚未实现：

```bash
python3 check_unimplemented.py --type all
```

**输出示例**：

```
============================================================
角色实现情况
============================================================

解包数据中的角色总数: 95
data.json中已实现的角色数: 85
未实现的角色数: 10

未实现的角色 (10):
------------------------------------------------------------
  [10000080] 赛诺 (武器: WEAPON_POLE, 品质: QUALITY_ORANGE)
  [10000081] 坎蒂丝 (武器: WEAPON_POLE, 品质: QUALITY_PURPLE)
  ...

未实现角色列表已导出到: output/unimplemented_characters.txt
```

### 4. AI 配置生成

AI 需要结合以下信息进行推理和配置生成：

1. **processed_data.json**：预处理后的游戏数据
2. **interface.ts**：配置文件的数据结构和类型接口
3. **const.ts**：伤害计算的核心常量和枚举
4. **calculator.service.ts**：伤害计算逻辑（参考）
5. **本 SKILL.md**：配置生成指南和规则

**AI 分析步骤**：

1. 使用 `export_data.py` 导出目标角色的数据
2. 分析 `paramDescList` 判断 `indexes` 映射
3. 分析 `desc` 判断特殊机制（buff、治疗、护盾等）
4. 根据武器类型和技能类型判断 `elementBonusType` 和 `attackBonusType`
5. 生成符合规范的配置 JSON

## 数据源说明

### 核心解包文件

- **avatar_map.json** (12MB): 角色数据

  - `name`: 角色名称（多语言）
  - `desc`: 角色描述（多语言）
  - `skills.normal`: 普通攻击配置
  - `skills.skill`: 元素技能
  - `skills.elementalBurst`: 元素爆发
  - `skills.proudSkills`: 天赋/突破
  - `skills.constellation`: 命座
  - 关键字段：`name`, `desc`, `paramList`, `paramDescList`

- **weapon_map.json** (13MB): 武器数据

  - `name`: 武器名称（多语言）
  - `desc`: 武器描述（多语言）
  - `skillAffixMap`: 武器精炼效果
  - 关键字段：`name`, `desc`, `paramList`, `paramValidIndexes`, `addProps`

- **reliquary_set_map.json** (92KB): 圣遗物套装数据
  - `setName`: 套装名称（多语言）
  - `setAffixs`: 套装效果（2件套、4件套）
  - 关键字段：`setName`, `name`, `desc`, `paramList`, `paramValidIndexes`, `addProps`

**重要**：各个技能/天赋/命座/武器特效/圣遗物套装的`desc`字段(多语言)包含完整的技能描述，也可能包括其它技能之间的联动信息。例如，某些命座效果会基于其他技能的参数，需要仔细阅读desc理解联动关系。
**重要**: 各个paramList中包含了各自技能等的param参数list，paramDescList中包含的的paramX即对应着paramlist中X-1的Index，paramValidIndexes只是单纯用于判断paramList中对应Index的有效与无效（非0即有效），实际分析时用处不是很大
**重要**: 各个addProps中包含了各自技能等的增益Key-Value，有一部分的相关BUFF是通过addProps而非paramList来定义的，这种情况下也需要通过desc来分析这个数值是加成什么的，即使propType有定义类似的东西，但目前没有将propType中Key与计算使用的Key进行映射。因此推理过程是类似的，但实际写data.json时是有区别的。
**重要**: levelmap字段在每个角色与武器中有各个等级的数据，这些数据在配置生成时完全无用，预处理时会移除以节省上下文。

## 相关文件说明

版本更新时需要修改的主要文件：

### 1. interface.ts (`src/app/shared/interface/interface.ts`)

**作用**：定义配置文件的数据结构和类型接口

**主要内容**：

- `ExtraData`: 顶层配置接口（characters, weapons, artifact）
- `ExtraSkillInfo`: 技能信息接口（damage, buffs, healing, shield, product）
- `ExtraSkillDamage`: 伤害配置接口（indexes, base, elementBonusType, attackBonusType...） **data.json配置的核心接口**
- `ExtraSkillBuff`: Buff配置接口（index, base, target, customValue, settingType...） **data.json配置的核心接口**
- `ExtraSkillHealing`: 治疗配置接口（index, base, constIndex, healingBonusType...） **data.json配置的核心接口**
- `ExtraSkillShield`: 盾量配置接口（index, constIndex, base, shieldBonusType, shieldElementType...） **data.json配置的核心接口**
- `ExtraSkillProduct`: 生成物配置接口（index, base...） **data.json配置的核心接口**

**版本更新场景**：

- 新增特殊机制（如新的技能类型）
- 添加新的Buff类型
- 扩展现有接口

### 2. const.ts (`src/app/shared/const/const.ts`)

**作用**：定义所有常量和枚举，是伤害计算的核心配置文件

**重要**：PROP_DMG_开头的常量是伤害计算的核心，涉及新反应、新伤害乘区、所有伤害、盾、治疗、生成物HP计算！

#### 核心概念：计算乘区

伤害计算分为6个区域（乘区），按顺序相乘：

```javascript
最终伤害 = 基础伤害 × 倍率区 × 元素加成区 × 反应倍率 × 抗性区 × 防御区 × 会心区
```

**各乘区说明**：

1. **倍率区（ダメージ値区域）**：伤害倍率
2. **会心区**：会心率和会心伤害
3. **伤害提升区（ダメージアップ区域）**：伤害加成百分比
4. **抗性区（耐性区域）**：敌人抗性修正
5. **防御区（防御区域）**：防御力修正
6. **元素反应区（元素反応区域）**：元素反应倍率

#### 常量分类

##### 1. 元素类型常量（ELEMENT_*）

- `ELEMENT_PYRO`: 火元素
- `ELEMENT_HYDRO`: 水元素
- `ELEMENT_ANEMO`: 风元素
- `ELEMENT_ELECTRO`: 雷元素
- `ELEMENT_CRYO`: 冰元素
- `ELEMENT_GEO`: 岩元素
- `ELEMENT_DENDRO`: 草元素
- `ELEMENT_PHYSICAL`: 物理元素

以上常量不用于对伤害进行定义元素类型

##### 2. 伤害加成常量（PROP_DMG_BONUS*）

**元素伤害加成**：

- `PROP_DMG_BONUS_CRYO`: 冰元素伤害加成
- `PROP_DMG_BONUS_PYRO`: 火元素伤害加成
- `PROP_DMG_BONUS_HYDRO`: 水元素伤害加成
- `PROP_DMG_BONUS_ELECTRO`: 雷元素伤害加成
- `PROP_DMG_BONUS_ANEMO`: 风元素伤害加成
- `PROP_DMG_BONUS_GEO`: 岩元素伤害加成
- `PROP_DMG_BONUS_DENDRO`: 草元素伤害加成
- `PROP_DMG_BONUS_PHYSICAL`: 物理伤害加成

以上也用于对伤害进行定义元素类型

**技能类型伤害加成**：

- `PROP_DMG_BONUS_NORMAL`: 普通攻击伤害加成
- `PROP_DMG_BONUS_CHARGED`: 重击伤害加成
- `PROP_DMG_BONUS_PLUNGING`: 下落攻击伤害加成
- `PROP_DMG_BONUS_SKILL`: 元素技能伤害加成
- `PROP_DMG_BONUS_ELEMENTAL_BURST`: 元素爆发伤害加成

**其他类型**：

- `PROP_DMG_BONUS_ALL`: 全伤害加成
- `PROP_DMG_BONUS_WEAPON`: 武器伤害加成
- `PROP_DMG_BONUS_OTHER`: 其他伤害加成（天赋效果等）
- `PROP_DMG_BONUS_SET`: 圣遗物套装伤害加成

##### 3. 伤害倍率常量（PROP_DMG_RATE*）

**倍率提升（加法）**：

- `PROP_DMG_RATE_UP_*`: 某类技能伤害倍率提升X%

**倍率倍乘（乘法）**：

- `PROP_DMG_RATE_MULTI_*`: 某类技能伤害倍率×X

**元素类型**：CRYO, PYRO, HYDRO, ELECTRO, ANEMO, GEO, DENDRO, PHYSICAL, ALL
**技能类型**：NORMAL, CHARGED, PLUNGING, SKILL, ELEMENTAL_BURST, WEAPON, OTHER, SET

**特殊倍率**：

- `PROP_DMG_RATE_MULTI_MOON_ELECTROCHARGED`: 月感电倍率
- `PROP_DMG_RATE_MULTI_MOON_RUPTURE`: 月绽放倍率
- `PROP_DMG_BASICS_MULTI_MOON_RUPTURE`: 月绽放基础倍率

##### 4. 伤害抗性常量（PROP_DMG_ANTI*）

**抗性提升**：

- `PROP_DMG_ANTI_CRYO`: 冰元素抗性提升
- `PROP_DMG_ANTI_*`: 各元素抗性提升

**抗性降低（针对怪物）**：

- `PROP_DMG_ANTI_CRYO_MINUS`: 冰元素抗性降低
- `PROP_DMG_ANTI_*_MINUS`: 各元素抗性降低
- `PROP_DMG_ANTI_ALL_MINUS`: 全元素抗性降低

**用途**：用于超导反应（减物理抗性）或者各种角色技能，天赋，命座中的效果来降低敌人抗性

##### 5. 伤害数值常量（PROP_DMG_VAL_UP*）

直接提升伤害计算中的基础区数值（不是百分比）：

- `PROP_DMG_VAL_UP_*`: 某类技能伤害数值提升

##### 6. 会心相关常量（PROP_DMG_CRIT*）

**会心伤害提升**：

- `PROP_DMG_CRIT_DMG_UP_*`: 某类技能会心伤害提升

**会心独立区**：

- `PROP_DMG_CRIT_RATE_UP_*`: 某类技能会心率提升

##### 7. 治疗加成常量（PROP_HEALING*）

**治疗加成类型**：

- `PROP_HEALING_BONUS`: 基础治疗加成（针对所有类型治疗）
- `PROP_HEALING_BONUS_NORMAL`: 普通攻击治疗加成
- `PROP_HEALING_BONUS_SKILL`: 元素技能治疗加成
- `PROP_HEALING_BONUS_ELEMENTAL_BURST`: 元素爆发治疗加成
- `PROP_HEALING_BONUS_WEAPON`: 武器治疗加成
- `PROP_HEALING_BONUS_OTHER`: 其他治疗加成
- `PROP_HEALING_BONUS_SET`: 圣遗物套装治疗加成

**治疗倍率**：

- `PROP_HEALING_RATE_UP_*`: 某类技能治疗倍率提升X%
- `PROP_HEALING_RATE_MULTI_*`: 某类技能治疗倍率×X

**治疗数值**：

- `PROP_HEALING_VAL_UP_*`: 某类技能治疗基础区数值直接提升

##### 8. 护盾加成常量（PROP_SHIELD*）

**护盾加成类型**：

- `PROP_DMG_ELEMENT_SHIELD_UP`: 护盾强效加成（针对所有类型护盾）
- `PROP_SHIELD_BONUS_NORMAL`: 普通攻击创造的护盾强效加成
- `PROP_SHIELD_BONUS_SKILL`: 元素技能创造的护盾强效加成
- `PROP_SHIELD_BONUS_ELEMENTAL_BURST`: 元素爆发创造的护盾强效加成
- `PROP_SHIELD_BONUS_WEAPON`: 武器创造的护盾强效加成
- `PROP_SHIELD_BONUS_OTHER`: 其他护盾强效加成
- `PROP_SHIELD_BONUS_SET`: 圣遗物套装创造的护盾强效加成

##### 9. 特殊标签常量（PROP*TAG*）

用于区分技能内部不同类型的伤害：

- `PROP_TAG_RAZOR_SOUL_COMPANION`: 雷泽的狼魂伤害
- `PROP_TAG_VENTI_SKILL_PRESS`: 温迪的蓄力长按伤害
- `PROP_TAG_FURINA_SALON_SOLITAIRE`: 芙宁娜的沙龙独舞伤害
- 等等...

**重要**：特殊标签系统用于区分技能内部多种不同类型的伤害，不是特殊机制！，主要用于实现对同技能内不同伤害进行追加该伤害专用的BUFF使用

##### 10. 基础属性常量

**基础属性**：

- `PROP_HP_BASE`: 生命值基础（被生命加成百分比增益）
- `PROP_HP_BASE_EXTRA`: 生命值基础（基础额外加成，被生命加成百分比增益）
- `PROP_ATTACK_BASE`: 攻击力基础（被攻击力加成百分比增益）（部分buff计算使用）
- `ATTACK_BASE_EXTRA`: 攻击力基础（基础额外加成，被攻击力加成百分比增益）（部分buff计算使用）
- `PROP_DEFENSE_BASE`: 防御力基础（被防御力加成百分比增益）
- `DEFENSE_BASE_EXTRA`: 防御力基础（基础额外加成，被防御力加成百分比增益）

**属性提升**：

- `PROP_HP_UP`: 生命值提升（不被生命加成百分比增益，直接加算）
- `PROP_ATTACK_UP`: 攻击力提升（不被攻击力加成百分比增益，直接加算）
- `PROP_DEFENSE_UP`: 防御力提升（不被防御力加成百分比增益，直接加算）
- `PROP_ELEMENT_MASTERY_UP`: 元素精通提升
- `PROP_CRIT_RATE`: 会心率
- `PROP_CRIT_DMG`: 会心伤害
- `PROP_ENERGY_RECHARGE`: 元素充能效率

**合计用属性**：

- `PROP_HP`: 最终面板生命值（一般用于最终伤害、buff等计算）
- `PROP_ATTACK`: 最终面板攻击力（一般用于最终伤害、buff等计算）
- `PROP_DEFENSE`: 最终面板防御力（一般用于最终伤害、buff等计算）
- `PROP_LEVEL`: 等级
- `PROP_ELEMENTAL_MASTERY`: 元素精通

##### 11. 生成物相关（ExtraSkillProduct）

**重要**：生成物计算只计算HP，不涉及任何伤害计算！

生成物HP计算公式：

```javascript
product = base * rate + Σ(rateAttach[i] * data[baseAttach[i]]) + extra
```

**base参数**：

- `HP`: 生命值基础
- `ATTACK`: 攻击力基础
- `DEFENSE`: 防御力基础

**配置示例**：

```javascript
{
  "product": {
    "index": 0,
    "base": "HP"
  }
}
```

##### 12. 变量常量（PORP_VAR*）

用于计算队列中的变量：

- `PROP_VAR_CHARA_1` ~ `PROP_VAR_CHARA_8`: 角色变量1-8
- `PROP_VAR_SET_1`, `PROP_VAR_SET_2`: 套装变量1-2
- `PROP_VAR_WEAPON_1`, `PROP_VAR_WEAPON_2`: 武器变量1-2

**用途**：用于复杂的计算队列（finalResCalQueue），例如：

- 某些复杂的Buff的效果，可能需要基于一定的计算
- 某些技能的伤害基于其他技能中的值，比如：叠加层数，需要先定义变量，并在影响技能内使用这个变量进行计算
- 某些效果需要中间变量计算

##### 13. 伤害计算参考（两大组选择）

**第一组：根据elementBonusType选择（元素类型）**

- `PROP_DMG_RATE_UP_CRYO/...`: 元素倍率提升
- `PROP_DMG_RATE_MULTI_CRYO/...`: 元素倍率倍乘
- `PROP_DMG_BONUS_PYRO/...`: 火元素伤害加成
- `PROP_DMG_VAL_UP_CRYO/...`: 火元素伤害数值提升
- `PROP_DMG_ANTI_CRYO/...`: 火元素抗性
- `PROP_DMG_ANTI_CRYO_MINUS/...`: 火元素抗性降低
- `PROP_DMG_CRIT_RATE_UP_CRYO/...`: 火元素会心率提升
- `PROP_DMG_CRIT_DMG_UP_CRYO/...`: 火元素会心伤害提升

**第二组：根据attackBonusType选择（攻击类型）**

- `PROP_DMG_RATE_UP_NORMAL/...`: 普通攻击倍率提升
- `PROP_DMG_RATE_MULTI_NORMAL/...`: 普通攻击倍率倍乘
- `PROP_DMG_BONUS_NORMAL/...`: 普通攻击伤害加成
- `PROP_DMG_VAL_UP_NORMAL/...`: 普通攻击伤害数值提升
- `PROP_DMG_CRIT_RATE_UP_NORMAL/...`: 普通攻击会心率提升
- `PROP_DMG_CRIT_DMG_UP_NORMAL/...`: 普通攻击会心伤害提升
- **特殊**：一些特殊的技能TAG如果存在，则需要额外加成对应TAG的Buff

**重要**：一个伤害总是同时具备两个分类（元素类型和攻击类型（又包含了TAG）），两组常量互不冲突！

**全局常量（除了特殊反应伤害之外，对象为任意伤害）**：

- `PROP_DMG_RATE_UP_ALL`: 全局倍率提升
- `PROP_DMG_RATE_MULTI_ALL`: 全局倍率倍乘
- `PROP_DMG_BONUS_ALL`: 全伤害加成
- `PROP_DMG_VAL_UP_ALL`: 全局伤害数值提升
- `PROP_DMG_CRIT_RATE_UP_ALL`: 全局会心率提升
- `PROP_DMG_CRIT_DMG_UP_ALL`: 全局会心伤害提升

#### 版本更新场景

1. **新元素反应（基本不会追加，因此追加时需要慎重判断）**：

   - 在calculator.service.ts实现新反应的计算逻辑，同时需要对interface.ts中的类型进行更新
   - 在i18n文件中添加翻译

2. **新伤害乘区（基本不会追加，因此追加时需要慎重判断）**：

   - 根据需要，添加新的伤害加成区间常量（比如：`PROP_DMG_RATE_UP_*` / `PROP_DMG_RATE_MULTI_*`）
   - 在calculator.service.ts实现新追加乘区的计算逻辑

3. **新特殊标签（追加频率较高）**：

   - 根据需要，添加新标签常量（`PROP_TAG_*`）
   - 用于区分技能内部不同类型的伤害

4. **新武器类型**：

   - 不存在武器类型追加与更新

#### 使用示例

> **示例格式说明**
> - **源数据**: 来自 processed_data.json 的原始游戏数据
> - **推断过程**: 从源数据分析并生成配置的步骤
> - **最终配置**: 生成的 data.json 配置

---

### 1. 伤害配置示例

#### 示例1.1: 基础物理普通攻击（神里绫华）

**角色**: 神里绫华 (10000002) - 神里流·倾

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "一段伤害|{param1:F1P}",           // param1 = 0.457253 (等级1)
  "二段伤害|{param2:F1P}",           // param2 = 0.486846
  "三段伤害|{param3:F1P}",           // param3 = 0.626218
  "四段伤害|{param4:F1P}*3",         // param4 = 0.226464 (3次)
  "五段伤害|{param7:F1P}",           // param7 = 0
  "重击伤害|{param8:F1P}*3",         // param8 = 0.781817 (3次)
  ...
]

// paramMap["01"] (等级1的参数值)
[0.457253, 0.486846, 0.626218, 0.226464, 0, 0, 0.781817, ...]
```

**推断过程**:
1. **提取 indexes**:
   - `param1` → `index = 1-1 = 0` (数组从0开始)
   - `param2` → `index = 1`
   - `param3` → `index = 2`
   - `param4` → `index = 3`
   - 跳过 param5, param6 (不存在)
   - `param7` → `index = 6`
   - 结果: `indexes = [0, 1, 2, 3, 6]`

2. **判断 base**: 描述中无特殊说明 → `base = "ATTACK"`

3. **判断 canOverride**:
   - 技能类型: normal (普通攻击)
   - 武器类型: WEAPON_SWORD_ONE_HAND (非法器)
   - 结果: `canOverride = true`

4. **判断 elementBonusType**:
   - 普通攻击，非法器角色
   - 结果: `elementBonusType = "DMG_BONUS_PHYSICAL"`

5. **判断 attackBonusType**:
   - 技能类型: normal
   - 结果: `attackBonusType = "DMG_BONUS_NORMAL"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [0, 1, 2, 3, 6],
    "base": "ATTACK",
    "canOverride": true,
    "elementBonusType": "DMG_BONUS_PHYSICAL",
    "attackBonusType": "DMG_BONUS_NORMAL"
  }
}
```

---

#### 示例1.2: 法器角色普通攻击 - 元素伤害

**角色**: 可莉 (假设) - 普通攻击

**源数据**:
```javascript
// paramDescList
[
  "一段伤害|{param1:F1P}",  // 火元素伤害
  "二段伤害|{param2:F1P}",
  ...
]

// 武器类型: WEAPON_HEXENZIRKEL (法器)
```

**推断过程**:
1. **提取 indexes**: `param1` → `index = 0`

2. **判断 base**: `base = "ATTACK"`

3. **判断 canOverride**:
   - 技能类型: normal
   - 武器类型: 法器
   - 结果: `canOverride = false` (法器不可覆盖)

4. **判断 elementBonusType**:
   - 法器角色普通攻击使用角色元素
   - 火元素角色 → `elementBonusType = "DMG_BONUS_PYRO"`

5. **判断 attackBonusType**: `attackBonusType = "DMG_BONUS_NORMAL"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [0],
    "base": "ATTACK",
    "canOverride": false,  // 法器普通攻击不可覆盖
    "elementBonusType": "DMG_BONUS_PYRO",  // 使用角色元素
    "attackBonusType": "DMG_BONUS_NORMAL"
  }
}
```

---

#### 示例1.3: 参考技能配置 - 雷泽狼魂伤害

**角色**: 雷泽 (10000020) - 雷牙（元素爆发）

**源数据**:
```javascript
// elementalBurst 的 paramDescList
[
  "爆发伤害|{param1:P}",
  "狼魂伤害|{param2:F1P}普通攻击伤害",  // 关键！参考普通攻击
  "普通攻击速度提升|{param3:P}",
  ...
]

// normal 的 paramDescList
[
  "一段伤害|{param1:F1P}",  // 被引用的参数
  ...
]
```

**推断过程**:
1. **识别参考技能**:
   - 描述: "狼魂伤害|{param2:F1P}**普通攻击伤害**"
   - "普通攻击伤害" → 参考 `normal` 技能

2. **提取当前技能的 indexes**:
   - `param2` → `indexes = [1]`

3. **提取 originIndexes**:
   - normal 的 `param1` → `originIndexes = [0]`

4. **确定 originRelations**:
   - 描述格式: "X%普通攻击伤害" → 乘法关系
   - 结果: `originRelations = ["*"]`

5. **判断其他字段**:
   - 技能类型: elementalBurst
   - 元素: 雷 → `elementBonusType = "DMG_BONUS_ELECTRO"`
   - 攻击类型: 参考了normal，因此即使是元素爆发，攻击类型为普通攻击 → `attackBonusType = "DMG_BONUS_NORMAL"`
   - 特殊机制: 狼魂 → `tag = "RAZOR_SOUL_COMPANION"`

**最终配置**:
```javascript
{
  "damage": {
    "originSkills": ["normal"],        // 参考普通攻击
    "originIndexes": [0],              // normal的param[0]（一段伤害）
    "originRelations": ["*"],          // 乘法关系
    "indexes": [1],                    // 当前技能的param[1]
    "base": "ATTACK",
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_ELECTRO",
    "attackBonusType": "DMG_BONUS_NORMAL",
    "tag": "RAZOR_SOUL_COMPANION"      // 狼魂专属标签
  }
}
```

**计算公式**:
```
狼魂伤害 = normal[0] × param[1] × 攻击力
         = (一段伤害倍率) × (狼魂倍率) × 攻击力
```

---

#### 示例1.4: 复合倍率伤害 - 纳西妲

**角色**: 纳西妲 - 元素战技

**源数据**:
```javascript
// paramDescList
[
  "灭净三业伤害|{param3:F1P}攻击力+{param4:F1P}元素精通",
  ...
]
```

**推断过程**:
1. **提取主要倍率**:
   - `param3攻击力` → `indexes = [2]`, `base = "ATTACK"`

2. **提取额外倍率**:
   - `+ param4元素精通` → `indexesAttach = [[3]]`, `baseAttach = ["ELEMENTAL_MASTERY"]`

3. **其他字段**:
   - 元素: 草 → `elementBonusType = "DMG_BONUS_DENDRO"`
   - 技能类型: skill → `attackBonusType = "DMG_BONUS_SKILL"`
   - 特殊机制（因为在其他天赋中有描述只针对灭净三业伤害的增益，为了防止影响元素技能中不为灭净三业而追加此特殊Tag）: 蕴灭净三业 → `tag = "NAHIDA_TRI_KARMA"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [2],                    // 主要倍率: param[2] × 攻击力
    "indexesAttach": [[3]],            // 额外倍率: param[3] × 元素精通
    "base": "ATTACK",
    "baseAttach": ["ELEMENTAL_MASTERY"],
    "elementBonusType": "DMG_BONUS_DENDRO",
    "attackBonusType": "DMG_BONUS_SKILL",
    "tag": "NAHIDA_TRI_KARMA"
  }
}
```

**计算公式**:
```
伤害 = (param[2] × 攻击力) + (param[3] × 元素精通)
```

---

#### 示例1.5: 显示控制队列 - 闲云

**角色**: 闲云 - 风元素转化普通攻击

**源数据**:
```javascript
// paramDescList
[
  ...
  "普通攻击风化伤害|{param12:F1P}普通攻击伤害",
  ...
]

// desc: "...施放天风工坊后，普通攻击将被风元素附魔..."
```

**推断过程**:
1. **识别参考技能**: `param12普通攻击伤害` → `originSkills = ["normal"]`

2. **提取参数**: `param12` → `indexes = [11]`

3. **特殊机制**: 只有在风附魔激活时才显示此伤害
   - 使用 `displayCalQueue` 控制显示
   - `VAR_CHARA_2` 表示风附魔状态

**最终配置**:
```javascript
{
  "damage": {
    "originSkills": ["normal"],
    "originIndexes": [0],
    "originRelations": ["*"],
    "indexes": [11],                   // param[12]
    "base": "ATTACK",
    "canOverride": false,
    "displayCalQueue": [               // 只有风附魔激活时才显示
      {
        "relation": "+",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_2"   // 风附魔状态变量
          }
        ]
      }
    ],
    "elementBonusType": "DMG_BONUS_ANEMO",
    "attackBonusType": "DMG_BONUS_NORMAL"
  }
}
```

**显示逻辑**:
```
显示与否: (0 + VAR_CHARA_2) != 0
如果 VAR_CHARA_2 > 0 (风附魔激活)，则显示此伤害
否则不显示
```

---

#### 示例1.6: 最终计算队列 - 阿贝多生灭之花

**角色**: 阿贝多 (10000038) - 元素爆发

**源数据**:
```javascript
// paramDescList
[
  "爆发伤害|{param1:P}",
  "生灭之花伤害|每朵{param2:F1P}",
  "冷却时间|{param3:F1}秒",
  "元素能量|{param4:I}"
]

// desc: "场上存在阿贝多自己创造的阳华时，会在阳华的领域内生成7朵生灭之花..."
// paramMap["01"] = [3.672, 0.72, 12, 40, ...]
```

**推断过程**:
1. **提取基础参数**: `生灭之花伤害|每朵{param2:F1P}` → `indexes = [1]`

2. **特殊机制**: 生灭之花伤害基于花朵数量计算
   - `VAR_CHARA_1` = 生灭之花数量（由技能滑块控制，1-7朵）
   - 使用 `finalResCalQueue` 对每朵花的伤害进行计算
   - 计算公式: 每朵花伤害 × (1 + VAR_CHARA_1)

3. **标签**: 生灭之花专属标签 → `tag = "ALBEDO_FATAL_BLOSSOM"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [1],                      // param[2] 每朵花伤害
    "base": "ATTACK",
    "finalResCalQueue": [                // 基于花朵数量的计算
      {
        "relation": "*",                 // 乘法
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_1"   // 花朵数量
          }
        ]
      }
    ],
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_GEO",
    "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST",
    "tag": "ALBEDO_FATAL_BLOSSOM"        // 生灭之花专属
  }
}
```

**计算公式**:
```
每朵花伤害 = param[2] × 攻击力
总伤害 = 每朵花伤害 × (1 + VAR_CHARA_1)
       = param[2] × 攻击力 × (1 + 花朵数量)
```

---

#### 示例1.8: 特殊伤害类型 - 菈乌玛月主题伤害

**角色**: 菈乌玛 (10000119) - 元素战技

**源数据**:
```javascript
// paramDescList (元素战技)
[
  "点按伤害|{param1:F1P}",
  "长按一段伤害|{param2:F1P}",
  "长按二段伤害|每枚草露{param3:F1P}元素精通",
  ...
]

// desc: "...咏唱狩猎的祷歌，造成草元素范围伤害..."
```

**推断过程**:
1. **特殊伤害类型**: 月主题专属伤害（Month Rupture）
   - 使用 `specialDamageType = "moon-rupture-direction"`

2. **攻击类型**: 特殊伤害 → `attackBonusType = "DMG_BONUS_OTHER"`

3. **基础属性**: 元素精通 → `base = "ELEMENTAL_MASTERY"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [2],
    "base": "ELEMENTAL_MASTERY",
    "finalResCalQueue": [
      {
        "relation": "*",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_5"
          }
        ]
      }
    ],
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_DENDRO",
    "attackBonusType": "DMG_BONUS_OTHER",                // 特殊伤害
    "specialDamageType": "moon-rupture-direction"         // 月主题伤害
  }
}
```

---

### 2. 增益配置示例

#### 示例2.1: 开关型增益 - 元素附魔

**角色**: 神里绫华 - other 技能（冰元素附魔）

**源数据**:
```javascript
// paramDescList
[
  ...
  "霜寒一役的冰华|普通攻击和重击转为冰元素伤害",
  ...
]
```

**推断过程**:
1. **识别增益类型**: 开关型效果 → `settingType = "switch"`

2. **覆盖元素**: 冰元素 → `overrideElement = "DMG_BONUS_CRYO"`

3. **参数索引**: 第3个参数 → `index = 2`

**最终配置**:
```javascript
{
  "buffs": [
    {
      "index": 2,                          // 对应param[2]
      "overrideElement": "DMG_BONUS_CRYO",  // 覆盖为冰元素
      "target": [],                        // 空=自身
      "settingType": "switch",             // 开关型
      "defaultEnable": false               // 默认关闭
    }
  ]
}
```

---

#### 示例2.2: 开关型增益 - 班尼特攻击力提升

**角色**: 班尼特 (10000032) - 元素爆发

**源数据**:
```javascript
// paramDescList (简体中文)
[
  ...
  "攻击力提升幅度|{param4:P}",           // param4 = 基础攻击力的百分比
  ...
]

// desc (简体中文): "依据班尼特的基础攻击力，以一定比例提升领域内角色的攻击力。"
```

**推断过程**:
1. **识别增益类型**: 开关型效果（领域内持续生效）→ `settingType = "switch"`

2. **基础属性**: 基于班尼特的基础攻击力 → `base = "ATTACK_BASE"`

3. **目标效果**: 提升攻击力数值 → `target = ["ATTACK_VAL_UP"]`

4. **目标范围**: 领域内所有角色 → `isAllTeam = true`

5. **参数索引**: `param4` → `index = 3`

**最终配置**:
```javascript
{
  "buffs": [
    {
      "index": 3,                          // 对应param[3]
      "base": "ATTACK_BASE",               // 基于基础攻击力
      "target": ["ATTACK_VAL_UP"],         // 提升攻击力数值
      "settingType": "switch",             // 开关型
      "defaultEnable": false,              // 默认关闭
      "isAllTeam": true                    // 全队生效
    }
  ]
}
```

**计算公式**:
```
攻击力提升 = param[3] × 班尼特的基础攻击力
```

---

#### 示例2.3: 滑块型增益 - 芙宁娜众水水平

**角色**: 芙宁娜 (10000051) - 元素爆发

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "持续期间|{param1:F1}秒",               // param1 = 持续时间
  "众水水平每层|{param2:F1P}",            // param2 = 每层伤害提升
  ...
]

// desc (简体中文): "根据队伍中生命值百分比高于50%的角色数量，获得最多3层'众水水平'，每层提升芙宁娜造成的伤害与受到的治疗。"
```

**推断过程**:
1. **识别增益类型**: 滑块型效果（基于角色数量的层数）→ `settingType = "slider"`

2. **层数范围**: 0-3层（最多4名角色生命值>50%）→ `sliderMax = 300`（对应3.0倍率）

3. **目标效果**: 提升伤害（反向提升）→ `target = ["REVERSE_HEALING_BONUS"]`

4. **参数索引**: `param2` → `index = 1`

5. **滑块设置**: 以10为单位（0.1倍率=10%），最大300（3.0倍率=300%）

**最终配置**:
```javascript
{
  "buffs": [
    {
      "index": 1,                              // 对应param[1]
      "target": ["REVERSE_HEALING_BONUS"],     // 众水水平（反向提升伤害与治疗）
      "settingType": "slider",                 // 滑块型
      "sliderInitialValue": 0,                 // 初始值0（无层数）
      "sliderStep": 10,                        // 步长10（0.1倍率）
      "sliderMax": 300                         // 最大300（3.0倍率=3层）
    }
  ]
}
```

**计算公式**:
```
伤害/治疗提升 = param[1] × 众水水平层数
众水水平层数 = min(队伍中生命值>50%的角色数, 3)
```

---

### 3. 治疗配置示例

#### 示例3.1: 单倍率治疗 - 芭芭拉

**角色**: 芭芭拉 - 元素战技

**源数据**:
```javascript
// paramDescList
[
  "卖艺·歌声治疗量|{param1:F1P}生命值",
  ...
]
```

**推断过程**:
1. **提取参数**: `param1` → `index = 0`
2. **基础属性**: 生命值 → `base = "HP"`
3. **治疗类型**: 技能治疗 → `healingBonusType = "HEALING_BONUS_SKILL"`

**最终配置**:
```javascript
{
  "healing": {
    "index": 0,                           // param[0]
    "base": "HP",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

**计算公式**:
```
治疗量 = param[0] × 生命值
```

---

#### 示例3.2: 双参数治疗 - 久岐忍

**角色**: 久岐忍 - 元素战技

**源数据**:
```javascript
// paramDescList
[
  "御后之血治疗量|{param1:F1P}生命值+{param2:I}",
  ...
]
```

**推断过程**:
1. **主要倍率**: `param1生命值` → `index = 0`, `base = "HP"`
2. **固定值**: `+ param2` → `constIndex = 1`, `constCalRelation = "+"`

**最终配置**:
```javascript
{
  "healing": {
    "index": 0,                           // param[0] × HP
    "constIndex": 1,                      // + param[1]
    "constCalRelation": "+",              // 加法关系
    "base": "HP",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

**计算公式**:
```
治疗量 = (param[0] × 生命值) + param[1]
```

---

#### 示例3.3: 基于攻击力的治疗

**角色**: 琴 - 元素爆发

**源数据**:
```javascript
// paramDescList
[
  "蒲公英领域治疗量|{param3:F1P}攻击力+{param4:I}",
  ...
]
```

**推断过程**:
1. **主要倍率**: `param3攻击力` → `index = 2`, `base = "ATTACK"`
2. **固定值**: `+ param4` → `constIndex = 3`

**最终配置**:
```javascript
{
  "healing": {
    "index": 2,                           // param[2] × 攻击力
    "constIndex": 3,                      // + param[3]
    "constCalRelation": "+",
    "base": "ATTACK",                     // 基于攻击力
    "healingBonusType": "HEALING_BONUS_ELEMENTAL_BURST"
  }
}
```

---

### 4. 护盾配置示例

#### 示例4.1: 基于生命的护盾 - 钟离

**角色**: 钟离 - 元素战技

**源数据**:
```javascript
// paramDescList
[
  "护盾吸收量|{param1:F1P}生命值+{param2:I}",
  ...
]
```

**推断过程**:
1. **主要倍率**: `param1生命值` → `index = 0`, `base = "HP"`
2. **固定值**: `+ param2` → `constIndex = 1`
3. **护盾元素**: 岩元素 → `shieldElementType = "GEO"`

**最终配置**:
```javascript
{
  "shield": {
    "index": 0,                           // param[0] × HP
    "constIndex": 1,                      // + param[1]
    "constCalRelation": "+",
    "base": "HP",
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "GEO"            // 岩元素护盾
  }
}
```

**计算公式**:
```
护盾量 = (param[0] × 生命值) + param[1]
```

---

#### 示例4.2: 基于防御力的护盾 - 迪奥娜

**角色**: 迪奥娜 - 元素战技

**源数据**:
```javascript
// paramDescList
[
  "猫爪护盾吸收量|{param1:F1P}防御力",
  ...
]
```

**推断过程**:
1. **主要倍率**: `param1防御力` → `index = 0`, `base = "DEFENSE"`
2. **护盾元素**: 冰元素 → `shieldElementType = "CRYO"`

**最终配置**:
```javascript
{
  "shield": {
    "index": 0,                           // param[0] × 防御力
    "base": "DEFENSE",
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "CRYO"           // 冰元素护盾
  }
}
```

---

#### 示例4.3: 火元素护盾 - 辛焱

**角色**: 辛焱 - 元素战技

**源数据**:
```javascript
// paramDescList
[
  "赤璋护盾吸收量|{param2:F1P}防御力",
  ...
]
```

**最终配置**:
```javascript
{
  "shield": {
    "index": 1,                           // param[1]
    "base": "DEFENSE",
    "constIndex": 2,
    "constCalRelation": "+",
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "PYRO"           // 火元素护盾
  }
}
```

---

### 5. 特殊配置汇总表

| 配置类型 | 关键字段 | 判断依据 |
|---------|---------|---------|
| **基础伤害** | `indexes`, `base`, `elementBonusType` | `{paramX}` 提取indexes |
| **参考技能** | `originSkills`, `originIndexes` | 描述包含"XX伤害" |
| **复合倍率** | `indexesAttach`, `baseAttach` | 描述包含 `+` 连接多个属性 |
| **显示控制** | `displayCalQueue` | 需要条件判断才显示 |
| **最终修正** | `finalResCalQueue` | 对最终伤害进行额外计算 |
| **特殊标签** | `tag` | 生成物、召唤物等特殊机制 |
| **自定义倍率** | `customValues` | 固定倍率而非参数 |
| **特殊伤害** | `specialDamageType` | 月反应、后台伤害等 |

---

### 配置推断快速参考

#### 从 paramDescList 提取配置

```
"一段伤害|{param1:F1P}"              → indexes: [0]
"二段伤害|{param2:F1P}"              → indexes: [1]
"伤害|{param1:F1P}攻击力"            → base: "ATTACK"
"伤害|{param1:F1P}生命值"            → base: "HP"
"伤害|{param1:F1P}防御力"            → base: "DEFENSE"
"伤害|{param1:F1P}元素精通"          → base: "ELEMENTAL_MASTERY"
"伤害|{param1:F1P}+{param2:I}"       → index: 0, constIndex: 1
"伤害|{param1:F1P}普通攻击伤害"      → originSkills: ["normal"]
"伤害|{param1:F1P}攻击力+{param2:F1P}元素精通" → indexesAttach, baseAttach
```

#### 从技能类型判断字段

```
普通攻击 + 非法器 → canOverride: true, elementBonusType: "DMG_BONUS_PHYSICAL"
普通攻击 + 法器   → canOverride: false, elementBonusType: 角色元素
元素战技          → canOverride: false, elementBonusType: 角色元素
元素爆发          → canOverride: false, elementBonusType: 角色元素
```

#### 从元素关键词判断

```
"火元素"/"燃烧"   → DMG_BONUS_PYRO
"水元素"/"感电"   → DMG_BONUS_HYDRO
"风元素"/"扩散"   → DMG_BONUS_ANEMO
"雷元素"/"超载"   → DMG_BONUS_ELECTRO
"冰元素"/"融化"   → DMG_BONUS_CRYO
"岩元素"/"结晶"   → DMG_BONUS_GEO
"草元素"/"绽放"   → DMG_BONUS_DENDRO
```

---
