# 原神数据配置分析指南

本文档说明如何从游戏解包数据中推断并生成 data.json 中的各种配置。

## 分析数据统计

| 配置类型 | 数量 | 说明 |
|---------|------|------|
| **Damage - Basic** | 707 | 基础伤害配置（只有 indexes） |
| **Damage - Origin** | 22 | 参考其他技能的伤害 |
| **Damage - Attach** | 11 | 带额外倍率的伤害 |
| **Damage - Display Queue** | 3 | 带显示控制队列 |
| **Damage - Final Queue** | 58 | 带最终计算队列 |
| **Damage - Tag** | 58 | 带特殊标签 |
| **Damage - Special** | 3 | 特殊伤害类型（月反应） |
| **Damage - Custom** | 4 | 自定义倍率 |
| **Buff** | 168 | 增益配置 |
| **Healing** | 46 | 治疗配置 |
| **Shield** | 20 | 护盾配置 |

## 1. 基础伤害配置 (Basic Damage)

### 配置结构
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

### 从源数据推断规则

**步骤 1**：分析 `paramDescList` 获取 `indexes`

```python
# 源数据示例 (神里绫华 - 普通攻击)
paramDescList = [
  "一段伤害|{param1:F1P}",
  "二段伤害|{param2:F1P}",
  "三段伤害|{param3:F1P}",
  "四段伤害|{param4:F1P}",
  "重击循环伤害|{param5:F1P}",
  "重击终结伤害|{param6:F1P}",
  "重击体力消耗|每秒{param7:F1P}点",
  "最大持续时间|{param8:F1}秒",
  "下坠期间伤害|{param9:F1P}",
  "低空/高空坠地冲击伤害|{param10:P}/{param11:P}"
]
```

**推断规则**：
- 从 `{paramX:F1P}` 提取参数号 X
- 转换为数组索引：`index = X - 1`（因为数组从 0 开始）
- 例如：`{param1:F1P}` → `indexes: [0]`

```javascript
// 结果
indexes = [0, 1, 2, 3]  // 第1-4段伤害
```

**步骤 2**：从 `paramDescList` 判断 `base`

| 描述中包含 | base |
|-----------|------|
| "攻击力" | "ATTACK" |
| "生命值" | "HP" |
| "防御力" | "DEFENSE" |
| "元素精通" | "ELEMENTAL_MASTERY" |

**步骤 3**：判断 `canOverride`

| 技能类型 | 武器类型 | canOverride |
|---------|---------|--------------|
| normal (普通攻击) | 非法器 | true |
| normal (普通攻击) | 法器 | false |
| charged (重击) | 非法器 | true |
| charged (重击) | 法器 | false |
| plunging (下落) | 非法器 | true |
| plunging (下落) | 法器 | false |
| skill / elementalBurst | 全部 | false |

**步骤 4**：判断 `elementBonusType`

- **法器角色的普通/重击/下落**：从技能描述中查找元素关键词
- **其他武器的普通攻击**：`DMG_BONUS_PHYSICAL`
- **skill / elementalBurst**：从技能描述中查找元素关键词

元素关键词映射：
- "火元素" → `DMG_BONUS_PYRO`
- "水元素" → `DMG_BONUS_HYDRO`
- "风元素" → `DMG_BONUS_ANEMO`
- "雷元素" → `DMG_BONUS_ELECTRO`
- "冰元素" → `DMG_BONUS_CRYO`
- "岩元素" → `DMG_BONUS_GEO`
- "草元素" → `DMG_BONUS_DENDRO`

**步骤 5**：判断 `attackBonusType`

| 技能类型 | attackBonusType |
|---------|-----------------|
| normal | DMG_BONUS_NORMAL |
| charged | DMG_BONUS_CHARGED |
| plunging | DMG_BONUS_PLUNGING |
| skill | DMG_BONUS_SKILL |
| elementalBurst | DMG_BONUS_ELEMENTAL_BURST |
| other | DMG_BONUS_OTHER |

