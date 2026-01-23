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

1. 伤害配置中的使用

```javascript
//例子1: 基于paramList中index为0，1，2，3，6的伤害倍率的物理+普通攻击类型的伤害，基于攻击力来计算，并且可以被元素覆盖
{
  "damage": {
    "indexes": [0, 1, 2, 3, 6], //paramList中index为[0, 1, 2, 3, 6]的值为伤害倍率
    "base": "ATTACK", //基于攻击力进行计算
    "canOverride": true, //可以被元素覆盖
    "elementBonusType": "DMG_BONUS_PHYSICAL", //伤害的元素类型为物理
    "attackBonusType": "DMG_BONUS_NORMAL" //伤害的攻击类型为普通攻击
  }
},
//例子2: 基于元素爆发技能中paramList中index为0的伤害倍率，根据本技能的paramList中index为0的值来进行乘法计算，取得最终倍率，再与攻击力计算的不可覆盖的冰+元素爆发伤害
{
  "damage": {
    "originSkills": ["elementalBurst"], //参考的技能为元素爆发
    "originIndexes": [0], //参考的技能paramList中index为0的值为伤害倍率
    "originRelations": ["*"], //参考的技能与此技能中paramList中的值的计算关系为乘法
    "indexes": [0], //此技能中paramList中的index为0的值为倍率（用于与参考技能中的倍率进行计算得到最终倍率）
    "base": "ATTACK", //基于攻击力进行计算
    "canOverride": false, //不可以被元素覆盖
    "elementBonusType": "DMG_BONUS_CRYO", //伤害的元素类型为冰
    "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST" //伤害的攻击类型为元素爆发伤害（视为元素爆发伤害）
  }
},
//例子3: 根据VAR_CHARA_2的值来进行显示与隐藏的控制，VAR_CHARA_2不为0则显示，否则不显示该伤害
{
  "damage": {
    "indexes": [1],
    "canOverride": false,
    "base": "ATTACK",
    "displayCalQueue": [ //根据Queue内容来决定最终值
      {
        "relation": "+", //表示+inner内的最终值
        "inner": [
          {
            "relation": "+", //表达此值的符号
            "variable": "VAR_CHARA_2" //直接使用使用变量VAR_CHARA_2
          }
        ]
      }
    ],
    "elementBonusType": "DMG_BONUS_ELECTRO", //伤害的元素类型为雷
    "attackBonusType": "DMG_BONUS_OTHER" //伤害的攻击类型为其他
  }
}
//例子4: 与例子2与3相似，但参考了两个技能的倍率进行的计算，同时也存在显示与隐藏的控制
{
  "damage": {
    "indexes": [0],
    "originSkills": ["normal", "normal"], //使用list来进行管理
    "originIndexes": [1, 11], //使用list来进行管理
    "originRelations": ["*", "*"], //使用list来进行管理
    "canOverride": false,
    "base": "ATTACK",
    "displayCalQueue": [
      {
        "relation": "+",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_2"
          }
        ]
      }
    ],
    "elementBonusType": "DMG_BONUS_ANEMO",
    "attackBonusType": "DMG_BONUS_NORMAL"
  }
},
//例子5: 基于防御力计算的岩+元素爆发伤害（不可覆盖），但需要注意计算结果最终根据finalResCalQueue中的内容来对VAR_CHARA_3进行一次乘法计算
{
  "damage": {
    "indexes": [1],
    "base": "DEFENSE",
    "finalResCalQueue": [ //计算结果后处理
      {
        "relation": "*", //表示【计算结果】*inner结果
        "inner": [
          {
            "relation": "+", //表达此值的符号
            "variable": "VAR_CHARA_3" //直接使用使用变量VAR_CHARA_3（如果VAR_CHARA_3==2则最终伤害为原来的两倍）
          }
        ]
      }
    ],
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_GEO",
    "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
  }
}
//例子6: 基于攻击力与元素精通的草+元素技能的复合伤害，倍率相关的计算过程为【paramList中index为2的值】* 【攻击力】 + 【paramList中index为3的值】* 【元素精通】 ，同时此技能为元素技能中伤害标签（tag）为NAHIDA_TRI_KARMA的伤害，除了适用于技能伤害之外，而额外受到tag为NAHIDA_TRI_KARMA的对应buff加成
{
  "damage": {
    "indexes": [2], //基本的Base的倍率
    "indexesAttach": [[3]], //额外的Base的倍率
    "canOverride": false,
    "base": "ATTACK", //基本的Base
    "baseAttach": ["ELEMENTAL_MASTERY"], //额外的Base
    "elementBonusType": "DMG_BONUS_DENDRO",
    "attackBonusType": "DMG_BONUS_SKILL",
    "tag": "NAHIDA_TRI_KARMA" //额外受到来自相同tag的buff加成（前提是此buff针对这个伤害类型与攻击类型且tag一致）
  }
}
//例子7: 基于攻击力的不可覆盖的月感电直接伤害（月反应）
{
  "damage": {
    "indexes": [1, 2, 5, 6],
    "base": "ATTACK",
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_ELECTRO",
    "attackBonusType": "DMG_BONUS_OTHER", //因为是特殊的反应伤害，攻击类型为Other
    "specialDamageType": "moon-electro-charged-direction" //特殊的反应伤害使用【月感电直接伤害】
  }
}
//例子8: 基于自定义的伤害倍率来计算的伤害，1*攻击力
{
  "damage": {
    "customValues": [1], //自定义的伤害倍率为1
    "base": "ATTACK",
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_ELECTRO",
    "attackBonusType": "DMG_BONUS_OTHER"
  }
},
```
```javascript
// 2. Buff配置中的使用
{
  "customValue": 0.3                    // 攻击力+30%
  "target": ["ATTACK_UP"],              // 使用PROP_ATTACK_UP
}

{
  "index": 1                     // 使用该技能paramList中index为1的值（随着技能等级变化）
  "target": ["DMG_RATE_UP_SKILL"],      // 使用PROP_DMG_RATE_UP_SKILL
}

{
  "customValue": 0.5                     // 冰元素伤害倍率×0.5
  "target": ["DMG_RATE_MULTI_CRYO"],    // 使用PROP_DMG_RATE_MULTI_CRYO
}

// 3. 治疗配置中的使用
{
  "healingBonusType": "HEALING_BONUS_SKILL"  // 使用PROP_HEALING_BONUS_SKILL
}

{
  "target": ["HEALING_RATE_UP_SKILL"],   // 使用PROP_HEALING_RATE_UP_SKILL
  "customValue": 0.15                    // 元素技能治疗倍率+15%
}

// 4. 护盾配置中的使用
{
  "shieldBonusType": "SHIELD_BONUS_SKILL",   // 使用PROP_SHIELD_BONUS_SKILL
  "shieldElementType": "CRYO"
}

// 5. 会心独立区
{
  "target": ["DMG_CRIT_DMG_UP_SKILL"],    // 使用PROP_DMG_CRIT_DMG_UP_SKILL
  "customValue": 0.15                      // 元素技能会心伤害+15%
}

// 6. 生成物HP计算
{
  "product": {
    "index": 0,
    "base": "HP",
    "elementBonusType": "DMG_BONUS_CRYO"    // 用于元素加成区计算
  }
}

// 7. 治疗倍率倍乘
{
  "target": ["HEALING_RATE_MULTI_SKILL"],  // 使用PROP_HEALING_RATE_MULTI_SKILL
  "customValue": 0.5                       // 元素技能治疗倍率×0.5
}
```

