# 高级配置指南

本文档描述data.json配置生成的高级场景和技巧。

---

## 1. 特殊标签系统详解

### 1.1 标签的创建和使用

某些角色的技能有特殊机制，需要通过标签系统实现。

#### 示例：温迪的蓄力（VENTI_SKILL_PRESS）

在const.ts中定义标签：

```typescript
static readonly PROP_TAG_VENTI_SKILL_PRESS = 'VENTI_SKILL_PRESS';
```

在PROPS_TAG_MAP中绑定：

```typescript
static readonly PROPS_TAG_MAP: Map<string, string[]> = new Map([
  ['10000022', [Const.PROP_TAG_VENTI_SKILL_PRESS]],
  ...
]);
```

在配置中使用标签：

```javascript
{
  "damage": {
    "elementBonusType": "DMG_BONUS_ANEMO",
    "attackBonusType": "DMG_BONUS_SKILL",
    "tag": "VENTI_SKILL_PRESS"
  }
}
```

在calculator.service.ts中识别标签：

```typescript
if (Const.PROPS_TAG_MAP.has(chara_id) &&
    Const.PROPS_TAG_MAP.get(chara_id)?.includes(Const.PROP_TAG_VENTI_SKILL_PRESS)) {
  // 应用温迪蓄力逻辑
}
```

### 1.2 多标签角色

某些角色可能绑定多个标签：

```typescript
['10000084', [Const.PROP_TAG_LYNEY_GRIN_MALKIN]],
```

---

## 2. displayCalQueue 和 finalResCalQueue

### 2.1 使用场景

用于复杂的多步计算，例如：

- 芙宁娜的沙龙独舞：基于队友数量计算不同加成
- 温迪的风神之眼：基于蓄力层数计算伤害倍率

### 2.2 配置示例

#### 示例1：基于变量的加成

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["DMG_BONUS_SKILL"],
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
  }]
}
```

表示：技能伤害 × (1 + VAR_CHARA_2)

#### 示例2：带上限的加成

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["DMG_BONUS_SKILL"],
    "customValue": 0.15,
    "maxValBase": "VAR_CHARA_1",
    "multiValue": 0.5
  }]
}
```

表示：基础加成15%，上限为VAR_CHARA_1 × 0.5

#### 示例3：复杂的条件计算

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["DMG_BONUS_SKILL"],
    "finalResCalQueue": [
      {
        "relation": "*",
        "inner": [
          {
            "relation": "+",
            "variable": "VAR_CHARA_1"
          }
        ],
        "clampMin": 0,
        "clampMax": 3
      }
    ]
  }]
}
```

表示：技能伤害 × (1 + clamp(VAR_CHARA_1, 0, 3))

### 2.3 在calculator.service.ts中实现

```typescript
// 处理finalResCalQueue
const processedVal = this.getFinalResCalQueueResult(data, 0, param.finalResCalQueue);
finalValue *= processedVal;

// 处理displayCalQueue（用于前端显示控制）
const displayValue = this.getFinalResCalQueueResult(data, 0, param.displayCalQueue);
if (displayValue < 1) {
  forceDisplay = false;  // 不显示该技能
}
```

---

## 3. Constellation衍生伤害

### 3.1 概念

某些命座效果会衍生自其他技能的数值，例如：

- 雷泽C2：元素爆发的第0、1段 × 1.3
- 芭宁娜C6：普通攻击的5个段 × 0.33

### 3.2 配置示例

```javascript
{
  "constellation": {
    "1": [{
      "damage": {
        "originSkills": ["elementalBurst"],
        "originIndexes": [0, 1],
        "originRelations": ["*", "*"],
        "indexes": [0, 0],
        "base": "ATTACK",
        "elementBonusType": "DMG_BONUS_ELECTRO"
      }
    }]
  }
}
```

### 3.3 解析规则

- `originSkills`: 来源技能类型数组
- `originIndexes`: 来源技能的索引
- `originRelations`: 操作关系（通常为"\*"表示相乘）
- `indexes`: 输出的索引列表（长度必须与originIndexes相同）
- 如果`customValues`存在，则使用自定义值覆盖

---

## 4. 治动器配置

### 4.1 场景

某些角色的Buff有层数系统，例如：

- 绫华：基于能量吸收的层数
- 纳西：基于攻击次数的层数

### 4.2 配置示例

#### 基础滑块

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

#### 特殊滑块（varMap）

```javascript
{
  "buffs": [{
    "index": 0,
    "setTos": ["VAR_CHARA_2"],
    "settingType": "switch",
    "defaultEnable": false
  },
  {
    "damage": {
      "displayCalQueue": [
        {
          "relation": "+",
          "inner": [{
            "relation": "+",
            "variable": "VAR_CHARA_2"
          }]
        }
      ]
    }
  }]
}
```

### 4.3 在calculator.service.ts中实现

```typescript
// 获取滑块值
const stackCount = data[VarName] || 0;