---

## 2. 参考技能伤害配置 (Origin Skills)

### 配置结构
```javascript
{
  "damage": {
    "originSkills": ["normal"],
    "originIndexes": [0],
    "originRelations": ["*"],
    "indexes": [1],
    "base": "ATTACK",
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_ELECTRO",
    "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST",
    "tag": "RAZOR_SOUL_COMPANION"
  }
}
```

### 从源数据推断规则

**示例：雷泽元素爆发 - 狼魂伤害**

**源数据**：
```
paramDescList[1] = "狼魂伤害|{param2:F1P}普通攻击伤害"
```

**推断步骤**：

1. **提取当前技能的 `indexes`**：
   - `{param2:F1P}` → `indexes: [1]`

2. **识别参考技能**：
   - "普通攻击伤害" → 参考 `normal` 技能

3. **提取 `originIndexes`**：
   - 从 normal 的 `paramDescList` 找到"一段伤害|{param1:F1P}"
   - `{param1:F1P}` → `originIndexes: [0]`

4. **确定 `originRelations`**：
   - 如果描述是"X%普通攻击伤害" → `originRelations: ["*"]`（乘法）

5. **确定 `tag`**：
   - 从技能名或技能描述中推断（如"雷狼"、"狼魂" → `RAZOR_SOUL_COMPANION`）

---

## 3. 复合倍率伤害配置 (Indexes Attach)

### 配置结构
```javascript
{
  "damage": {
    "indexes": [2],
    "indexesAttach": [[3]],
    "base": "ATTACK",
    "baseAttach": ["ELEMENTAL_MASTERY"],
    "elementBonusType": "DMG_BONUS_DENDRO",
    "attackBonusType": "DMG_BONUS_SKILL",
    "tag": "NAHIDA_TRI_KARMA"
  }
}
```

### 从源数据推断规则

**示例：纳西妲元素战技 - 灭净三业伤害**

**源数据**：
```
paramDescList[2] = "灭净三业伤害|{param3:F1P}攻击力+{param4:F1P}元素精通"
```

**推断步骤**：

1. **提取主要倍率**：
   - `{param3:F1P}攻击力` → `indexes: [2]`
   - `base: "ATTACK"`

2. **提取额外倍率**：
   - `+{param4:F1P}元素精通` → `indexesAttach: [[3]]`
   - `baseAttach: ["ELEMENTAL_MASTERY"]`

3. **计算公式**：
   ```
   伤害 = (param[2] * 攻击力) + (param[3] * 元素精通)
   ```

---

## 4. 显示控制队列 (DisplayCalQueue)

### 配置结构
```javascript
{
  "damage": {
    "indexes": [1],
    "base": "ATTACK",
    "canOverride": false,
    "displayCalQueue": [
      {
        "relation": "+",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_1"
          }
        ]
      }
    ],
    "elementBonusType": "DMG_BONUS_ANEMO",
    "attackBonusType": "DMG_BONUS_PLUNGING"
  }
}
```

### 推断规则

- **用途**：控制伤害是否显示（只有 `displayCalQueue` 结果 > 0 时才显示）
- **`relation`**: `"+"` 表示加法
- **`variable`**: 使用角色变量（VAR_CHARA_X）

---

## 5. 最终计算队列 (FinalResCalQueue)

### 配置结构
```javascript
{
  "damage": {
    "indexes": [0],
    "base": "ATTACK",
    "finalResCalQueue": [
      {
        "relation": "*",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_1"
          }
        ]
      }
    ],
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_PYRO",
    "attackBonusType": "DMG_BONUS_SKILL"
  }
}
```

### 推断规则

- **用途**：对最终伤害进行额外计算
- **计算公式**：`最终伤害 = 基础伤害 * (1 + VAR_CHARA_1)`

---

## 6. 治疗配置 (Healing)

