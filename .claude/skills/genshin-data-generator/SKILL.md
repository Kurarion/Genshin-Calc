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
- `PROP_DMG_ANTI_CRYO/...`: 火元素抗性(敌人用)
- `PROP_DMG_ANTI_CRYO_MINUS/...`: 火元素抗性降低(针对敌人)
- `PROP_DMG_CRIT_RATE_UP_CRYO/...`: 火元素会心率提升
- `PROP_DMG_CRIT_DMG_UP_CRYO/...`: 火元素会心伤害提升

**第二组：根据attackBonusType选择（攻击类型）**

- `PROP_DMG_RATE_UP_NORMAL/...`: 普通攻击倍率提升
- `PROP_DMG_RATE_MULTI_NORMAL/...`: 普通攻击倍率倍乘
- `PROP_DMG_BONUS_NORMAL/...`: 普通攻击伤害加成
- `PROP_DMG_VAL_UP_NORMAL/...`: 普通攻击伤害数值提升
- `PROP_DMG_CRIT_RATE_UP_NORMAL/...`: 普通攻击会心率提升
- `PROP_DMG_CRIT_DMG_UP_NORMAL/...`: 普通攻击会心伤害提升
- **特殊**：一些特殊的技能TAG如果存在，则需要**额外**加成对应TAG的Buff

**重要**：一个伤害总是同时具备两个分类（元素类型和攻击类型（又包含了TAG）），两组常量互不冲突！

**全局常量（除了特殊反应伤害之外，对象为任意伤害）**：

- `PROP_DMG_RATE_UP_ALL`: 全局倍率提升
- `PROP_DMG_RATE_MULTI_ALL`: 全局倍率倍乘
- `PROP_DMG_BONUS_ALL`: 全伤害加成
- `PROP_DMG_VAL_UP_ALL`: 全局伤害数值提升
- `PROP_DMG_CRIT_RATE_UP_ALL`: 全局伤害会心率提升
- `PROP_DMG_CRIT_DMG_UP_ALL`: 全局伤害会心伤害提升

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

## 核心概念

**重要**: `paramDescList` 中的每一行代表一个独立的效果，需要在 `skills` 数组中创建对应的配置对象。

### 理解配置数组结构

每个技能的 `skills` 属性是一个数组，数组中的每个对象对应 `paramDescList` 中的一行（或多行相关的效果）：

```javascript
// data.json 中的配置结构
{
  "10000002": {  // 角色ID
    "skills": {
      "normal": [        // ← 数组！每个对象是一个独立配置
        { "damage": { ... } },   // 第1个配置对象
        { "damage": { ... } },   // 第2个配置对象
        { "damage": { ... } }    // 第3个配置对象
      ],
      "skill": [         // ← 数组！
        { "damage": { ... } },
        { "shield": { ... } },
        { "healing": { ... } }
      ]
    }
  }
}
```

### 配置映射规则

| paramDescList 中的行 | 需要创建的配置对象 | 配置类型 |
|---------------------|-------------------|---------|
| 伤害相关描述 | `{ "damage": { ... } }` | 伤害配置 |
| 治疗量描述 | `{ "healing": { ... } }` | 治疗配置 |
| 护盾吸收量描述 | `{ "shield": { ... } }` | 护盾配置 |
| 增益效果描述 | `{ "buffs": [ ... ] }` | 增益配置 |
| 生成物生命值 | `{ "product": { ... } }` | 生成物配置 |

**关键原则**:
- 每一行描述 = 一个配置对象（除非多行属于同一效果）
- 配置顺序通常按照 paramDescList 的行顺序排列
- 不同类型的效果（伤害/治疗/护盾/增益）**建议分开写**，虽然技术上可以合并到同一个对象，但分开写更清晰易读

### 配置对象合并 vs 分开

**推荐做法：分开写**
```javascript
"skill": [
  { "damage": { ... } },    // 第1个配置对象
  { "shield": { ... } },    // 第2个配置对象
  { "healing": { ... } }    // 第3个配置对象
]
```

**技术上可行但不推荐：合并**
```javascript
"skill": [
  {                                 // 合并的配置对象（不推荐）
    "damage": { ... },
    "shield": { ... },
    "healing": { ... }
  }
]
```

**建议分开写的原因**:
- 更易读和维护
- 与 paramDescList 的行顺序对应关系更清晰
- 便于后续修改和调试