// 计算加成
const buffValue = index + stackCount * step;
```

---

## 5. 特殊伤害类型

### 5.1 月反应类型

纳塔地区特有反应：

- `moon-electro-charged-direction`: 月感电直接伤害
- `moon-electro-charged-reaction`: 月感电反应伤害
- `moon-rupture-direction`: 月绽放直接伤害

### 5.2 配置示例

```javascript
{
  "damage": {
    "elementBonusType": "DMG_BONUS_ELECTRO",
    "attackBonusType": "DMG_BONUS_SKILL",
    "specialDamageType": "moon-electro-charged-direction",
    "tag": "VENTI_SKILL_PRESS"
  }
}
```

### 5.3 在calculator.service.ts中实现

```typescript
switch (true) {
  case isMoonElectrochargedDirectly: {
    // 月感电直接伤害计算
    break;
  }
  case isMoonElectrochargedReactional: {
    // 月感电反应伤害计算
    break;
  }
  default: {
    // 默认伤害计算
    break;
  }
}
```

---

## 6. 治疗和护盾

### 6.1 治疗配置

```javascript
{
  "healing": {
    "index": 0,
    "base": "ATTACK",
    "constIndex": 1,
    "constCalRelation": "+",
    "healingBonusType": "HEALING_BONUS_SKILL"
  }
}
```

- `index`: 在paramList中的索引
- `constIndex`: 第二个参数索引（用于额外加成）
- `constCalRelation`: 与第二个参数的关系（"+"或"\*"）

### 6.2 护盾配置

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

- `shieldElementType`: 护盾的元素类型

---

## 7. 条件Buff

### 7.1 队伍相关

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["DMG_BONUS_ANEMO"],
    "settingType": "switch",
    "defaultEnable": false,
    "isAllTeam": true
  }]
}
```

### 7.2 元素类型限制

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["DMG_BONUS_PYRO"],
    "settingType": "switch",
    "defaultEnable": false,
    "selfElementTypeLimit": true,
    "teamElementTypeLimit": ["PYRO", "HYDRO"]
  }]
}
```

### 7.3 武器类型限制

```javascript
{
  "buffs": [{
    "index": 0,
    "target": ["ATTACK_UP"],
    "settingType": "switch",
    "defaultEnable": false,
    "weaponTypeLimit": ["WEAPON_POLE"]
  }]
}
```

---

## 8. 常见配置模式

### 8.1 基础攻击模式

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

### 8.2 元素技能模式

```javascript
{
  "damage": {
    "indexes": [0],
    "base": "ATTACK",
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_CRYO",
    "attackBonusType": "DMG_BONUS_SKILL"
  }
}
```

### 8.3 元素爆发模式

```javascript
{
  "damage": {
    "indexes": [0, 1, 2],
    "base": "ATTACK",
    "canOverride": false,
    "elementBonusType": "DMG_BONUS_CRYO",
    "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
  }
}
```

---

## 9. 调试技巧

### 9.1 验证生成的配置

1. 运行JSON验证：

   ```bash
   python3 -m json.tool src/assets/init/data.json
   ```

2. 在应用中测试配置是否生效

3. 检查浏览器控制台是否有错误

### 9.2 常见问题排查

| 问题           | 原因            | 解决方法                          |
| -------------- | --------------- | --------------------------------- |
| 技能不显示     | indexes映射错误 | 检查paramList索引是否正确         |
| 伤害计算错误   | base属性错误    | 确认使用ATTACK而不是HP/DEFENSE    |
| Buff不生效     | target属性错误  | 检查常量名称是否正确              |
| 特殊效果未触发 | 标签未绑定      | 检查PROPS_TAG_MAP中是否有该角色ID |

### 9.3 日志调试

在calculator.service.ts中添加调试日志：

```typescript
if (environment.outputLog) {
  console.log(`[DEBUG] Character ${index} - Processing damage`);
  console.log(`[DEBUG] Element: ${elementBonusType}`);
  console.log(`[DEBUG] Attack: ${base}`);
}
```
