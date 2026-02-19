# 原神游戏机制参考

## 核心概念

### 计算乘区

原神伤害计算分为多个乘区，按特定顺序相乘：

```
最终伤害 = 基础伤害 × 倍率区 × (1+元素伤害加成区) × 元素反应倍率 × 抗性区 × 防御区 × 会心区
```

各乘区对应const.ts中的常量：

- **倍率区**: `PROP_DMG_RATE_UP_*`、`PROP_DMG_RATE_MULTI_*`
- **元素伤害加成区**: `PROP_DMG_BONUS_*`
- **元素反应倍率**: 在calculator.service.ts中计算
- **抗性区**: `PROP_DMG_ANTI_*`
- **防御区**: `PROP_DMG_ENEMY_DEFENSE_*`
- **会心区**: `PROP_CRIT_RATE`、`PROP_CRIT_DMG`

### 基础属性

游戏数据中的base属性含义：

- `ATTACK`: 攻击力（实际伤害计算中作为倍率基础）
- `HP`: 生命值
- `DEFENSE`: 防御力

### 参数类型

#### paramList

技能的数值参数列表，例如：

```json
"paramList": [50, 60, 70, 80, 90]
```

每个数字对应技能不同等级的倍率或效果值。

#### paramDescList

技能参数的描述文本，例如：

```json
"paramDescList": [
  "第1段{param0}%",
  "第2段{param1}%",
  "重击{param2}%"
]
```

**重要**：这是配置生成的核心依据！

- `{paramX:F1P}` 表示对应的参数
- `{paramX:F1P}` 后面的内容说明该参数的含义和base属性
- 例如：`{param0:F1P}%攻击力伤害` → indexes: [0], base: "ATTACK"
- 例如：`{param1:F1P}%生命值伤害` → indexes: [1], base: "HP"

**注意**：不能只看desc来判断配置，必须结合paramDescList来准确判断indexes和base属性！

#### paramMap

技能参数的映射关系，用于constellation等关联：

```json
"paramMap": {
  "paramList": [100, 200],
  "paramList_1": [50, 60]
}
```

---

## 元素反应详解

### 增幅反应（Amplified Reactions）

#### 1. 蒸发（VAPORIZE）

- 火打水：2.0倍
- 水打火：1.5倍
- 对应常量：`ELEMENT_VAPORIZE`

#### 2. 溶解（MELT）

- 火打冰：2.0倍
- 冰打火：1.5倍
- 对应常量：`ELEMENT_MELT`

#### 3. 超激化（SPREAD）

- 草元素：基于元素熟知：5 / (1 + 元素熟知/1200)
- 雷元素：基于元素熟知：5 / (1 + 元素熟知/1200)
- 对应常量：`ELEMENT_SPREAD`（概念上）

#### 4. 扩散（AGGRAVATE）

- 雷+水
- 伤害：基础等级倍率 × 2.75

#### 5. 超导（SUPERCONDUCT）

- 冰+雷
- 伤害：基础等级倍率 × 1.5
- 效果：降低40%物理抗性

#### 6. 感电（ELECTROCHARGED）

- 雷+水
- 伤害：基础等级倍率 × 2.0（每0.25秒一次）

#### 7. 开花（RUPTURE）

- 草+水
- 伤害：基础等级倍率 × 2.0

#### 8. 超绽放（HYPERBLOOM）

- 绽发+雷
- 伤害：基础等级倍率 × 3.0

#### 9. 燃烧（BURNING）

- 燃烧状态伤害：基础等级倍率 × 0.25

#### 10. 破碎（DESTRUCTION）

- 冰+风（风元素攻击使冰碎裂）
- 伤害：基础等级倍率 × 3.0

### 变色反应（Transformative Reactions）

#### 11. 月感电（MOON_ELECTROCHARGED）

- 纳西特定反应
- 对应常量：`ELEMENT_MOON_ELECTROCHARGED`

#### 12. 月绽放（MOON_RUPTURE）

- 纳西特定反应
- 对应常量：`ELEMENT_MOON_RUPTURE`

---

## Buff类型详解

### 1. 基础属性Buff

```javascript
{
  "target": ["ATTACK_UP"],
  "customValue": 0.3
}
```

- `ATTACK_UP`: 攻击力+30%
- `HP_UP`: 生命值+30%
- `DEFENSE_UP`: 防御力+30%
- `CRIT_RATE`: 会心率+X%
- `CRIT_DMG`: 会心伤害+X%