---

### 1. 伤害配置示例

#### 示例1.1: 基础物理普通攻击（神里绫华）

**角色**: 神里绫华 (10000002) - 神里流·倾

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "一段伤害|{param1:F1P}",           // param1 = 0.457253 (等级1)
  "二段伤害|{param2:F1P}",           // param2 = 0.486846 -> 普通攻击伤害类型
  "三段伤害|{param3:F1P}",           // param3 = 0.626218 -> 普通攻击伤害类型
  "四段伤害|{param4:F1P}*3",         // param4 = 0.226464 (3次) -> 普通攻击伤害类型
  "五段伤害|{param7:F1P}",           // param7 = 0.781817 -> 普通攻击伤害类型
  "重击伤害|{param8:F1P}*3",         // param8 = 0.515464 (3次) -> 重击伤害类型
  ...
]

// paramMap["01"] (等级1的参数值)
[0.457253, 0.486846, 0.626218, 0.226464, 0, 0, 0.781817, 0.515464,...]
```

**推断过程**:

**步骤1: 识别普通攻击伤害的行**
- 第1-5行: 普通攻击的各段伤害
- 第6行: 重击伤害（需要单独配置）

**步骤2: 提取普通攻击的参数索引**
- `param1` (一段) → index = 0
- `param2` (二段) → index = 1
- `param3` (三段) → index = 2
- `param4` (四段) → index = 3
- 跳过 param5, param6 (paramDescList中没有使用)
- `param7` (五段) → index = 6
- 结果: `indexes = [0, 1, 2, 3, 6]`

**步骤3: 确定基础属性**
- 描述中没有特殊说明（如"生命值"、"防御力"等）
- 默认使用攻击力 → `base = "ATTACK"`

**步骤4: 判断是否可被覆盖 (canOverride)**
- 技能类型: normal (普通攻击)
- 武器类型: WEAPON_SWORD_ONE_HAND (单手剑，非法器)
- 非法器角色的普通攻击可以被元素附魔覆盖 → `canOverride = true`

**步骤5: 判断元素加成类型 (elementBonusType)**
- 普通攻击 + 非法器角色 = 物理伤害
- 结果: `elementBonusType = "DMG_BONUS_PHYSICAL"`

**步骤6: 判断攻击加成类型 (attackBonusType)**
- 普通攻击类型 → `attackBonusType = "DMG_BONUS_NORMAL"`

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

// 武器类型: WEAPON_CATALYST (法器)
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
   - normal 的 `param1` → `originIndexes = [0]`(这里作为例子只使用第一段的普通攻击，其他段数的普通攻击同理)

4. **确定 originRelations**:
   - 描述格式: "X%普通攻击伤害" → 乘法关系
   - 结果: `originRelations = ["*"]`

5. **判断其他字段**:
   - 技能类型: elementalBurst
   - 元素: 雷 → `elementBonusType = "DMG_BONUS_ELECTRO"`（技能Desc中有提及是造成雷元素伤害）
   - 攻击类型: 参考了normal，因此即使是元素爆发，攻击类型为普通攻击 → `attackBonusType = "DMG_BONUS_NORMAL"`
   - 特殊机制: 狼魂 → `tag = "RAZOR_SOUL_COMPANION"`（其他天赋中存在针对这个狼魂伤害的单独加成，因此追加一个tag来区别爆发伤害与狼魂伤害，注意“狼魂”需要作为i18n值以后续完善多语言，命名方式为角色名_伤害名<都是英语大写，需要从en中提取>）

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
   - 特殊机制（因为在其他天赋中有描述只针对灭净三业伤害的增益，为了防止影响元素技能中不属于灭净三业櫖伤害而追加此特殊Tag）: 灭净三业 → `tag = "NAHIDA_TRI_KARMA"` （命名方式为角色名_伤害名<都是英语大写，需要从en中提取>）

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

#### 示例1.5: 显示控制队列 （一般不使用） - 闲云（假设）

**角色**: 闲云（假设） - 风元素转化普通攻击

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

**推断过程（针对生灭之花）**:
1. **提取基础参数**: `生灭之花伤害|每朵{param2:F1P}` → `indexes = [1]`

2. **特殊机制**: 生灭之花伤害基于花朵数量计算
   - `VAR_CHARA_1` = 生灭之花数量（由Buff滑块控制，1-7朵）
   - 使用 `finalResCalQueue` 对命中花的数量的伤害进行计算
   - 计算公式: 一朵花伤害 × (0 + VAR_CHARA_1)

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
总伤害 = 每朵花伤害 × (0 + VAR_CHARA_1)
       = param[2] × 攻击力 × (0 + 花朵数量)
```