#### 常量命名规则

```
PROP_DMG_ {TYPE} _ {ELEMENT/SKILL}
       ↓     ↓             ↓
      伤害  类型        元素/技能

TYPE:
- BONUS: 伤害加成
- RATE_UP: 倍率提升（加法）
- RATE_MULTI: 倍率倍乘（乘法）
- VAL_UP: 数值提升
- ANTI: 抗性
- CRIT_RATE: 会心率
- CRIT_DMG: 会心伤害
- ENEMY_DEFENSE_DOWN: 防御降低
- ENEMY_DEFENSE_IGNORE: 防御无视

ELEMENT:
- CRYO, PYRO, HYDRO, ELECTRO, ANEMO, GEO, DENDRO, PHYSICAL, ALL

SKILL:
- NORMAL, CHARGED, PLUNGING, SKILL, ELEMENTAL_BURST, WEAPON, OTHER, SET
```

#### 重要性说明

这些PROP_DMG_常量是伤害计算的**核心**，它们：

1. 定义了所有可能的伤害类型和加成方式
2. 支持新元素反应和新伤害乘区的快速添加
3. 覆盖伤害、护盾、治疗、生成物HP计算的所有场景
4. 与Buff系统紧密关联，决定了哪些属性可以被Buff影响

### 技能伤害配置