### 2. 伤害加成Buff

```javascript
{
  "target": ["DMG_BONUS_CRYO"],
  "customValue": 0.15
}
```

- `DMG_BONUS_CRYO`: 冰元素伤害+15%
- `DMG_BONUS_ALL`: 全伤害+X%
- `DMG_BONUS_SKILL`: 元素技能伤害+X%

### 3. 伤害倍率Buff

```javascript
{
  "target": ["DMG_RATE_UP_SKILL"],
  "customValue": 0.2
}
```

- `DMG_RATE_UP_*`: 某类技能伤害倍率+20%
- `DMG_RATE_MULTI_*`: 某类技能伤害倍率×X（乘法）

### 4. 特殊标签Buff

**注意**：特殊标签系统用于区分技能内部多种不同类型的伤害倍率，不是特殊机制！

某些角色的一个技能内部包含多种不同类型的伤害，需要通过标签系统来区分，例如：

- `RAZOR_SOUL_COMPANION`: 雷泽的灵魂伴侣伤害
- `VENTI_SKILL_PRESS`: 温迪的蓄力长按伤害
- `FURINA_SALON_SOLITAIRE`: 芙宁娜的沙龙独舞伤害

这些标签在const.ts中定义：

```javascript
static readonly PROP_TAG_RAIDEN_ITTOU = 'RAIDEN_ITTOU';
static readonly PROP_TAG_RAZOR_SOUL_COMPANION = 'RAZOR_SOUL_COMPANION';
```

**使用场景**：

- 一个技能的paramList包含多个伤害倍率，但类型不同
- 需要通过`tag`字段来区分不同的伤害计算逻辑
- 例如：温迪的元素技能，点按伤害和蓄力伤害是不同的倍率

### 5. 元素覆盖Buff

```javascript
{
  "index": 2,
  "overrideElement": "DMG_BONUS_CRYO",
  "target": [],
  "settingType": "switch"
}
```

- 将普通攻击的元素从物理改为冰元素
- 常用于重云、优菈等角色

### 6. 治疗Buff

