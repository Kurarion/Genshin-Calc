# 版本更新检查清单

使用此清单确定版本更新时需要修改的文件。

| 检查项         | 检查方法                             | 需要修改的文件                                |
| -------------- | ------------------------------------ | --------------------------------------------- |
| 新增角色？     | 查看avatar_map.json是否有新ID        | interface.ts, const.ts, calculator.service.ts |
| 角色有新标签？ | 查看技能desc是否有独特机制           | const.ts                                      |
| 新增武器？     | 查看weapon_map.json是否有新ID        | interface.ts                                  |
| 新增圣遗物？   | 查看reliquary_set_map.json是否有新ID | interface.ts                                  |
| 新增元素反应？ | 查看是否有新组合反应                 | calculator.service.ts                         |
| 新增计算乘区？ | 查看desc中的伤害描述                 | const.ts, calculator.service.ts               |
| 新增Buff类型？ | 查看是否有新类型buff                 | interface.ts, const.ts                        |

---

## 详细检查步骤

### 角色相关更新

#### 步骤1：检查是否有新角色

1. 对比旧版本的`processed_data.json`和新版本的`avatar_map.json`
2. 找出新增的角色ID
3. 如果有新角色，进入详细检查

#### 步骤2：检查新角色的特殊机制

1. 查看技能desc，寻找独特关键词：
   - "基于队友" → team buff
   - "层数" → slider
   - "蓄力" → 特殊标签
   - "转化" → 元素转化
2. 记录发现的特殊机制

#### 步骤3：确定修改范围

**需要修改const.ts的情况**：

- 新技能标签 → 添加`PROP_TAG_*`常量
- 新伤害加成类型 → 添加`PROP_DMG_BONUS_*`或`PROP_DMG_RATE_UP_*`
- 新元素相关常量

**需要修改interface.ts的情况**：

- 新Buff数据结构
- 新类型的calcQueue

**需要修改calculator.service.ts的情况**：

- 新元素反应计算
- 新特殊伤害计算逻辑
- 新的乘区组合

### 武器相关更新

#### 步骤1：检查新武器

1. 对比weapon_map.json
2. 记录新增的武器ID

#### 步骤2：检查新武器机制

1. 查看weapon的name和desc字段（武器的整体描述）
2. 查看skillAffixMap中的name和desc字段（精炼效果的描述）
3. 确认是否有特殊效果（如基于元素类型的加成）

#### 步骤3：确定修改范围

通常只需要：

- 生成武器配置（data.json中添加weapon数据）
- 不需要修改代码文件

### 圣遗物相关更新

#### 步骤1：检查新圣遗物

1. 对比reliquary_set_map.json
2. 记录新增的套装ID

#### 步骤2：检查新套装机制

1. 查看setName字段（套装名称）
2. 查看setAffixs中的name和desc字段（套装效果的描述，注意字段名是setAffixs）
3. 确认是否需要特殊处理

#### 步骤3：确定修改范围

通常只需要：

- 生成圣遗物配置（data.json中添加artifact数据）
- 不需要修改代码文件

---

## 修改指南

### 修改const.ts

#### 添加新常量的位置

1. **技能标签常量**：在`// 技能标签`部分添加

```typescript
static readonly PROP_TAG_NEW_SKILL = 'NEW_SKILL_TAG';
```

2. **属性常量**：在`// 属性`或`// 伤害加成`部分添加

```typescript
static readonly PROP_DMG_BONUS_NEW_ELEMENT = 'DMG_BONUS_NEW_ELEMENT';
static readonly PROP_DMG_RATE_UP_NEW_SKILL = 'DMG_RATE_UP_NEW_SKILL';
```

3. **更新标签映射**：在`PROPS_TAG_MAP`中添加

```typescript
static readonly PROPS_TAG_MAP: Map<string, string[]> = new Map([
  ...
  ['1000XXXX', [Const.PROP_TAG_NEW_SKILL]],
  ...
]);
```

#### 常见添加模式

| 新内容         | 添加位置  | 示例                               |
| -------------- | --------- | ---------------------------------- |
| 新技能标签     | ~line 730 | `PROP_TAG_SKIRK_SEVEN_PHASE_FLASH` |
| 新元素伤害加成 | ~line 348 | `PROP_DMG_BONUS_DENDRO`            |
| 新倍率加成     | ~line 447 | `PROP_DMG_RATE_UP_SKILL`           |
| 新元素         | ~line 195 | `ELEMENT_DENDRO`                   |

### 修改interface.ts

#### 添加新接口

如果需要新类型的数据结构：

```typescript
// 在适当位置添加
export interface NewBuffType {
  customField: string;
  specialLogic?: boolean;
}
```

#### 修改现有接口

如果现有接口需要支持新字段，添加到对应interface中：

```typescript
export interface ExtraSkillBuff {
  // 原有字段...
  // 新增字段
  newFeature?: string;
}
```

### 修改calculator.service.ts

#### 添加新计算逻辑

在`getDamage`方法中添加新的计算分支：