**重要**：技能配置的核心依据是`paramDescList`，而不是`desc`！`desc`只是对技能本身的描述，需要结合`paramDescList`来判断参数如何与indexes映射。

#### 1. indexes映射

```javascript
"indexes": [0, 1, 2, 3, 6]
```

**判断方法**：

- 通过`paramDescList`判断每个param对应什么
- `paramDescList`中的格式通常是：`技能伤害|{param1:F1P}`
- 从中提取出`{param1}`、`{param2}`等对应关系
- 例如：普通攻击1-5段为`[param1, param2, param3, param4, param5]`，重击为`param6`，则Indexes分别对应`[0,1,2,3,4]`与`[5]`（由于List下标从0开始计算，需要减去1）

**示例**：

```javascript
"paramDescList": {
    "cn_sim": [
        "技能伤害|{param1:F1P}",
        "猫型家用互助协调器伤害|{param2:F1P}",
        "猫型家用互助协调器持续时间|{param3:F1}秒",
        "猫型家用互助协调器治疗量|{param4:F1P}攻击力+{param5:I}",
        "最低生命值角色额外治疗量|{param6:F1P}攻击力+{param7:I}",
        "冷却时间|{param8:F1}秒",
        "元素能量|{param9:I}"
    ],
    ...
```

则此技能的伤害的indexes为`[0,1]`
此技能的治疗量1(猫型家用互助协调器治疗量)的index与constIndex分别为`3`与`4`
此技能的治疗量2(最低生命值角色额外治疗量)的index与constIndex分别为`5`与`6`
**注意**：其他param（2，7，8）由于分别代表了持续时间，冷却时间以及元素能量，不涉及伤害，治疗，buff效果本身，盾量，生成物HP，因此视为无效数据，不需要写入data.json中

#### 2. base属性

```javascript
"base": "ATTACK"
```

**判断方法**：

- 根据`paramDescList`判断
- `{paramX:F1P}`后面如果没有其他内容，默认为攻击力
- 如果写了明确说明，就按照写的来（实际文言可能不是以下内容，请根据内容来判断）
- 例如：`{param0:F1P}%攻击力` → base: "ATTACK"
- 例如：`{param0:F1P}%生命值` → base: "HP"
- 例如：`{param0:F1P}%防御力` → base: "DEFENSE"

**常见base属性**：

- `ATTACK`: 攻击力（最常见）
- `HP`: 生命值
- `DEFENSE`: 防御力
- `ENERGY_RECHARGE`: 元素充能效率
- `ELEMENTAL_MASTERY`: 元素精通

#### 3. attackBonusType（攻击类型）

```javascript
"attackBonusType": "DMG_BONUS_NORMAL"
```

**判断优先级**：

1. **优先级最高**：desc中有明确说明的特殊伤害，或者直接说“视为XX伤害”

   - 例如：`"造成相当于普通攻击伤害的XXX%"` → `DMG_BONUS_NORMAL`
   - 例如：`"造成相当于元素技能伤害的XXX%"` → `DMG_BONUS_SKILL`
   - 例如：`"视为元素爆发伤害"` → `DMG_BONUS_ELEMENTAL_BURST`

2. **优先级次高**：根据技能类型判断

   - 普通攻击 → `DMG_BONUS_NORMAL`
   - 重击 → `DMG_BONUS_CHARGED`
   - 下落攻击 → `DMG_BONUS_PLUNGING`
   - 元素技能 → `DMG_BONUS_SKILL`
   - 元素爆发 → `DMG_BONUS_ELEMENTAL_BURST`

3. **优先级最低**：写在天赋（proudSkills），命座等里的，除非desc中特殊说明，否则认为是`DMG_BONUS_OTHER`类型