### 配置结构
```javascript
{
  "healing": {
    "index": 0,
    "constIndex": 1,
    "constCalRelation": "+",
    "base": "HP",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

### 从源数据推断规则

**源数据示例**：
```
paramDescList[0] = "治疗量1|{param1:F1P}生命值+{param2:I}"
```

**推断步骤**：

1. **主要倍率**：
   - `{param1:F1P}` → `index: 0`

2. **固定值**：
   - `+{param2:I}` → `constIndex: 1`

3. **base 判断**：
   - "生命值" → `base: "HP"`

4. **计算关系**：
   - `"+"` → `constCalRelation: "+"`
   - 公式：`治疗量 = param[0] * HP + param[1]`

---

## 7. 护盾配置 (Shield)

### 配置结构
```javascript
{
  "shield": {
    "index": 0,
    "constIndex": 1,
    "constCalRelation": "+",
    "base": "HP",
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "PYRO"
  }
}
```

### 从源数据推断规则

与治疗配置类似：
- `index`：护盾倍率参数
- `constIndex`：固定值参数
- `base`：护盾基础属性
- `shieldElementType`：从技能描述中推断元素类型

---

## 8. 增益配置 (Buff)

### 配置结构
```javascript
// Switch 类型
{
  "buff": {
    "index": 2,
    "overrideElement": "DMG_BONUS_CRYO",
    "target": [],
    "settingType": "switch",
    "defaultEnable": false
  }
}

// Slider 类型
{
  "buff": {
    "index": 3,
    "target": ["DMG_RATE_UP_SKILL"],
    "settingType": "slider",
    "sliderInitialValue": 0,
    "sliderStep": 1,
    "sliderMax": 2
  }
}
```

### 推断规则

**settingType 判断**：
- 如果描述中包含"每级"、"提升 X 层" → `slider`
- 如果是开关型效果 → `switch`

**target 推断**：
- "伤害提升" → `DMG_RATE_UP`
- "攻击力提升" → `ATTACK_UP`
- 等等...

---

## 9. 特殊标签配置 (Tag)

### 配置结构
```javascript
{
  "damage": {
    "indexes": [1],
    "base": "ATTACK",
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_ELECTRO",
    "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST",
    "tag": "RAZOR_SOUL_COMPANION"
  }
}
```

### 常见标签类型

| 标签 | 说明 | 示例角色 |
|------|------|---------|
| `SHARE_DEFLAG_MAIN` | 共享元素附着（避免元素覆盖） | 温迪 |
| `NO_BREAK` | 不破盾（特殊伤害类型） | 多种角色 |
| `BREAK_EFFECT_IF_HAVE` | 享受破盾效果加成 | 多种角色 |
| `RAZOR_SOUL_COMPANION` | 雷泽狼魂特殊标记 | 雷泽 |
| `SETHOS_DUSK_BOLTS` | 赛索斯特殊箭矢标记 | 赛索斯 |
| `NAHIDA_TRI_KARMA` | 纳西妲通悉识性标记 | 纳西妲 |

### 推断规则

**从技能描述识别特殊标签**：
- "不造成元素附着" → 可能需要 `SHARE_DEFLAG_MAIN`
- "生成物伤害" → 通常有专用标签
- "特殊召唤物" → 标签通常与角色名称相关

---

## 10. 计算队列详解 (CalQueue)

### 10.1 DisplayCalQueue（显示控制队列）

**用途**：控制伤害是否在 UI 上显示

**示例：闲云风元素转化**
```javascript
{
  "damage": {
    "originSkills": ["normal"],
    "originIndexes": [0],
    "originRelations": ["*"],
    "indexes": [11],
    "base": "ATTACK",
    "canOverride": false,
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
}
```

**计算逻辑**：
```
显示值 = 基础伤害 + (1 + VAR_CHARA_2)
如果显示值 <= 0，则不在 UI 显示此伤害
```

### 10.2 FinalResCalQueue（最终计算队列）

**用途**：对最终伤害进行额外修正

**示例 1：珊瑚宫心海 - 水元素爆裂**
```javascript
{
  "damage": {
    "indexes": [0],
    "base": "ATTACK",
    "finalResCalQueue": [
      {
        "relation": "*",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_1"
          }
        ]
      }
    ],
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_HYDRO",
    "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
  }
}
```

**计算公式**：
```
最终伤害 = 基础伤害 × (1 + VAR_CHARA_1)
```

**示例 2：纳西妲 - 蕴种印**
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
    "attackBonusType": "DMG_BONUS_OTHER",
    "specialDamageType": "moon-rupture-direction"
  }
}
```

