---
name: genshin-data-generator
description: 生成原神角色伤害计算器的data.json配置文件。从游戏解包数据提取信息，根据interface.ts和const.ts生成配置JSON，支持角色、武器、圣遗物的配置生成，并提供新版本更新的修改指南。
---

# 原神数据配置生成器

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
│   └── generated_configs/       # 自动生成的配置文件
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

使用此Skill进行版本更新时，按以下流程操作：

### 1. 数据预处理（首次或大版本更新）

```bash
cd .claude/skills/genshin-data-generator/scripts
python3 preprocess.py
```

这将从解包数据中提取核心信息，去除levelmap等无用数据，生成`output/processed_data.json`。

**输出示例**：

```
开始预处理数据...
  输入目录: /Users/gbd/Project/Genshin-Calc/src/assets/genshin
  输出文件: /Users/gbd/Project/Genshin-Calc/.claude/skills/genshin-data-generator/output/processed_data.json
  处理角色数据...
  处理武器数据...
  处理圣遗物数据...

预处理完成！
原始avatar_map.json: 12.34 MB
原始weapon_map.json: 13.56 MB
输出processed_data.json: 3.21 MB
压缩率: 87.21%
```

### 2. 生成data.json配置

**生成单个角色配置**：

```bash
cd .claude/skills/genshin-data-generator/scripts
python3 generate_config.py --character 10000002
```

**生成所有角色配置**：

```bash
python3 generate_config.py --all --type character
```

**生成所有武器配置**：

```bash
python3 generate_config.py --all --type weapon
```

**生成所有圣遗物配置**：

```bash
python3 generate_config.py --all --type artifact
```

### 3. 导出特定ID数据

当需要参考某个特定角色/武器/圣遗物的解包数据时：

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

**输出示例**（角色数据导出）：

```
加载预处理数据...
角色 10000002 (神里绫华) 数据已导出到: output/exports/character_10000002.json

基本信息:
  - 名称: 神里绫华
  - 武器类型: WEAPON_SWORD_ONE_HAND
  - 品质: QUALITY_ORANGE

技能概览:
  - normal: 2 个技能
  - skill: 2 个技能
  - elementalBurst: 1 个技能
  - proudSkills: 3 个技能
  - constellation: 6 个技能

导出完成！
```

数据将导出到 `output/exports/` 目录，方便参考和对比。

### 4. 检查未实现数据

了解哪些数据尚未实现：

**检查所有未实现的数据**：

```bash
cd .claude/skills/genshin-data-generator/scripts
python3 check_unimplemented.py --type all
```

**只检查未实现的角色**：

```bash
python3 check_unimplemented.py --type character
```

**只检查未实现的武器**：

```bash
python3 check_unimplemented.py --type weapon
```

**只检查未实现的圣遗物**：

```bash
python3 check_unimplemented.py --type artifact
```

**输出示例**：

```
加载预处理数据...

============================================================
角色实现情况
============================================================

解包数据中的角色总数: 95
data.json中已实现的角色数: 85
未实现的角色数: 10
多余的角色数: 0

未实现的角色 (10):
------------------------------------------------------------
  [10000080] 赛诺 (武器: WEAPON_POLE, 品质: QUALITY_ORANGE)
  [10000081] 坎蒂丝 (武器: WEAPON_POLE, 品质: QUALITY_PURPLE)
  ...

未实现角色列表已导出到: output/unimplemented_characters.txt

============================================================
检查完成
============================================================
```

检查结果会显示在控制台，并导出到 `output/unimplemented_*.txt` 文件。

### 5. 更新相关文件

根据[更新检查清单](references/update-checklist.md)判断是否需要修改interface.ts、const.ts、calculator.service.ts。

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

  **重要**：技能的`desc`字段包含完整的技能描述，包括技能之间的联动信息。例如，某些命座效果会基于其他技能的参数，需要仔细阅读desc理解联动关系。

- **weapon_map.json** (13MB): 武器数据

  - `name`: 武器名称（多语言）
  - `desc`: 武器描述（多语言）
  - `skillAffixMap`: 武器精炼效果
  - 关键字段：`name`, `desc`, `paramList`, `paramValidIndexes`, `addProps`

- **reliquary_set_map.json** (92KB): 圣遗物套装数据
  - `setName`: 套装名称（多语言）
  - `setAffixs`: 套装效果（2件套、4件套）
  - 关键字段：`setName`, `name`, `desc`, `paramList`, `paramValidIndexes`, `addProps`

**重要**: levelmap字段在每个角色中有90个等级的数据（1-90级），这些数据在配置生成时完全无用，预处理时会移除以节省上下文。

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