4. **月反应直接伤害**：
   - 是特殊的反应元素伤害，使用`specialDamageType`来指定的同时根据实际描述来判断是什么类型，为`DMG_BONUS_OTHER`类型

**常见类型**：

- `DMG_BONUS_NORMAL`: 普通攻击
- `DMG_BONUS_CHARGED`: 重击
- `DMG_BONUS_PLUNGING`: 下落攻击
- `DMG_BONUS_SKILL`: 元素技能
- `DMG_BONUS_ELEMENTAL_BURST`: 元素爆发
- `DMG_BONUS_OTHER`: 其他（如天赋效果，未明确说明伤害类型的命座效果，武器效果，圣遗物效果伤害）

#### 4. elementBonusType（元素类型）

```javascript
"elementBonusType": "DMG_BONUS_CRYO"
```

**判断规则**：

1. **优先级最高**：desc中有明确说明

   - 例如：`"造成冰元素伤害"` → `DMG_BONUS_CRYO`
   - 例如：`"造成火元素伤害"` → `DMG_BONUS_PYRO`

2. **优先级次高**：根据武器类型和技能类型判断

   **法器角色**：

   - 默认：普通、重击、下落攻击 → 不可覆盖的对应角色元素类型
   - 例如：法器冰元素角色，普通攻击 → `canOverride: false`, `elementBonusType: "DMG_BONUS_CRYO"`

   **弓箭角色**：

   - 默认：重击（满蓄力） → 不可覆盖的对应角色元素类型
   - 其他：除了特殊描述之外都是可覆盖的物理伤害
   - 例如：弓箭火元素角色，满蓄力重击 → `canOverride: false`, `elementBonusType: "DMG_BONUS_PYRO"`

   **其他武器类型**：

   - 默认：除了特殊描述之外都是可覆盖的物理伤害
   - 例如：剑、大剑、长柄武器的普通攻击 → `canOverride: true`, `elementBonusType: "DMG_BONUS_PHYSICAL"`

3. **元素技能和元素爆发**：

   - 通常是不可覆盖的对应角色元素类型，但存在元素技能或者元素爆发中的物理类型伤害类型
   - `canOverride: false`

4. **月反应直接伤害**：

   - 是不可覆盖的对应反应元素类型
   - `canOverride: false`

#### 5. canOverride

```javascript
"canOverride": true
```

**判断规则**：

- `true`: 可以被元素附魔覆盖（通常是普通，重击，下落的物理伤害）
- `false`: 不可覆盖（通常是元素技能伤害，元素爆发伤害，天赋伤害，命座伤害等等）

**常见情况**：

1. **普通攻击**：

   - 法器角色：`false`（默认是元素伤害）
   - 弓箭角色：`true`（默认是物理伤害）
   - 其他武器：`true`（默认是物理伤害）

2. **重击**：

   - 法器角色：`false`（默认是元素伤害）
   - 弓箭角色：满蓄力`false`（元素伤害），未满蓄力`true`（物理伤害）
   - 其他武器：`true`（默认是物理伤害）

3. **下落攻击**：

   - 法器角色：`false`（默认是元素伤害）
   - 其他武器：`true`（默认是物理伤害）

4. **元素技能、元素爆发、其他伤害**：

   - `false`（通常是元素伤害）

## 工作流程详解

详见[完整工作流程](references/workflow.md)

## 常见更新场景

### 新角色

1. 运行预处理脚本
2. 根据处理后的游戏数据生成data.json中的角色配置（包含特殊技能标签处理）

### 新武器

1. 根据处理后的游戏数据生成data.json中的武器配置

### 新圣遗物套装

1. 根据处理后的游戏数据生成data.json中的套装配置

### 新反应/新机制

1. 在const.ts添加新常量
2. 在calculator.service.ts添加计算逻辑
3. 在interface.ts添加新接口或者值
4. 生成对应配置

## 进阶功能

- 特殊标签处理（VENTI_SKILL_PRESS等）- 用于区分技能内部不同类型的伤害倍率
- displayCalQueue显示用计算队列
- finalResCalQueue最终计算队列

**注意**：特殊标签系统用于区分技能内部多种不同类型的伤害，不是特殊机制！

详见[高级配置指南](references/advanced-config.md)

## 实际使用示例