```typescript
// 在适当位置添加
switch (true) {
  case isSpecialDamage: {
    // 特殊伤害计算逻辑
    break;
  }
  default: {
    // 默认计算逻辑
    break;
  }
}
```

#### 添加新反应计算

在元素反应区域添加：

```typescript
// 在元素反应区域添加
let newReactionDmg = 0;
if (isNewReaction) {
  // 新反应计算
  const newReactionBase = BASE_NEW_REACTION[level];
  newReactionDmg = finalDmg * newReactionBase;
}
```

#### 更新计算常量

在文件顶部添加新的基础倍率数组：

```typescript
const BASE_NEW_REACTION = Array.from(BASE_LEVEL_MULTIPLIER, (x) => x * NEW_FACTOR);
```

### 更新i18n文件

**重要**：i18n中的所有内容都是从解包数据的 `desc` 字段中提取的！

#### 数据来源

解包数据的 `desc` 字段结构如下：

```json
{
  "skills": {
    "elementalBurst": {
      "name": {
        "cn_sim": "神里流·霜灭",
        "cn_tra": "神里流·霜滅",
        "en": "Kamisato Art: Suou",
        "jp": "神里流・霜滅"
      },
      "desc": {
        "cn_sim": "呼唤绽放的冰之华，攻击周围敌人...",
        "cn_tra": "呼喚綻放的冰之華，攻擊周圍敵人...",
        "en": "Calls forth a blooming glacier...",
        "jp": "開花する氷華を呼び出し..."
      }
    }
  }
}
```

#### 提取方法

1. **角色名称、技能名称**：

   - 从解包数据的 `name` 字段提取
   - 添加到对应的i18n文件中

2. **技能描述、标签名称**：

   - 从解包数据的 `desc` 字段提取
   - 添加到对应的i18n文件中

3. **武器名称和描述**：

   - 从解包数据的 `name` 和 `desc` 字段提取
   - 武器名称：weapon.name
   - 武器描述：weapon.desc
   - 精炼效果名称：weapon.skillAffixMap[key].name
   - 精炼效果描述：weapon.skillAffixMap[key].desc

4. **圣遗物套装名称和效果**：

   - 从解包数据的 `setName` 字段提取
   - 套装效果：setAffixs中的name和desc字段（注意字段名是setAffixs）
   - 2件套效果：setAffixs[0].desc
   - 4件套效果：setAffixs[1].desc

5. **新常量的翻译**：
   - 从解包数据的 `desc` 字段提取对应文本
   - 添加到i18n文件的 `PROPS.*` 和 `TAG.*` 部分

#### i18n文件结构

```json
{
  "PROPS.ATTACK_UP": "攻击力提升",
  "PROPS.DMG_BONUS_CRYO": "冰元素伤害加成",
  "TAG.VENTI_SKILL_PRESS": "蓄力",
  "TAG.RAZOR_SOUL_COMPANION": "灵魂伴侣"
}
```

#### 更新步骤

1. 运行 `check_unimplemented.py` 查找未实现的内容
2. 使用 `export_data.py` 导出特定ID的数据
3. 从导出的JSON中提取 `name` 和 `desc` 字段
4. 将提取的内容添加到对应的i18n文件中
5. 确保四种语言（cn_sim, cn_tra, en, jp）都添加

---

## 常见版本更新场景

### 场景1：常规小版本更新

**特点**：

- 只有少数新角色/武器/圣遗物
- 无新机制
- 原有机制数值调整

**操作**：

1. ✅ 运行预处理
2. ✅ 生成新配置
3. ✅ 验证配置
4. ✅ 提交
5. ❌ 不需要修改代码文件

### 场景2：大版本更新（如4.x → 5.0）

**特点**：

- 多新角色/武器/圣遗物
- 可能有新机制（新元素反应等）
- 大量数值调整

**操作**：

1. ✅ 运行预处理
2. ✅ 生成所有新配置
3. ✅ 检查并添加新常量/接口
4. ✅ 实现新计算逻辑
5. ✅ 验证所有修改
6. ✅ 分批提交（按功能分开）

### 场景3：数值修正版本

**特点**：

- 角色技能数值调整
- 武器/圣遗物数值调整
- 机制变更较少

**操作**：

1. ✅ 重新生成调整的配置
2. ✅ 对比差异，确认预期
3. ✅ 不需要修改代码文件
4. ✅ 验证并提交

---

## 验证清单

### 生成配置后验证

- [ ] JSON格式正确（运行`python3 -m json.tool src/assets/init/data.json`）
- [ ] 所有新角色/武器/圣遗物都包含
- [ ] indexes映射准确
- [ ] base属性正确
- [ ] elementBonusType和attackBonusType正确
- [ ] 特殊标签正确引用const.ts中的常量
- [ ] Buff的target使用正确的常量

### 代码修改后验证

- [ ] const.ts新常量已添加
- [ ] interface.ts新接口已定义
- [ ] calculator.service.ts新逻辑已实现
- [ ] 运行`npm run lint`和`npm run typecheck`无错误
- [ ] 测试新功能是否生效

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