**重要**：PROP*DMG*开头的常量是伤害计算的核心，涉及新反应、新伤害乘区、所有伤害、盾、治疗、生成物HP计算！

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

##### 1. 元素类型常量（ELEMENT\_\*）

- `ELEMENT_PYRO`: 火元素
- `ELEMENT_HYDRO`: 水元素
- `ELEMENT_ANEMO`: 风元素
- `ELEMENT_ELECTRO`: 雷元素
- `ELEMENT_CRYO`: 冰元素
- `ELEMENT_GEO`: 岩元素
- `ELEMENT_DENDRO`: 草元素
- `ELEMENT_PHYSICAL`: 物理元素

##### 2. 伤害加成常量（PROP*DMG_BONUS*\*）

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

##### 3. 伤害倍率常量（PROP*DMG_RATE*\*）

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

##### 4. 伤害抗性常量（PROP*DMG_ANTI*\*）

**抗性提升**：

- `PROP_DMG_ANTI_CRYO`: 冰元素抗性提升
- `PROP_DMG_ANTI_*`: 各元素抗性提升

**抗性降低（针对怪物）**：

- `PROP_DMG_ANTI_CRYO_MINUS`: 冰元素抗性降低
- `PROP_DMG_ANTI_*_MINUS`: 各元素抗性降低
- `PROP_DMG_ANTI_ALL_MINUS`: 全元素抗性降低

**用途**：用于超导反应（减物理抗性）或者各种角色技能，天赋，命座中的效果来降低敌人抗性

##### 5. 伤害数值常量（PROP*DMG_VAL_UP*\*）

直接提升伤害计算中的基础区数值（不是百分比）：

- `PROP_DMG_VAL_UP_*`: 某类技能伤害数值提升

##### 6. 会心相关常量（PROP*DMG_CRIT*\*）

**会心伤害提升**：

- `PROP_DMG_CRIT_DMG_UP_*`: 某类技能会心伤害提升

**会心独立区**：

- `PROP_DMG_CRIT_RATE_UP_*`: 某类技能会心率提升

##### 7. 治疗加成常量（PROP*HEALING*\*）

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

##### 8. 护盾加成常量（PROP*SHIELD*\*）

**护盾加成类型**：

- `PROP_DMG_ELEMENT_SHIELD_UP`: 护盾强效加成（针对所有类型护盾）
- `PROP_SHIELD_BONUS_NORMAL`: 普通攻击创造的护盾强效加成
- `PROP_SHIELD_BONUS_SKILL`: 元素技能创造的护盾强效加成
- `PROP_SHIELD_BONUS_ELEMENTAL_BURST`: 元素爆发创造的护盾强效加成
- `PROP_SHIELD_BONUS_WEAPON`: 武器创造的护盾强效加成
- `PROP_SHIELD_BONUS_OTHER`: 其他护盾强效加成
- `PROP_SHIELD_BONUS_SET`: 圣遗物套装创造的护盾强效加成

##### 9. 特殊标签常量（PROP*TAG*\*）

用于区分技能内部不同类型的伤害：

- `PROP_TAG_RAZOR_SOUL_COMPANION`: 雷泽的灵魂伴侣伤害
- `PROP_TAG_VENTI_SKILL_PRESS`: 温迪的蓄力长按伤害
- `PROP_TAG_FURINA_SALON_SOLITAIRE`: 芙宁娜的沙龙独舞伤害
- 等等...

**重要**：特殊标签系统用于区分技能内部多种不同类型的伤害，不是特殊机制！

##### 10. 基础属性常量（PROP\_\*）

**基础属性**：

- `PROP_HP_BASE`: 生命值基础（被生命加成百分比增益）
- `PROP_HP_BASE_EXTRA`: 生命值基础（额外加成）
- `PROP_ATTACK_BASE`: 攻击力基础（被攻击力加成百分比增益）（部分buff计算使用）
- `ATTACK_BASE_EXTRA`: 攻击力基础（额外加成）
- `PROP_DEFENSE_BASE`: 防御力基础（被防御力加成百分比增益）
- `DEFENSE_BASE_EXTRA`: 防御力基础（额外加成）

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

##### 12. 变量常量（PORP*VAR*\*）

用于计算队列中的变量：

- `PROP_VAR_CHARA_1` ~ `PROP_VAR_CHARA_8`: 角色变量1-8
- `PROP_VAR_SET_1`, `PROP_VAR_SET_2`: 套装变量1-2
- `PROP_VAR_WEAPON_1`, `PROP_VAR_WEAPON_2`: 武器变量1-2