### 示例1：分析角色并生成配置

**步骤**：

1. **导出角色数据**：
```bash
python3 export_data.py --type character --id 10000002
```

2. **AI 分析数据**：
   - 阅读 `output/exports/character_10000002.json`
   - 分析每个技能的 `paramDescList` 判断 `indexes`
   - 分析 `desc` 判断特殊机制
   - 参考 `interface.ts` 和 `const.ts` 生成配置

3. **生成配置**：
   - AI 根据分析结果生成配置 JSON
   - 手动添加到 `src/assets/init/data.json`

### 示例2：查看特定角色的解包数据

```bash
# 导出特定角色的解包数据，方便参考
python3 export_data.py --type character --id 10000002

# 数据将导出到 output/exports/character_10000002.json
# 使用文本编辑器查看该文件，分析 skills 中的 desc 和 paramDescList
```

### 示例3：判断一个技能的indexes和base

**输入数据**（从解包数据导出）：

```json
{
  "skills": {
    "normal": [{
      "name": {"cn_sim": "普通攻击·神里流·剑术"},
      "desc": {
        "cn_sim": "进行至多五段的连续剑击。"
      },
      "paramList": [43.5, 42.4, 53.1, 54.5, 68.4],
      "paramDescList": [
        "第1段伤害{param1:F1P}%攻击力",
        "第2段伤害{param2:F1P}%攻击力",
        "第3段伤害{param3:F1P}%攻击力",
        "第4段伤害{param4:F1P}%攻击力",
        "第5段伤害{param5:F1P}%攻击力",
        "重击伤害{param6:F1P}%攻击力"
      ]
    }]
  }
}
```

**分析步骤**：

1. **从paramDescList提取indexes**：

   - `{param1:F1P}` 对应第1段 → index 0
   - `{param2:F1P}` 对应第2段 → index 1
   - `{param3:F1P}` 对应第3段 → index 2
   - `{param4:F1P}` 对应第4段 → index 3
   - `{param5:F1P}` 对应第5段 → index 4
   - `{param6:F1P}` 对应重击 → index 5

2. **判断base属性**：

   - 所有paramDescList中都包含"攻击力"
   - 因此 base = "ATTACK"

3. **判断elementBonusType**：

   - 神里绫华是冰元素单手剑角色
   - 单手剑角色的普通攻击默认为物理类型
   - 因此 elementBonusType = "DMG_BONUS_PHYSICAL"

4. **判断attackBonusType**：

   - 这是普通攻击
   - 因此 attackBonusType = "DMG_BONUS_NORMAL"

5. **判断canOverride**：
   - 法器角色的普通攻击默认为元素伤害，不可覆盖
   - 因此 canOverride = false

**生成的配置**：

```javascript
{
  "damage": {
    "indexes": [0, 1, 2, 3, 4],
    "base": "ATTACK",
    "canOverride": true,
    "elementBonusType": "DMG_BONUS_PHYSICAL",
    "attackBonusType": "DMG_BONUS_NORMAL"
  }
}
```

### 示例4：处理带有buff的天赋

**输入数据**：

```json
{
  "skills": {
    "proudSkills": [{
      "name": {"cn_sim": "冰华"},
      "desc": {
        "cn_sim": "普通攻击与重击命中时，有50%概率对敌人施加冰元素附魔，持续3秒。"
      },
      "paramList": [0.5],
      "paramDescList": ["触发概率{param0:F1P}"]
    }]
  }
}
```

**分析步骤**：

1. **判断是否包含buff**：

   - desc中包含"施加"、"附魔"等关键词
   - 这是一个buff效果

2. **判断buff类型**：

   - "施加冰元素附魔" → 这是元素覆盖效果
   - 使用 `overrideElement` 字段

3. **从paramDescList判断indexes**：
   - `{param0:F1P}` 对应触发概率
   - 因此 index = 0

**生成的配置**：

```javascript
{
  "buffs": [{
    "index": 0,
    "overrideElement": "DMG_BONUS_CRYO",
    "target": [],
    "settingType": "switch",
    "defaultEnable": false
  }]
}
```

### 示例5：处理带有滑块层数的buff

**输入数据**：