**计算公式**：
```
最终伤害 = (元素精通 × param[2]) × (1 + VAR_CHARA_5)
```

### 10.3 运算符说明

| 运算符 | 含义 | 使用场景 |
|-------|------|---------|
| `+` | 加法 | 添加额外倍率、叠加变量 |
| `*` | 乘法 | 倍率修正、复合计算 |

### 10.4 变量说明

| 变量 | 含义 | 来源 |
|------|------|------|
| `VAR_CHARA_X` | 角色特定变量 | 从其他技能参数或效果中获取 |

---

## 11. 自定义倍率配置 (Custom Values)

### 配置结构
```javascript
{
  "damage": {
    "indexes": [0],
    "customValues": [1],
    "originSkills": ["normal"],
    "originIndexes": [0],
    "originRelations": ["*"],
    "canOverride": false,
    "base": "ATTACK",
    "elementBonusType": "DMG_BONUS_ELECTRO",
    "attackBonusType": "DMG_BONUS_CHARGED",
    "tag": "SETHOS_DUSK_BOLTS"
  }
}
```

### 示例：赛索斯 - 秘仪·忽律矢

**源数据**：
```
paramDescList[0] = "秘仪·忽律矢伤害|{param1:F1P}重击伤害"
```

**配置说明**：
- `customValues: [1]`：使用固定值 1 作为倍率
- `originIndexes: [0]` + `originRelations: ["*"]`：参考重击伤害
- **计算公式**：`伤害 = 重击基础伤害 × 1 × customValues[0]`

---

## 12. 特殊伤害类型 (Special Damage Type)