**用途**：用于复杂的计算队列（finalResCalQueue），例如：

- 某些Buff的效果基于队友属性
- 某些技能的伤害基于叠加层数
- 某些效果需要中间变量计算

##### 13. 常量使用规则（两大组选择）

**第一组：根据elementBonusType选择（元素类型）**

- `PROP_DMG_RATE_UP_CRYO/...`: 元素倍率提升
- `PROP_DMG_RATE_MULTI_CRYO/...`: 元素倍率倍乘
- `PROP_DMG_BONUS_CRYO/...`: 元素伤害加成
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
- **特殊**：防御降低和防御忽略常量（如`PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL`）

**重要**：一个伤害总是同时具备两个分类（元素类型和攻击类型），两组常量互不冲突！

**全局常量**：

- `PROP_DMG_RATE_UP_ALL`: 全局倍率提升
- `PROP_DMG_RATE_MULTI_ALL`: 全局倍率倍乘
- `PROP_DMG_BONUS_ALL`: 全伤害加成
- `PROP_DMG_VAL_UP_ALL`: 全局伤害数值提升
- `PROP_DMG_CRIT_RATE_UP_ALL`: 全局会心率提升
- `PROP_DMG_CRIT_DMG_UP_ALL`: 全局会心伤害提升

#### 版本更新场景

1. **新元素反应**：

   - 在calculator.service.ts实现新反应的计算逻辑，同时需要对interface.ts进行更新
   - 在i18n文件中添加翻译

2. **新伤害乘区**：

   - 根据需要，添加新的伤害加成常量（`PROP_DMG_BONUS_*`）
   - 根据需要，添加新的倍率提升/倍乘常量（`PROP_DMG_RATE_UP*_` / `PROP_DMG_RATE_MULTI_*`）

3. **新特殊标签**：

   - 根据需要，添加新标签常量（`PROP_TAG_*`）
   - 用于区分技能内部不同类型的伤害

4. **新Buff类型**：

   - 添加新的属性提升常量（如：`PROP_*_UP`）
   - 添加新的伤害数值常量（如：`PROP_DMG_VAL_UP_*`）

5. **新武器类型**：

   - 不存在武器类型追加与更新

#### 使用示例

```javascript
// 1. 伤害配置中的使用
{
  "elementBonusType": "DMG_BONUS_CRYO",  // 使用第一组常量（元素类型）
  "attackBonusType": "DMG_BONUS_NORMAL",  // 使用第二组常量（攻击类型）
}

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

这些PROP*DMG*常量是伤害计算的**核心**，它们：

1. 定义了所有可能的伤害类型和加成方式
2. 支持新元素反应和新伤害乘区的快速添加
3. 覆盖伤害、护盾、治疗、生成物HP计算的所有场景
4. 与Buff系统紧密关联，决定了哪些属性可以被Buff影响

**示例：新元素反应添加流程**

当游戏添加新元素反应（假设是"风火反应"）时：

1. 在const.ts添加新反应的倍率常量：

```typescript
static readonly PROP_DMG_RATE_MULTI_WIND_FIRE = 'DMG_RATE_MULTI_WIND_FIRE';
```

2. 在calculator.service.ts实现新反应的计算逻辑

3. 在data.json中使用新常量：

```javascript
{
  "target": ["DMG_RATE_MULTI_WIND_FIRE"],
  "customValue": 1.5  // 风火反应1.5倍
}
```

4. 在i18n文件中添加翻译（从解包数据的desc提取）

这就是为什么PROP*DMG*常量如此重要的原因：它们是连接数据配置、代码逻辑和用户界面的核心纽带。

### 技能伤害配置

**重要**：技能配置的核心依据是`paramDescList`，而不是`desc`！`desc`只是对技能本身的描述，需要结合`paramDescList`来判断参数如何与indexes映射。

#### 1. indexes映射

```javascript
"indexes": [0, 1, 2, 3, 6]
```

**判断方法**：

- 通过`paramDescList`判断每个param对应什么
- `paramDescList`中的格式通常是：`技能伤害|{param1:F1P}`
- 从中提取出`{param0}`、`{param1}`等对应关系
- 例如：普通攻击1-5段为`[param0, param1, param2, param3, param4]`，重击为`param5`，则Indexes分别对应`[0,1,2,3,4]`与`[5]`

**示例**：

```
paramDescList: [
  "{param0:F1P}%攻击力",
  "{param1:F1P}",
  "重击{param2:F1P}%攻击力伤害"
]
```

则indexes分别为`[0, 1, 2]`

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
   - 是特殊的反应元素伤害，使用`specialDamageType`来指定的同时根据实际描述来判断是什么类型，多数为`DMG_BONUS_OTHER`类型

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

- `true`: 可以被元素附魔覆盖（通常是物理伤害）
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

4. **元素技能、元素爆发**：
   - `false`（通常是元素伤害）

## 工作流程详解

详见[完整工作流程](references/workflow.md)

## 常见更新场景

### 新角色

1. 运行预处理脚本
2. 生成角色配置
3. 根据desc手动调整特殊机制
4. 检查是否需要添加新常量/接口

### 新武器

1. 生成武器配置
2. 默认skillAffixMap的paramValidIndexes

### 新圣遗物套装

1. 生成套装配置
2. 确认setAffixes的addProps映射

### 新反应/新机制

1. 在const.ts添加新常量
2. 在calculator.service.ts添加计算逻辑
3. 在interface.ts添加新接口或者值
4. 生成对应配置

## 进阶功能

- 特殊标签处理（VENTI_SKILL_PRESS等）- 用于区分技能内部不同类型的伤害倍率
- constellation衍生伤害配置
- displayCalQueue计算队列
- finalResCalQueue最终计算队列

**注意**：特殊标签系统用于区分技能内部多种不同类型的伤害，不是特殊机制！

详见[高级配置指南](references/advanced-config.md)

## 实际使用示例

### 示例1：生成单个角色配置

```bash
# 1. 运行预处理（首次运行或大版本更新）
cd .claude/skills/genshin-data-generator/scripts
python3 preprocess.py