```json
{
  "skills": {
    "proudSkills": [{
      "name": {"cn_sim": "冰莲护盾"},
      "desc": {
        "cn_sim": "每层获得5%攻击力提升，最多5层，持续8秒。"
      },
      "paramList": [0.05],
      "paramDescList": ["每层提升{param0:F1P}%攻击力"]
    }]
  }
}
```

**分析步骤**：

1. **判断是否需要滑块**：

   - desc中包含"每层"、"最多5层"
   - 这是一个需要滑块的buff

2. **从paramDescList判断indexes和target**：

   - `{param0:F1P}%攻击力` → index = 0, target = ["ATTACK_UP"]

3. **设置滑块参数**：
   - 初始值：0
   - 步长：1（每层）
   - 最大值：4（最多5层，从0开始计数）

**生成的配置**：

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["ATTACK_UP"],
    "settingType": "slider",
    "sliderInitialValue": 0,
    "sliderStep": 1,
    "sliderMax": 4
  }]
}
```

### 示例6：处理队伍buff

**输入数据**：

```json
{
  "skills": {
    "proudSkills": [{
      "name": {"cn_sim": "风神之眼"},
      "desc": {
        "cn_sim": "队伍中所有角色的风元素伤害提升15%。"
      },
      "paramList": [0.15],
      "paramDescList": ["风元素伤害提升{param0:F1P}%"]
    }]
  }
}
```

**分析步骤**：

1. **判断是否是队伍buff**：

   - desc中包含"队伍中所有角色"
   - 这是一个队伍buff

2. **判断buff类型**：

   - "风元素伤害提升" → target = ["DMG_BONUS_ANEMO"]

3. **设置isAllTeam标记**：
   - isAllTeam = true

**生成的配置**：

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["DMG_BONUS_ANEMO"],
    "customValue": 0.15,
    "settingType": "switch",
    "defaultEnable": false,
    "isAllTeam": true
  }]
}
```

## 常见问题

### Q1: 生成的配置不生效？

**A**: 检查以下几点：

1. indexes是否正确映射到paramDescList（不是paramList！）
2. base属性是否正确（ATTACK/HP/DEFENSE），根据paramDescList判断
3. elementBonusType和attackBonusType是否匹配技能类型（desc仅用于特殊情况）
4. canOverride是否根据武器类型和技能类型正确设置

**排查步骤**：

```bash
# 1. 导出该角色的解包数据
cd .claude/skills/genshin-data-generator/scripts
python3 export_data.py --type character --id 10000002

# 2. 打开导出的文件，对比 paramDescList 和生成的配置
# 检查：{paramX:F1P} 是否对应 indexes[X]

# 3. 查看 data.json 中的配置，检查常量名称是否正确
# 常量应该在 const.ts 中定义

# 4. 如果是特殊机制，检查是否需要添加标签
# 在 const.ts 的 PROPS_TAG_MAP 中查找该角色ID
```

### Q2: 如何处理新角色的特殊机制？

**A**:

1. 参考[游戏机制参考](references/game-mechanics.md)
2. 查看[高级配置指南](references/advanced-config.md)中的示例
3. 如果是新标签，在const.ts添加`PROP*TAG*`常量
4. 如果是新反应，在calculator.service.ts实现

**添加新标签的步骤**：

1. 在 const.ts 中定义标签常量（约 line 730）：

   ```typescript
   static readonly PROP_TAG_NEW_MECHANIC = 'NEW_MECHANIC';
   ```

2. 在 PROPS_TAG_MAP 中绑定角色ID（约 line 800）：

   ```typescript
   static readonly PROPS_TAG_MAP: Map<string, string[]> = new Map([
     ...
     ['1000XXXX', [Const.PROP_TAG_NEW_MECHANIC]],
     ...
   ]);
   ```

3. 在 data.json 配置中使用标签：

   ```javascript
   {
     "damage": {
       "tag": "NEW_MECHANIC",
       ...
     }
   }
   ```

4. 在 calculator.service.ts 中实现标签逻辑

### Q3: levelMap数据很大，会影响性能吗？

**A**: 不会！预处理脚本会移除levelMap，大幅减少文件大小。每次版本更新后务必先运行预处理。

**为什么需要预处理**：