```javascript
{
  "healing": {
    "index": 0,
    "base": "HP",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

- `HEALING_BONUS_SKILL`: 元素技能治疗加成
- `HEALING_BONUS_ELEMENTAL_BURST`: 元素爆发治疗加成
- base通常是`HP`或`ATTACK`

### 7. 护盾Buff

```javascript
{
  "shield": {
    "index": 0,
    "base": "HP",
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "CRYO"
  }
}
```

- `SHIELD_BONUS_SKILL`: 元素技能护盾加成
- `shieldElementType`: 护盾的元素类型

---

## 特殊机制说明

### 1. 会心独立区

某些角色的技能有独立的会心计算，例如：

- `DMG_CRIT_RATE_UP_NORMAL`: 普通攻击会心率+X%
- `DMG_CRIT_DMG_UP_SKILL`: 元素技能会心伤害+X%

### 2. 混合倍率区

某些效果同时影响多个乘区，需要正确定义：

- `DMG_RATE_MULTI_ELEMENTAL_BURST`: 元素爆发倍率×X
- `DMG_RATE_UP_ELEMENTAL_BURST`: 元素爆发倍率+X%

### 3. 条件Buff

某些Buff只在特定条件下生效，例如：

- `isAllTeam`: true: 对全队生效
- `teamElementTypeLimit`: ["PYRO", "HYDRO"]: 只在有火/水队友时生效
- `weaponTypeLimit`: ["WEAPON_POLE"]: 只对长柄武器生效
- `selfElementTypeLimit`: true: 只对自身某元素生效

### 4. 计算队列

用于复杂的多步计算，例如：

```javascript
"finalResCalQueue": [
  {
    "relation": "*",
    "inner": [
      {
        "relation": "+",
        "variable": "VAR_CHARA_2"
      }
    ]
  }
]
```

表示：最终结果 × (1 + VAR_CHARA_2)

### 5. 衍生伤害（Origin Skills）

constellation的效果可能衍生自其他技能：

```javascript
{
  "originSkills": ["elementalBurst"],
  "originIndexes": [0],
  "originRelations": ["*"],
  "indexes": [0]
}
```

表示：元素爆发的第0段 × 自身倍率

---

## 武器精炼详解

### skillAffixMap结构

```json
{
  "skillAffixMap": {
    "11": {
      "name": "追忆捕手",
      "desc": "...",
      "paramValidIndexes": [1, 2, 3],
      "paramList": [120, 150, 180, 210, 240],
      "addProps": [
        {
          "propType": "FIGHT_PROP_ATTACK",
          "value": 0.04
        }
      ]
    }
  }
}
```

### 解析规则

- `paramValidIndexes`: 指定paramList中哪些参数有效
  - 例如`[1, 2, 3]`表示paramList[1]、paramList[2]、paramList[3]分别对应精1、精2、精3、精4
- `paramList`: 对应精炼等级1-5的数值
- `addProps`: 基础属性加成（如攻击力+4%）

---

## 圣遗物套装详解

### setAffixes结构

```json
{
  "setAffixes": [
    {
      "name": "翠绿之影",
      "desc": "获得的元素能量提高20%...",
      "paramList": [80, 100],
      "paramValidIndexes": [0, 1]
    },
    {
      "name": "翠绿之影",
      "desc": "施放元素爆发后的8秒内...",
      "paramList": [10, 15],
      "addProps": [
        {
          "propType": "FIGHT_PROP_ELEMENT_MASTERY",
          "value": 50
        }
      ]
    }
  ]
}
```

### 两件套与四件套

- 第一个元素：两件套效果（对应setAffixes[0]）
- 第二个元素：四件套效果（对应setAffixes[1]）

---

## 常见分析模式

### 1. paramDescList分析（核心依据）

**重要**：paramDescList是配置生成的核心依据，用于判断indexes和base属性！

| paramDescList关键词       | 配置结果                      |
| ------------------------- | ----------------------------- |
| `{param0:F1P}%攻击力伤害` | indexes: [0], base: "ATTACK"  |
| `{param1:F1P}%生命值伤害` | indexes: [1], base: "HP"      |
| `{param2:F1P}%防御力伤害` | indexes: [2], base: "DEFENSE" |
| 第1段伤害{param0:F1P}%    | indexes: [0]                  |
| 重击伤害{param1:F1P}%     | indexes: [1]                  |
| 元素伤害{param2:F1P}%     | indexes: [2]                  |
| `{paramX:F1P}`后无说明    | base: "ATTACK"（默认）        |

**判断规则**：

- `{paramX:F1P}` 表示对应的参数索引X
- 后面的内容说明base属性（攻击力/生命值/防御力）
- 如果没有明确说明，默认为攻击力

### 2. desc分析（特殊情况判断）

desc主要用于判断特殊情况，不是配置生成的核心依据！

#### 2.1 数值描述（Buff相关）

- "攻击力的30%" → `target: ["ATTACK_UP"], customValue: 0.3`
- "造成150%攻击力的伤害" → `customValue: 1.5, base: "ATTACK"`

#### 2.2 百分比描述（Buff相关）

- "攻击力提高20%" → `target: ["ATTACK_UP"], customValue: 0.2`
- "伤害提升15%" → `target: ["DMG_BONUS_ALL"], customValue: 0.15`

#### 2.3 元素类型描述（特殊情况判断优先级最高）

- "造成冰元素伤害" → `elementBonusType: "DMG_BONUS_CRYO"`
- "普通攻击造成火元素伤害" → `attackBonusType: "DMG_BONUS_NORMAL", elementBonusType: "DMG_BONUS_PYRO"`

#### 2.4 技能类型描述（特殊情况判断）

- "造成相当于普通攻击伤害的XXX%" → `attackBonusType: "DMG_BONUS_NORMAL"`
- "造成相当于元素技能伤害的XXX%" → `attackBonusType: "DMG_BONUS_SKILL"`
- "造成相当于元素爆发伤害的XXX%" → `attackBonusType: "DMG_BONUS_ELEMENTAL_BURST"`

**注意**：正常情况下，attackBonusType根据技能类型判断（普通攻击→DMG_BONUS_NORMAL等），desc中的描述仅用于特殊情况。

#### 2.5 条件描述（Buff相关）

- "每有1个...类型队友" → 需要teamElementTypeLimit
- "处于...状态下" → 可能需要特殊的condition检查
- "在...秒内" → 需要持续时间逻辑（通常在前端实现）

#### 2.6 多层效果（Buff相关）

- "每层增加...，最多5层" → 需要slider配置
- "每1层增加...，最多X层" → `sliderMax: X-1`
- "基于...的层数" → 需要slider配置
- "每1层增加...，最多X层" → `sliderMax: X-1`