---

#### 示例1.8: 特殊伤害类型 - 菈乌玛月反应伤害

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

// desc: "...咏唱狩猎的祷歌，造成草元素范围伤害...与一次视为月绽放反应伤害的草元素范围伤害" -> 推断出长按二段伤害是被视为月绽放反应伤害
```

**推断过程**:
1. **特殊伤害类型**: 直接月绽放伤害（Moon Rupture）
   - 由于技能中有明确技能倍率，因此视为**直接**月绽放伤害
   - 使用 `specialDamageType = "moon-rupture-direction"`

2. **攻击类型**: 特殊伤害 → `attackBonusType = "DMG_BONUS_OTHER"`

3. **基础属性**: 元素精通 → `base = "ELEMENTAL_MASTERY"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [2],                      // param[3]
    "base": "ELEMENTAL_MASTERY",
    "finalResCalQueue": [                // 基于草露数量计算合计伤害
      {
        "relation": "*",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_5"    // 草露数量（1-3个）
          }
        ]
      }
    ],
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_DENDRO",
    "attackBonusType": "DMG_BONUS_OTHER",                // 特殊伤害
    "specialDamageType": "moon-rupture-direction"         // 直接月绽放伤害
  }
}
```

---

### 2. 增益配置示例

#### 示例2.1: 开关型增益 - 元素附魔

**角色**: 神里绫华 - other 技能（冰元素附魔）神里流·霰步

**源数据**:
```javascript
// paramDescList
[
  "启动体力消耗|{param1:F1}点",
  "持续体力消耗|每秒{param2:F1}点",
  "附魔持续时间|{param3:F1}秒"
]