- avatar_map.json 有约 90 个等级的数据 × 每个角色的技能
- 这会导致文件体积巨大（12MB+），且对配置生成无用
- 预处理脚本只保留核心字段（name, desc, paramList, paramDescList）
- 压缩率通常在 80-90%

### Q4: 配置是如何生成的？

**A**: 配置由 AI 根据预处理后的数据进行推理和分析后生成。

**配置生成流程**：

1. **数据预处理**：运行 `preprocess.py` 精简原始数据
2. **数据导出**：使用 `export_data.py` 导出目标角色/武器/圣遗物数据
3. **AI 分析**：
   - 分析 `paramDescList` 判断 `indexes` 映射关系
   - 分析 `desc` 判断特殊机制（buff、治疗、护盾等）
   - 根据武器类型和技能类型判断元素类型和攻击类型
   - 参考 `interface.ts` 和 `const.ts` 确保配置符合规范
4. **配置生成**：AI 生成符合规范的 JSON 配置
5. **手动验证**：将配置添加到 `data.json` 并在应用中验证

**AI 依赖的信息**：
- `paramDescList`：参数索引的核心依据
- `desc`：特殊机制判断的辅助依据
- `interface.ts`：配置结构和类型定义
- `const.ts`：常量和枚举定义
- 本 SKILL.md：配置生成指南

### Q5: paramDescList 和 desc 的区别是什么？

**A**:

- **paramDescList**：配置生成的核心依据

  - 用于判断 indexes 和 base 属性
  - 格式：`第1段伤害{param0:F1P}%攻击力`
  - `{paramX:F1P}` 表示参数索引 X
  - 后面的文本说明 base 属性

- **desc**：特殊情况判断的辅助依据
  - 用于判断特殊的伤害类型和元素类型
  - 用于判断是否包含治疗/护盾
  - 用于判断是否是队伍buff、是否需要滑块
  - 不能单独用来判断 indexes 和 base

**重要**：配置生成时，优先使用 paramDescList 判断，desc 仅用于特殊情况！

### Q6: 如何调试生成的配置？

**A**:

1. **验证 JSON 格式**：

   ```bash
   python3 -m json.tool src/assets/init/data.json
   ```

2. **在应用中测试**：

   - 打开浏览器开发者工具
   - 查看控制台是否有错误
   - 测试技能是否正确显示

3. **对比预期数值**：

   - 在游戏中记录技能的实际伤害
   - 在计算器中设置相同的面板属性
   - 对比计算结果

4. **检查日志**（如果启用了输出日志）：
   - 查看 calculator.service.ts 的调试输出
   - 确认每个乘区的计算过程

### Q7: 如何更新 i18n 翻译？

**A**:

i18n 的所有内容都从解包数据的 `desc` 字段中提取！

**更新步骤**：

1. 使用 `export_data.py` 导出新角色/武器/圣遗物的数据
2. 从导出的 JSON 中提取 `name` 和 `desc` 字段
3. 将提取的内容添加到对应的 i18n 文件中
4. 确保四种语言（cn_sim, cn_tra, en, jp）都添加

**示例**：

```json
// 从导出的数据中提取
{
  "name": {
    "cn_sim": "神里绫华",
    "cn_tra": "神里綾華",
    "en": "Kamisato Ayaka",
    "jp": "神里綾華"
  },
  "desc": {
    "cn_sim": "稻妻「社奉行」神里家的大小姐...",
    "cn_tra": "稻妻「社奉行」神里家的大小姐...",
    "en": "The daughter of the Yashiro Commission's Kamisato Clan...",
    "jp": "稲妻「社奉行」神里家のお嬢様..."
  }
}

// 添加到 i18n 文件中
{
  "CHARACTERS.10000002.NAME": "神里绫华",
  "CHARACTERS.10000002.DESC": "稻妻「社奉行」神里家的大小姐..."
}
```

## 技巧和最佳实践

### 1. paramDescList分析技巧

**重要**：配置生成的核心依据是`paramDescList`，而不是`desc`！