# 2. 生成单个角色配置
python3 generate_config.py --character 10000002

# 3. 查看生成的配置
# 输出会在控制台显示，可以复制到 data.json 中
```

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
        "第1段伤害{param0:F1P}%攻击力",
        "第2段伤害{param1:F1P}%攻击力",
        "第3段伤害{param2:F1P}%攻击力",
        "第4段伤害{param3:F1P}%攻击力",
        "第5段伤害{param4:F1P}%攻击力",
        "重击伤害{param5:F1P}%攻击力"
      ]
    }]
  }
}
```

**分析步骤**：

1. **从paramDescList提取indexes**：

   - `{param0:F1P}` 对应第1段 → index 0
   - `{param1:F1P}` 对应第2段 → index 1
   - `{param2:F1P}` 对应第3段 → index 2
   - `{param3:F1P}` 对应第4段 → index 3
   - `{param4:F1P}` 对应第5段 → index 4
   - `{param5:F1P}` 对应重击 → index 5

2. **判断base属性**：

   - 所有paramDescList中都包含"攻击力"
   - 因此 base = "ATTACK"

3. **判断elementBonusType**：

   - 神里绫华是冰元素法器角色
   - 法器角色的普通攻击默认为角色元素
   - 因此 elementBonusType = "DMG_BONUS_CRYO"

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
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_CRYO",
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
3. 如果是新标签，在const.ts添加`PROP*TAG*\*`常量
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

### Q4: 需要手动编写所有配置吗？

**A**: 不需要！

- 基础配置自动生成
- 特殊机制需要手动调整
- 约80%以上的配置可以自动生成

**自动生成的内容**：

- 普通的伤害配置（根据 paramDescList）
- 基础的 buff 配置（根据 desc 关键词）
- 武器精炼效果配置
- 圣遗物套装效果配置

**需要手动调整的内容**：

- 特殊标签（如温迪的蓄力）
- 复杂的计算队列（finalResCalQueue）
- 衍生伤害（constellation 的 originSkills）
- 复杂的 buff 条件（元素类型限制、武器类型限制等）

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

1. 重新生成问题配置：`python3 generate_config.py --character <ID>`
2. 手动调整生成的JSON
3. 验证修复

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

### 添加新的desc关键词映射

编辑`scripts/generate_config.py`中的`parse_desc_keywords`函数。

### 修改元素映射

编辑`scripts/generate_config.py`中的`ELEMENT_MAP`字典。

### 添加新的配置模板

参考`references/advanced-config.md`中的示例，在`generate_config.py`中添加新的配置生成逻辑。

## 贡献指南

如果这个Skill对你有帮助，欢迎贡献改进：

1. 添加更多desc关键词的自动识别
2. 完善特殊机制的配置模板
3. 添加更多游戏机制参考
4. 改进脚本错误处理

## 相关资源

- [interface.ts定义](../../src/app/shared/interface/interface.ts)
- [const.ts定义](../../src/app/shared/const/const.ts)
- [计算器服务](../../src/app/shared/service/genshin/calculator.service.ts)

```

```