// desc: "...将寒气凝聚在剑上，使神里绫华在短时间内获得冰元素附魔..."
```

**推断过程**:

**步骤1: 从desc识别增益类型**
- desc描述: "将寒气凝聚在剑上，使神里绫华在短时间内获得冰元素附魔"
- 这是元素附魔效果，可以开关 → `settingType = "switch"`

**步骤2: 确定附魔的元素类型**
- desc中明确提到: "冰元素附魔"
- 结果: `overrideElement = "DMG_BONUS_CRYO"`

**步骤3: 设置其他必要字段**
- 附魔不需要实际数值buff → `target = []` (空数组)
- 默认关闭 → `defaultEnable = false`
- index可以是任意值（因为不涉及实际数值计算）→ `index = 1`

**最终配置**:
```javascript
{
  "buffs": [
    {
      "index": 1,                          // 任意一个Index即可
      "overrideElement": "DMG_BONUS_CRYO",  // 设置普通攻击，重击，下落攻击为冰元素附魔
      "target": [],                        // 空=>不追加实际Buff
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
  "攻击力加成比例|{param4:P}",           // param4 = 基础攻击力的百分比
  ...
]

// desc (简体中文): "依据班尼特的基础攻击力，以一定比例提升领域内角色的攻击力。"
```

**推断过程**:

**步骤1: 从paramDescList和desc识别增益类型**
- desc描述: "依据班尼特的基础攻击力，以一定比例提升领域内角色的攻击力"
- 领域内持续生效，可以开关 → `settingType = "switch"`

**步骤2: 确定基础属性**
- desc明确提到: "基础攻击力"
- 注意: 是 ATTACK_BASE (基础攻击力)，不是 ATTACK (最终攻击力) → `base = "ATTACK_BASE"`

**步骤3: 确定目标效果**
- 提升攻击力数值 (百分比形式的数值提升) → `target = ["ATTACK_VAL_UP"]`

**步骤4: 确定目标范围**
- desc描述: "领域内角色的攻击力" → 影响全队 → `isAllTeam = true`

**步骤5: 提取参数索引**
- `param4` (攻击力加成比例) → index = 4-1 = 3

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

#### 示例2.3: 滑块型增益 - 芙宁娜气氛值

**角色**: 芙宁娜 (10000089) - 元素爆发

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "技能伤害|{param1:F1P}生命值上限",
  "持续时间|{param2:F1}秒",
  "气氛值上限|{param4:I}",                   // param4 = 300
  "气氛值转化提升伤害比例|{param5:F2P}",     // param5 = 0.0007 (每点气氛值)
  "气氛值转化受治疗加成比例|{param6:F2P}",   // param6 = 0.0001 (每点气氛值)
  ...
]

// desc (简体中文): "凝聚狂欢之意...使队伍中附近的角色进入「普世欢腾」状态：持续期间，角色的当前生命值提升或降低时，基于提升或降低数值相对于生命值上限的比例，每1%都将使芙宁娜获得1点「气氛值」。同时，基于芙宁娜持有的「气氛值」，附近的队伍中所有角色造成的伤害提升，受治疗加成提升。"
```

**推断过程**:

**步骤1: 从desc识别增益类型**
- desc描述: "每1%都将使芙宁娜获得1点「气氛值」。同时，基于芙宁娜持有的「气氛值」...伤害提升，受治疗加成提升"
- 这是一个可变数值的效果，用滑块模拟 → `settingType = "slider"`

**步骤2: 确定数值范围**
- `param4` = 300 (气氛值上限)
- 设置滑块最大值 → `sliderMax = 300`
- 初始值 → `sliderInitialValue = 0`

**步骤3: 确定目标效果**
- desc描述: "造成的伤害提升，受治疗加成提升"
- 需要两个不同的target → 伤害加成 + 受到治疗加成
- 全队生效 → `isAllTeam = true`

**步骤4: 提取参数索引**
- `param5` (伤害转化比例) → index = 5-1 = 4
- `param6` (治疗转化比例) → index = 6-1 = 5

**步骤5: 理解双对象配置**
- 因为两个不同的param需要共享同一个滑块值
- 所以使用两个buff对象，第一个对象定义滑块，第二个对象仅定义target

**最终配置**:
```javascript
{
  "buffs": [ // 注意这里在一个Buff内使用了两个不同Object配置，这样是为了让两个不同Index的target共享同一个settingType（这里是滑块）的设定值，因此第二个Object不需要培植settingType相关内容，仅仅需要填写Buff相关内容即可
    {
      "index": 5,                              // 对应param[6]
      "target": ["REVERSE_HEALING_BONUS"],     // 受到治疗加成
      "settingType": "slider",                 // 滑块型
      "sliderInitialValue": 0,                 // 初始值0
      "sliderMax": 300,                        // 最大300点气氛值
      "sliderStep": 1,                         // 步长1
      "isAllTeam": true                        // 全队生效
    },
    {
      "index": 4,                              // 对应param[5]
      "target": ["DMG_BONUS_ALL"],             // 所有伤害加成
      "isAllTeam": true                        // 全队生效
    }
  ]
}
```

**计算公式**:
```
伤害提升 = 气氛值 × param[5]
受治疗提升 = 气氛值 × param[6]
气氛值 = 队友HP变化%总和 (上限300) -> 通过Slider来模拟
```

**机制说明**: 队友每变化1%生命值上限，芙宁娜获得1点气氛值，每点气氛值提供 param[5] 的伤害与 param[6] 受治疗加成。

---

### 3. 治疗配置示例

**重要**: 原神中的治疗技能通常同时包含**百分比倍率**和**固定数值**两部分。以下示例基于实际游戏数据。

#### 示例3.1: 多重治疗 - 芭芭拉

**角色**: 芭芭拉 (10000014) - 元素战技「演唱，开始♪」

**源数据**:
```javascript
// paramDescList (元素战技)
[
  "持续治疗量|{param1:F2P}生命值上限+{param2:I}",
  "命中治疗量|{param3:F2P}生命值上限+{param4:I}",
  "水珠伤害|{param5:F1P}",
  "持续时间|{param6:F1}秒",
  "冷却时间|{param7:F1}秒"
]
```

**说明**: 芭芭拉的元素战技有**两种不同的治疗效果**，每个都需要单独的配置对象。

**推断过程**:

**步骤1: 分析每一行的含义和参数**
- 第1行: `"持续治疗量|{param1:F2P}生命值上限+{param2:I}"`
  - 效果类型: 治疗量
  - 主要倍率: `param1` (百分比)
  - 固定值: `param2` (整数)
  - 基础属性: 生命值上限
- 第2行: `"命中治疗量|{param3:F2P}生命值上限+{param4:I}"`
  - 效果类型: 治疗量
  - 主要倍率: `param3` (百分比)
  - 固定值: `param4` (整数)
  - 基础属性: 生命值上限
- 第3行: `"水珠伤害|{param5:F1P}"`
  - 效果类型: 伤害

**步骤2: 提取参数索引 (index/constIndex)**
- 数组索引从0开始，所以 `paramX` 对应 `index = X-1`
- 持续治疗量: `param1` → `index = 0`, `param2` → `constIndex = 1`
- 命中治疗量: `param3` → `index = 2`, `param4` → `constIndex = 3`
- 水珠伤害: `param5` → `indexes = [4]`

**步骤3: 确定其他必要字段**
- 基础属性: "生命值上限" → `base = "HP"`
- 治疗加成类型: 元素战技 → `healingBonusType = "HEALING_BONUS_SKILL"`
- 计算关系: 有`+`号 → `constCalRelation = "+"`

**步骤4: 为每个效果创建配置对象**
- 持续治疗 → 创建第1个 `healing` 对象
- 命中治疗 → 创建第2个 `healing` 对象
- 水珠伤害 → 创建 `damage` 对象

**最终配置** (data.json中的实际配置):
```javascript
"skill": [
  {
    "healing": {
      "index": 0,                           // param[0] × HP (持续治疗)
      "constIndex": 1,                      // + param[1]
      "constCalRelation": "+",
      "base": "HP",
      "healingBonusType": "HEALING_BONUS_SKILL"
    }
  },
  {
    "healing": {
      "index": 2,                           // param[2] × HP (命中治疗)
      "constIndex": 3,                      // + param[3]
      "constCalRelation": "+",
      "base": "HP",
      "healingBonusType": "HEALING_BONUS_SKILL"
    }
  },
  {
    "damage": {                             // 水珠伤害
      "indexes": [4],
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_HYDRO",
      "attackBonusType": "DMG_BONUS_SKILL"
    }
  }
]
```

**计算公式**:
```
持续治疗量 = (param[0] × 生命值上限) + param[1]
命中治疗量 = (param[2] × 生命值上限) + param[3]
```

---

#### 示例3.2: 基于生命的治疗 - 久岐忍

**角色**: 久岐忍 (10000065) - 元素战技「越祓雷草之轮」

**源数据**:
```javascript
// paramDescList (元素战技)
[
  "技能伤害|{param1:P}",
  "越祓草轮治疗量|{param2:F1P}生命值上限+{param3:I}",
  "越祓草轮伤害|{param4:F1P}",
  ...
]
```

**推断过程**:

**步骤1: 识别治疗效果的行**
- 第2行: `"越祓草轮治疗量|{param2:F1P}生命值上限+{param3:I}"` - 这是治疗效果

**步骤2: 提取参数和计算关系**
- 描述格式: `{param2:F1P}生命值上限+{param3:I}`
- 百分比参数: `param2` → 数组索引 = 2-1 = 1
- 固定值参数: `param3` → 数组索引 = 3-1 = 2
- 计算关系: 有`+`号，表示加法

**步骤3: 确定基础属性和类型**
- 基础属性: "生命值上限" → `base = "HP"`
- 治疗加成类型: 元素战技 → `healingBonusType = "HEALING_BONUS_SKILL"`

**最终配置**:
```javascript
{
  "healing": {
    "index": 1,                           // param[1] = param2 in desc
    "constIndex": 2,                      // param[2] = param3 in desc
    "constCalRelation": "+",
    "base": "HP",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

**计算公式**:
```
治疗量 = (param[1] × 生命值上限) + param[2]
```

---

#### 示例3.3: 基于攻击力的治疗 - 琴

**角色**: 琴 (10000003) - 元素爆发「蒲公英之风」

**源数据**:
```javascript
// paramDescList (元素爆发)
[
  "爆发伤害|{param1:P}",
  "出入领域伤害|{param2:F1P}",
  "领域发动治疗量|{param3:P}攻击力+{param4:I}",
  "持续治疗|每秒{param5:F2P}攻击力+{param6:I}",
  ...
]
```

**推断过程**:

**步骤1: 识别治疗效果的行**
- 第3行: `"领域发动治疗量|{param3:P}攻击力+{param4:I}"` - 初始治疗
- 第4行: `"持续治疗|每秒{param5:F2P}攻击力+{param6:I}"` - 持续治疗（每秒）

**步骤2: 提取参数 (以初始治疗为例)**
- 百分比参数: `param3` → 数组索引 = 3-1 = 2
- 固定值参数: `param4` → 数组索引 = 4-1 = 3

**步骤3: 确定基础属性**
- 注意: 描述中是"攻击力"而非"生命值" → `base = "ATTACK"`
- 治疗加成类型: 元素爆发 → `healingBonusType = "HEALING_BONUS_ELEMENTAL_BURST"`

**最终配置** (仅展示初始治疗):
```javascript
{
  "healing": {
    "index": 2,                           // param[2] × 攻击力
    "constIndex": 3,                      // + param[3]
    "constCalRelation": "+",
    "base": "ATTACK",                     // 基于攻击力！
    "healingBonusType": "HEALING_BONUS_ELEMENTAL_BURST"
  }
}
```

---

### 4. 护盾配置示例

**重要**: 原神中的护盾技能通常同时包含**百分比倍率**和**固定数值**两部分。以下示例基于实际游戏数据。

**⚠️ 护盾属性说明**: 护盾可以基于不同的属性计算，**必须从实际`paramDescList`确认**，不能想当然：
- **HP (生命值)**: 最常见的护盾属性（如：钟离、迪奥娜、莱依拉、瑶瑶、闲云等）
- **DEFENSE (防御力)**: 较少见（如：诺艾尔、辛焱）
- **其他**: 极少数特殊情况

#### 示例4.1: 基于防御力的护盾 - 诺艾尔

**角色**: 诺艾尔 (10000034) - 元素战技「护心铠」

**源数据**:
```javascript
// paramDescList (元素战技)
[
  "技能伤害|{param6:P}防御力",
  "吸收量|{param1:P}防御力+{param7:I}",
  "治疗量|{param2:F1P}防御力+{param8:I}",
  "治疗触发几率|{param3:P}",
  "持续时间|{param4:F1}秒",
  "冷却时间|{param5:F1}秒"
]
```

**推断过程**:

**步骤1: 识别护盾效果的行**
- 第2行: `"吸收量|{param1:P}防御力+{param7:I}"` - 这是护盾吸收量

**步骤2: 提取参数**
- 注意参数顺序: `param1`和`param7`不是连续的！
- 百分比参数: `param1` → 数组索引 = 1-1 = 0
- 固定值参数: `param7` → 数组索引 = 7-1 = 6

**步骤3: 确定基础属性**
- 从描述中明确看到: "防御力" → `base = "DEFENSE"`
- 护盾元素: 诺艾尔是岩元素角色 → `shieldElementType = "GEO"`

**最终配置**:
```javascript
{
  "shield": {
    "index": 0,                           // param[0] × 防御力
    "constIndex": 6,                      // + param[6] (固定值)
    "constCalRelation": "+",
    "base": "DEFENSE",
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "GEO"            // 岩元素护盾
  }
}
```

**计算公式**:
```
护盾量 = (param[0] × 防御力) + param[6]
```

---

#### 示例4.2: 基于生命值的护盾 - 迪奥娜

**角色**: 迪奥娜 (10000039) - 元素战技「猫爪冻冻」

**源数据**:
```javascript
// paramDescList (元素战技)
[
  "猫爪伤害|每个{param1:F1P}",
  "护盾基础吸收量|{param2:F1P}最大生命值+{param3:I}",
  "持续时间|每个猫爪{param6:F1}秒",
  "冷却时间|{param7:F1}秒"
]
```

**推断过程**:

**步骤1: 识别护盾效果的行**
- 第2行: `"护盾基础吸收量|{param2:F1P}最大生命值+{param3:I}"` - 这是护盾吸收量

**步骤2: 提取参数**
- 百分比参数: `param2` → 数组索引 = 2-1 = 1
- 固定值参数: `param3` → 数组索引 = 3-1 = 2

**步骤3: 确定基础属性**
- ⚠️ **重要**: 从描述中看到: "最大生命值" → `base = "HP"`
- **不是防御力！** 虽然迪奥娜的突破加成是防御力，但护盾本身是基于生命值计算的
- 护盾元素: 迪奥娜是冰元素角色 → `shieldElementType = "CRYO"`

**最终配置**:
```javascript
{
  "shield": {
    "index": 1,                           // param[1] × 最大生命值
    "constIndex": 2,                      // + param[2]
    "constCalRelation": "+",
    "base": "HP",                         // ⚠️ 基于生命值
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "CRYO"           // 冰元素护盾
  }
}
```

**计算公式**:
```
护盾量 = (param[1] × 最大生命值) + param[2]
```

**⚠️ 重要说明**:
- 迪奥娜的护盾是基于**生命值**计算的，不是防御力
- 这个例子说明：**不能根据角色的突破属性来推断护盾的base属性**
- 必须从实际的`paramDescList`描述中确认基础属性

---

#### 示例4.3: 多等级护盾 - 辛焱

**角色**: 辛焱 (10000044) - 元素战技「热情拂扫」

**源数据**:
```javascript
// paramDescList (元素战技)
[
  "挥舞伤害|{param1:P}",
  "一级护盾吸收量|{param2:F1P}防御力+{param3:I}",
  "二级护盾吸收量|{param4:F1P}防御力+{param5:I}",
  "三级护盾吸收量|{param6:F1P}防御力+{param7:I}",
  "持续伤害|{param8:F1P}",
  "护盾持续时间|{param9:F1}秒",
  "冷却时间|{param10:F1}秒"
]
```

**说明**: 辛焱的护盾根据命中敌人数量有**三个等级**，每个等级都需要单独的配置对象。

**推断过程**:

**步骤1: 识别所有效果的行**
- 第1行: `"挥舞伤害|{param1:P}"` - 伤害效果
- 第2行: `"一级护盾吸收量|{param2:F1P}防御力+{param3:I}"` - 护盾等级1
- 第3行: `"二级护盾吸收量|{param4:F1P}防御力+{param5:I}"` - 护盾等级2
- 第4行: `"三级护盾吸收量|{param6:F1P}防御力+{param7:I}"` - 护盾等级3
- 第5行: `"持续伤害|{param8:F1P}"` - 持续伤害（仅三级护盾时）

**步骤2: 为每个护盾等级提取参数**
- 一级护盾: `param2` → index = 1, `param3` → constIndex = 2
- 二级护盾: `param4` → index = 3, `param5` → constIndex = 4
- 三级护盾: `param6` → index = 5, `param7` → constIndex = 6

**步骤3: 确定基础属性**
- 所有等级的护盾描述都明确写: "防御力" → `base = "DEFENSE"`
- 护盾元素: 辛焱是火元素角色 → `shieldElementType = "PYRO"`

**步骤4: 为每个效果创建配置对象**
- 挥舞伤害 → 创建 `damage` 对象
- 一级护盾 → 创建第1个 `shield` 对象
- 二级护盾 → 创建第2个 `shield` 对象
- 三级护盾 → 创建第3个 `shield` 对象
- 持续伤害 → 创建第2个 `damage` 对象

**最终配置** (data.json中的实际配置):
```javascript
"skill": [
  {
    "damage": {                             // 挥舞伤害
      "indexes": [0],
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_PYRO",
      "attackBonusType": "DMG_BONUS_SKILL"
    }
  },
  {
    "shield": {                             // 一级护盾 (命中0-1人)
      "index": 1,
      "constIndex": 2,
      "constCalRelation": "+",
      "base": "DEFENSE",
      "shieldBonusType": "SHIELD_BONUS_SKILL",
      "shieldElementType": "PYRO"
    }
  },
  {
    "shield": {                             // 二级护盾 (命中2人)
      "index": 3,
      "constIndex": 4,
      "constCalRelation": "+",
      "base": "DEFENSE",
      "shieldBonusType": "SHIELD_BONUS_SKILL",
      "shieldElementType": "PYRO"
    }
  },
  {
    "shield": {                             // 三级护盾 (命中3人以上)
      "index": 5,
      "constIndex": 6,
      "constCalRelation": "+",
      "base": "DEFENSE",
      "shieldBonusType": "SHIELD_BONUS_SKILL",
      "shieldElementType": "PYRO"
    }
  },
  {
    "damage": {                             // 持续伤害 (三级护盾时)
      "indexes": [7],
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_PYRO",
      "attackBonusType": "DMG_BONUS_SKILL"
    }
  }
]
```

**重要说明**:
- 所有三个护盾等级都需要配置，不是"选择其一"
- 不同等级根据命中敌人数量自动触发
- 三级护盾还会造成持续伤害

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