### 配置结构
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
    "attackBonusType": "DMG_BONUS_OTHER",
    "specialDamageType": "moon-rupture-direction"
  }
}
```

### 常见特殊伤害类型

| 类型 | 说明 | 示例角色 |
|------|------|---------|
| `SPECIAL_DAMAGE_NONE` | 普通伤害（默认） | 大多数角色 |
| `SPECIAL_DAMAGE_DO_NOT_HIT` | 不造成命中（后台伤害） | 艾尔海森等 |
| `moon-rupture-direction` | 月主题伤害（妮露专属） | 妮露 |

### 推断规则

**从技能描述识别**：
- "后台造成伤害" → 可能需要 `SPECIAL_DAMAGE_DO_NOT_HIT`
- "月相关" → 可能是 `moon-rupture-direction`
- "生成物伤害" → 通常有特殊伤害类型

---

## 13. Buff 配置详解

### 13.1 Switch 类型（开关）

**示例：神里绫华 - 冰元素附魔**
```javascript
{
  "buff": {
    "index": 2,
    "overrideElement": "DMG_BONUS_CRYO",
    "target": [],
    "settingType": "switch",
    "defaultEnable": false
  }
}
```

**字段说明**：
- `index`：参数索引（对应 paramDescList）
- `overrideElement`：覆盖的元素类型
- `target`：影响的目标（空数组表示自身）
- `settingType`：`"switch"` 表示开关型
- `defaultEnable`：默认是否启用

### 13.2 Slider 类型（滑块）

**示例：芙宁娜 - 芙宁娜的沙龙成员**
```javascript
{
  "buff": {
    "showIndex": 0,
    "setTos": ["VAR_CHARA_1"],
    "settingType": "slider",
    "sliderInitialValue": 2,
    "sliderMin": 1,
    "sliderMax": 5,
    "sliderStep": 1,
    "title": "BUFF.COMMON_QUANTITY.TITLE"
  }
}
```

**字段说明**：
- `showIndex`：显示的参数索引
- `setTos`：设置的变量列表
- `sliderInitialValue`：初始值
- `sliderMin` / `sliderMax`：最小/最大值
- `sliderStep`：步长
- `title`：显示标题

### 13.3 滑块带目标类型

**示例：班尼特 - 祝福之星**
```javascript
{
  "buff": {
    "index": 3,
    "target": ["DMG_RATE_UP_SKILL"],
    "settingType": "slider",
    "sliderInitialValue": 0,
    "sliderStep": 1,
    "sliderMax": 2
  }
}
```

**常见 Target 类型**

| Target | 说明 |
|--------|------|
| `DMG_RATE_UP_SKILL` | 元素战技伤害提升 |
| `DMG_RATE_UP_ELEMENTAL_BURST` | 元素爆发伤害提升 |
| `DMG_BONUS_NORMAL` | 普通攻击伤害提升 |
| `DMG_BONUS_ALL` | 所有伤害提升 |
| `ATTACK_UP` | 攻击力提升 |

---

## 14. 治疗配置详解

### 14.1 单倍率 + 固定值

**示例：芭芭拉 - 卖艺·歌声**
```javascript
{
  "healing": {
    "index": 0,
    "constIndex": 1,
    "constCalRelation": "+",
    "base": "HP",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

**计算公式**：
```
治疗量 = (param[0] × HP) + param[1]
```

### 14.2 不同基础属性的治疗

**基于攻击力的治疗**：
```javascript
{
  "healing": {
    "index": 2,
    "constIndex": 3,
    "constCalRelation": "+",
    "base": "ATTACK",
    "healingBonusType": "HEALING_BONUS_ELEMENTAL_BURST"
  }
}
```

**基于生命的治疗**：
```javascript
{
  "healing": {
    "index": 0,
    "constIndex": 1,
    "constCalRelation": "+",
    "base": "HP",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

### HealingBonusType 类型

| 类型 | 说明 |
|------|------|
| `HEALING_BONUS_SKILL` | 元素战技治疗加成 |
| `HEALING_BONUS_ELEMENTAL_BURST` | 元素爆发治疗加成 |
| `HEALING_BONUS_OTHER` | 其他治疗加成 |

---

## 15. 护盾配置详解

### 15.1 基础护盾配置

**示例：钟离 - 玉璋护盾**
```javascript
{
  "shield": {
    "index": 0,
    "constIndex": 1,
    "constCalRelation": "+",
    "base": "HP",
    "shieldBonusType": "SHIELD_BONUS_SKILL",
    "shieldElementType": "GEO"
  }
}
```

**计算公式**：
```
护盾量 = (param[0] × HP) + param[1]
```

### 15.2 不同元素的护盾

**火元素护盾**：
```javascript
{
  "shield": {
    "shieldElementType": "PYRO"
  }
}
```

**水元素护盾**：
```javascript
{
  "shield": {
    "shieldElementType": "HYDRO"
  }
}
```

### ShieldElementType 类型

| 类型 | 元素 |
|------|------|
| `PYRO` | 火元素 |
| `HYDRO` | 水元素 |
| `ANEMO` | 风元素 |
| `ELECTRO` | 雷元素 |
| `CRYO` | 冰元素 |
| `GEO` | 岩元素 |
| `DENDRO` | 草元素 |

---

## 16. 完整配置推断流程

### 步骤 1：解析源数据
```python
# 获取技能信息
skill = source_data["skill"]
param_desc_list = skill["paramDescList"]["cn_sim"]  # 或其他语言
param_map = skill["paramMap"]  # 只保留 01 和 10
desc = skill["desc"]["cn_sim"]
```

### 步骤 2：提取参数信息
```python
# 从 paramDescList 提取参数索引
for i, desc in enumerate(param_desc_list):
    if "{paramX:F1P}" in desc:  # 伤害参数
        indexes.append(i - 1)  # 转换为 0-based
    if "攻击力" in desc:
        base = "ATTACK"
    elif "生命值" in desc:
        base = "HP"
    # ... 其他基础属性
```

### 步骤 3：判断伤害类型
```python
# 从技能描述判断元素类型
if "火元素" in desc or "燃烧" in desc:
    element_bonus_type = "DMG_BONUS_PYRO"
elif "水元素" in desc or "感电" in desc:
    element_bonus_type = "DMG_BONUS_HYDRO"
# ... 其他元素
```

### 步骤 4：识别特殊模式
```python
# 检查是否需要参考其他技能
if "普通攻击伤害" in desc:
    origin_skills = ["normal"]
    origin_relations = ["*"]

# 检查是否有计算队列
if "基于" in desc or "每层" in desc:
    final_res_cal_queue = [...]

# 检查特殊标签
if "生成物" in desc or "召唤" in desc:
    tag = f"{CHARA_NAME}_{SKILL_NAME}"
```

### 步骤 5：验证配置
```python
# 对照 interface.ts 验证
required_fields = ["indexes", "base", "elementBonusType", "attackBonusType"]
for field in required_fields:
    if field not in config:
        print(f"Missing required field: {field}")
```

---

## 17. 常见配置模式汇总

### 17.1 普通攻击配置
```javascript
// 非法器角色
{
  "indexes": [0, 1, 2, 3],
  "base": "ATTACK",
  "canOverride": true,
  "elementBonusType": "DMG_BONUS_PHYSICAL",
  "attackBonusType": "DMG_BONUS_NORMAL"
}

// 法器角色
{
  "indexes": [0, 1, 2, 3, 4, 5],
  "base": "ATTACK",
  "canOverride": false,  // 法器不可覆盖
  "elementBonusType": "DMG_BONUS_CRYO",  // 角色元素
  "attackBonusType": "DMG_BONUS_NORMAL"
}
```

### 17.2 元素战技配置
```javascript
// 标准技能
{
  "indexes": [0],
  "base": "ATTACK",
  "canOverride": false,
  "elementBonusType": "DMG_BONUS_CRYO",
  "attackBonusType": "DMG_BONUS_SKILL"
}

// 多段伤害技能
{
  "indexes": [0, 1, 2],
  "base": "ATTACK",
  "canOverride": false,
  "elementBonusType": "DMG_BONUS_ANEMO",
  "attackBonusType": "DMG_BONUS_SKILL"
}
```

### 17.3 元素爆发配置
```javascript
// 简单爆发
{
  "indexes": [0, 1],
  "base": "ATTACK",
  "canOverride": false,
  "elementBonusType": "DMG_BONUS_HYDRO",
  "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
}

// 带修正的爆发
{
  "indexes": [0],
  "base": "ATTACK",
  "finalResCalQueue": [
    {
      "relation": "*",
      "inner": [{"relation": "+", "variable": "VAR_CHARA_1"}]
    }
  ],
  "canOverride": false,
  "elementBonusType": "DMG_BONUS_PYRO",
  "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
}
```

---

## 总结

从源数据推断配置的关键步骤：

1. **解析 paramDescList** → 提取 `indexes`、`base`、`originIndexes`、`indexesAttach`
2. **解析 desc** → 判断元素类型、特殊机制、参考技能
3. **根据技能类型** → 判断 `canOverride` 和 `attackBonusType`
4. **识别特殊模式** → `displayCalQueue`、`finalResCalQueue`、`tag` 等
5. **验证配置** → 对照 interface.ts 确保结构正确

### 调试技巧

1. **使用 export_data.py** 导出源数据进行对照
2. **使用 analyze_configs.py** 查找类似配置作为参考
3. **查看 interface.ts** 了解所有可用字段
4. **对照类似角色** 的配置进行验证