| paramDescList关键词       | 自动解析结果                  |
| ------------------------- | ----------------------------- |
| `{param0:F1P}%攻击力伤害` | indexes: [0], base: "ATTACK"  |
| `{param0:F1P}%生命值伤害` | indexes: [0], base: "HP"      |
| `{param0:F1P}%防御力伤害` | indexes: [0], base: "DEFENSE" |
| `{param0:F1P}%攻击力伤害` | indexes: [0], base: "ATTACK"  |
| 第1段伤害{param0:F1P}%    | indexes: [0]                  |
| 重击伤害{param1:F1P}%     | indexes: [1]                  |
| `{paramX:F1P}`后无说明    | base: "ATTACK"（默认）        |

**注意**：

- `paramDescList`中的`{paramX:F1P}`表示对应的参数
- 需要根据具体内容判断base属性（攻击力/生命值/防御力）
- desc只是对技能的整体描述，不能单独用来判断indexes和base

### 2. desc分析技巧（用于判断特殊情况）

| desc关键词                             | 判断结果                                                  |
| -------------------------------------- | --------------------------------------------------------- |
| "造成相当于普通攻击伤害的XXX%"         | attackBonusType: "DMG_BONUS_NORMAL"                       |
| "造成相当于元素技能伤害的XXX%"         | attackBonusType: "DMG_BONUS_SKILL"                        |
| "造成相当于元素爆发伤害的XXX%"         | attackBonusType: "DMG_BONUS_ELEMENTAL_BURST"              |
| "造成冰元素伤害"                       | elementBonusType: "DMG_BONUS_CRYO"                        |
| "造成火元素伤害"                       | elementBonusType: "DMG_BONUS_PYRO"                        |
| 法器角色的普通/重击/下落攻击（无说明） | canOverride: false, 元素类型为角色元素                    |
| 弓箭角色的满蓄力重击（无说明）         | canOverride: false, 元素类型为角色元素                    |
| 其他武器的普通攻击（无说明）           | canOverride: true, elementBonusType: "DMG_BONUS_PHYSICAL" |

**注意**：

- desc主要用于判断特殊的伤害类型和元素类型
- 正常情况下，attackBonusType根据技能类型判断，elementBonusType根据武器类型和技能类型判断

### 4. 特殊情况处理

**需要手动检查的场景**：

- 技能有多层嵌套效果
- buff有复杂条件（如"基于队友元素类型"）
- constellation的衍生伤害
- 特殊机制（如芙宁娜的Salon Solitaire）

## 测试和问题排查

### 配置未生效

1. 检查indexes是否正确映射到paramList
2. 检查base属性是否正确（ATTACK/HP/DEFENSE）
3. 检查elementBonusType和attackBonusType是否匹配

### JSON格式错误

1. 运行`python3 -m json.tool data.json`验证格式
2. 检查是否有缺少的逗号或引号

### 性能问题

如果解包数据文件太大导致上下文不足：

1. 桮保运行过预处理脚本
2. 检查processed_data.json大小（应该比原始数据小很多）

## 回滚和紧急修复

### 如果配置有问题

1. 使用 `export_data.py` 重新导出数据进行分析
2. 手动分析 `paramDescList` 和 `desc`
3. 参考 `interface.ts` 和 `const.ts` 重新生成配置
4. 验证修复

### 如果代码有问题

1. 回滚到上一个稳定提交：`git reset --hard HEAD~1`
2. 重新分析问题
3. 重新修改

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

## 扩展和定制

### 添加新的分析规则

当遇到新的游戏机制或特殊配置需求时：

1. 在 SKILL.md 中添加新的分析指南
2. 在 `archive/` 目录保存特殊配置示例
3. 更新 `references/` 目录下的参考文档

### 归档特殊配置

当遇到特殊配置（如新反应、新机制）时：

1. 在 `archive/vX.Y.Z/` 创建版本文件夹
2. 保存配置示例和推理过程
3. 添加 README 说明分析思路
4. 作为后续类似配置的参考

## 贡献指南

如果这个 Skill 对你有帮助，欢迎贡献改进：

1. 添加更多分析案例和示例
2. 完善配置生成指南
3. 优化预处理脚本性能
4. 改进数据导出格式

## 相关资源

- [interface.ts定义](../../src/app/shared/interface/interface.ts)
- [const.ts定义](../../src/app/shared/const/const.ts)
- [计算器服务](../../src/app/shared/service/genshin/calculator.service.ts)
