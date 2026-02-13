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
├── versions/            # 版本化数据存储（Git忽略所有内容）
│   ├── metadata.json          # 版本索引（本地生成，不追踪）
│   └── [commit-id]/        # 按 commit ID 命名的版本目录
│       ├── source/              # 原始游戏数据
│       ├── processed/           # 预处理数据
│       │   ├── processed_data.json
│       │   ├── name_id_map.json
│       │   ├── characters/
│       │   ├── weapons/
│       │   └── artifacts/
│       └── meta.json          # 版本元数据
├── diffs/               # 差分报告目录（Git管理）
│   └── version_diff_*.md     # 版本对比报告
├── scripts/             # 脚本文件（Git管理）
│   ├── version_manager.py    # 版本管理工具
│   ├── fetch_version.py     # 版本获取脚本
│   ├── diff_analyzer.py     # 差分分析脚本
│   ├── preprocess.py        # 数据预处理脚本
│   ├── query_data_config.py # 数据查询脚本
│   └── ...                # 其他辅助脚本
├── references/          # 参考文档（Git管理）
└── SKILL.md             # 主文档（Git管理）
```

### 目录说明

- **versions/metadata.json**: 版本索引（本地生成，按 commit 时间顺序排列）
- **versions/[commit-id]/source/**: GenshinData Go 工具的原始输出
- **versions/[commit-id]/processed/**: preprocess.py 处理后的数据
- **diffs/**: 差分报告存储目录，包含版本对比分析结果
- **versions/[commit-id]/meta.json**: 该版本的元数据（Git 追踪）
- **scripts/**: 核心脚本，必须 Git 管理

### 版本管理策略

版本系统使用 Git commit ID 作为唯一标识符，支持：
- **自动获取**: 通过 `fetch_version.py` 获取指定仓库/分支的最新 N 个 commit
- **增量获取**: 自动跳过已存在的版本，只获取本地不存在的版本
- **仓库配置**: 支持通过 `--repo` 参数指定不同的 Git 仓库（GitLab/GitHub）
- **分支配置**: 支持通过 `--branch` 参数指定不同的分支（master/main）
- **数量配置**: 支持通过 `--count` 参数指定获取的版本数量（默认3个）
- **版本对比**: 通过 `diff_analyzer.py` 对比任意两个版本的差异
- **版本解析**: 支持使用 `latest`、短 ID、完整 commit ID 引用版本

**支持的 Git 平台**：
- **GitLab**: 默认平台，`https://gitlab.com/Dimbreath/AnimeGameData`
- **GitHub**: `https://github.com/Dimbreath/GenshinData`
- **自定义**: 其他兼容的 Git 仓库 URL

**数据获取策略**：
- 系统使用**commit ID**获取原始数据（如 `-/raw/{commit}`）
- 使用 **commit ID** 作为版本标识符进行追踪
- 默认获取最新3个版本，只获取本地不存在的版本
- 确保每个版本的数据对应其特定的 commit，避免数据重复

## 快速开始

使用此 Skill 进行角色/武器/圣遗物配置时，核心流程如下：

### 1. 获取新版本数据（首次或游戏更新时运行）

```bash
cd .claude/skills/genshin-data-generator/scripts

# 获取最新3个版本（默认仓库）
python3 fetch_version.py

# 指定仓库和分支
python3 fetch_version.py --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master

# 指定获取的版本数量
python3 fetch_version.py --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master --count 5
```

**支持的仓库**：
- GitLab: `https://gitlab.com/Dimbreath/AnimeGameData` (默认)
- GitHub: `https://github.com/Dimbreath/GenshinData`
- 其他兼容的 Git 仓库

**注意事项**：
- 系统会自动使用 commit ID 获取每个版本的特定数据
- 只获取本地不存在的版本，已存在的版本会被跳过
- 版本标识符使用 commit ID 进行追踪和对比

这将自动完成：
1. 从 Git API 获取最新的 N 个 commit ID（默认3个）
2. 检查本地已存在的版本，筛选出需要获取的 commit
3. **从旧到新**依次处理每个需要获取的 commit：
   - 执行 GenshinData Go 工具获取原始数据（使用特定commit ID）
   - 运行 preprocess.py 预处理数据
   - 生成版本元数据和校验和
4. 更新版本索引，并将 latest 符号链接指向最新的版本

### 1.1 直接使用 GenshinData Go 工具（高级用法）

如果需要直接运行 Go 工具获取数据：

```bash
# 在项目根目录运行
go run main.go --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master

# 指定输出目录
go run main.go --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master --targetDir ./src/assets/genshin

# 使用特定 commit ID 获取数据（推荐用于版本管理）
go run main.go --repo https://gitlab.com/Dimbreath/AnimeGameData --commit a7624301c8b009c54bdf7bf8d4cfb817aad6accf

# 直接指定完整的资源 URL
go run main.go --resUrl https://gitlab.com/Dimbreath/AnimeGameData/-/raw/master

# 使用本地数据源
go run main.go --localResPath /path/to/local/data
```

**参数说明**：
- `--repo`: Git 仓库 URL（支持 GitHub 和 GitLab）
- `--branch`: 分支名称（默认：master）
- `--commit`: Commit ID（优先级高于 branch，用于获取特定版本的数据）
- `--targetDir`: 输出目录（默认：./src/assets/genshin）
- `--resUrl`: 完整的资源 URL（与 --repo/--branch/--commit 互斥）
- `--localResPath`: 本地数据源路径

**参数优先级**：
1. `--commit` + `--repo`：获取特定 commit 的数据（推荐用于版本管理）
2. `--branch` + `--repo`：获取指定分支的最新数据
3. `--resUrl`：直接使用提供的完整 URL

**网络连接注意事项**：
- 某些网络环境可能需要强制使用 IPv4 连接
- 如果遇到连接问题，可以设置环境变量：`GODEBUG=netdns=go go run main.go ...`
- fetch_version.py 会自动设置此环境变量

**版本管理说明**：
- 默认获取最新3个版本（可通过 `--count` 参数调整）
- 每个版本使用其特定的 commit ID 获取数据，确保数据内容对应正确的版本
- 已存在的版本会被自动跳过，不会重复获取
- metadata.json 记录所有版本的元数据信息

### 2. 分析版本差异（游戏更新后）

```bash
cd .claude/skills/genshin-data-generator/scripts

# 比较两个版本（报告输出到 diffs/ 目录）
python3 diff_analyzer.py --from abc1234 --to def5678 --output ../diffs/version_diff_abc1234_def5678.md

# 比较最新版本与前一版本
python3 diff_analyzer.py --from HEAD~1 --to latest --output ../diffs/version_diff_latest.md

# 检查未实现的项目
python3 diff_analyzer.py --from latest --check-unimplemented --output ../diffs/unimplemented.md

# 只关注特定类型
python3 diff_analyzer.py --from abc1234 --to def5678 --focus characters weapons
```

**差分报告**：
- 输出位置：`diffs/` 目录（专用文件夹，不污染其他目录）
- 命名建议：`version_diff_{from}_{to}.md`
- 报告内容：
  - 概要统计（新增/修改/删除数量）
  - 优先级建议（🔴高/🟡中/🟢低）
  - 新增项目详情（需要配置）
  - 修改项目详情（需要更新，包括参数变化）
  - 未实现项目列表

**重要说明**：
- Git 仓库的 commit 不一定对应游戏版本更新
- 某些 commit 只是仓库维护性提交，不包含游戏数据变化
- 使用差分分析可以识别哪些 commit 包含实际的游戏数据变化

### 3. 读取版本数据

**方式1：从版本目录读取（推荐）**

版本系统自动为每个版本生成完整的预处理数据：

```bash
# 查询特定版本的预处理数据
cd .claude/skills/genshin-data-generator/scripts
python3 query_data_config.py --version abc1234 --type character --id 10000073

# 查询最新版本
python3 query_data_config.py --version latest --type character --id 10000073

# 使用版本目录中的单独文件
cat versions/[commit-id]/processed/characters/character_10000073.json
cat versions/[commit-id]/processed/weapons/weapon_11301.json
cat versions/[commit-id]/processed/artifacts/artifact_301.json
```

**方式2：使用 export_data.py 导出（临时分析用）**

**输出示例**：

```
开始预处理数据...
  输入目录: ./src/assets/genshin
  输出文件: ./.claude/skills/genshin-data-generator/output/processed_data.json
  角色单独导出目录: ./output/characters
  武器单独导出目录: ./output/weapons
  圣遗物单独导出目录: ./output/artifacts
  处理角色数据...
    已导出 133 个角色单独文件
  处理武器数据...
  处理圣遗物数据...
    已导出 40 个圣遗物套装单独文件
  已生成名称-ID映射文件: ./output/name_id_map.json
    - 角色: 133 个
    - 武器: 227 个
    - 圣遗物: 40 个
    - 总计: 400 个

预处理完成！
原始avatar_map.json: 12.25 MB
原始weapon_map.json: 13.00 MB
输出processed_data.json: 4.62 MB
压缩率: 81.68%
```

### 2. 读取角色/武器/圣遗物数据

#### 2.1 使用名称ID映射文件（推荐第一步）

**name_id_map.json** 提供了名称与ID的双向映射，是AI查找ID的首选方式。

**文件位置**：
```
versions/[commit-id]/processed/name_id_map.json
```

**文件结构**：
```json
{
  "characters": {
    "10000002": {
      "cn_sim": "神里绫华",
      "cn_tra": "神里綾華",
      "jp": "神里綾華",
      "en": "Kamisato Ayaka"
    },
    "10000073": {
      "cn_sim": "纳西妲",
      "cn_tra": "納西妲",
      "jp": "ナヒーダ",
      "en": "Nahida"
    }
  },
  "weapons": {
    "11301": {
      "cn_sim": "天目影打刀",
      "cn_tra": "天目影打刀",
      "jp": "天目影打刀",
      "en": "Amenoma Kageuchi"
    }
  },
  "artifacts": {
    "15001": {
      "cn_sim": "炽烈的炎之魔女",
      "cn_tra": "熾烈的炎之魔女",
      "jp": "炎の魔女",
      "en": "Crimson Witch of Flames"
    }
  }
}
```

**使用方法**：

**方法1：通过名称搜索ID**
```bash
# 使用 query_data_config.py 通过名称查找ID
cd .claude/skills/genshin-data-generator/scripts
python3 query_data_config.py --type character --name 纳西妲
python3 query_data_config.py --type weapon --name 天目影打刀
python3 query_data_config.py --type artifact --name 炽烈的炎之魔女
```

**方法2：直接读取映射文件**
```bash
# 直接读取映射文件
cat versions/[commit-id]/processed/name_id_map.json | grep "纳西妲"
```

**AI使用场景**：
1. **用户提供角色名称时** → 先查询 name_id_map.json 获取ID
2. **需要确认ID对应角色时** → 通过名称交叉验证
3. **批量处理时** → 作为快速查找索引

**重要提示**：
- 支持多语言名称：
  - `cn_sim` - 简体中文
  - `cn_tra` - 繁体中文
  - `jp` - 日文
  - `en` - 英文
- 名称映射包含特殊变体（如"空 (火)"、"荧 (水)"等旅行者元素形态）
- 武器和圣遗物的名称是完整名称（包含武器类型前缀或套装名称）

---

#### 2.2 直接读取预处理自动生成的文件（推荐）

预处理脚本已自动为所有角色、武器、圣遗物生成单独JSON文件：

```bash
output/characters/
├── character_10000002.json  # 神里绫华
├── character_10000003.json  # 琴
├── character_10000073.json  # 纳西妲
└── ... (共133个)

output/weapons/
├── weapon_11301.json      # 单手剑·天目影
├── weapon_11302.json      # 单手剑·笛剑
├── weapon_11401.json      # 弓
└── ... (共227个)

output/artifacts/
├── artifact_301.json      # 渲染之火
├── artifact_302.json      # 渲染之水
├── artifact_303.json      # 渲染之风
└── ... (共40个)
```

**推荐做法**: 配置时直接读取对应的单独文件：

```bash
# 角色配置
cat output/characters/character_10000073.json

# 武器配置
cat output/weapons/weapon_11301.json

# 圣遗物配置
cat output/artifacts/artifact_301.json
```

**方式2：使用 export_data.py 导出（临时分析用）**

`export_data.py` 可用于将特定数据导出到 `exports/` 目录：

```bash
# 导出特定角色/武器/圣遗物到 exports/ 目录
cd .claude/skills/genshin-data-generator/scripts
python3 export_data.py --type character --id 10000073
python3 export_data.py --type weapon --id 11301
python3 export_data.py --type artifact --id 301
```

**注意**: 预处理已自动生成所有单独文件，**推荐直接使用方式1**。`exports/` 目录仅用于临时导出或特殊分析需求。

### 3. 查询 data.json 配置（新增）

**query_data_config.py** 可用于查询和导出已配置的角色/武器/圣遗物数据：

```bash
# 根据ID查询并输出（美化格式）
cd .claude/skills/genshin-data-generator/scripts
python3 query_data_config.py --type character --id 10000073

# 根据名称搜索（需要先运行 preprocess.py 生成映射文件）
python3 query_data_config.py --type character --name 纳西妲

# 模糊搜索
python3 query_data_config.py --type character --fuzzy 纳

# 列出所有ID
python3 query_data_config.py --type character --list

# 导出到文件
python3 query_data_config.py --type character --id 10000073 --output config_export.json

# 以纯JSON格式输出（不美化）
python3 query_data_config.py --type character --id 10000073 --json
```

**用途**：
- 写完角色配置后快速检查配置是否正确
- 参考已配置角色时快速获取准确配置
- 通过名称搜索快速找到ID，再使用ID导出完整配置

### 4. AI 配置生成

AI 需要结合以下信息进行推理和配置生成：

1. **角色/武器/圣遗物数据**：`output/characters/character_{id}.json`（推荐）或 `processed_data.json`
2. **interface.ts**：配置文件的数据结构和类型接口
3. **const.ts**：伤害计算的核心常量和枚举
4. **calculator.service.ts**：伤害计算逻辑（参考）
5. **本 SKILL.md**：配置生成指南和规则

**AI 分析步骤**：

1. 读取目标角色/武器/圣遗物的单独JSON文件
2. 分析 `paramDescList` 判断 `indexes` 映射
3. 分析 `desc` 判断特殊机制（buff、治疗、护盾等）
4. 根据武器类型和技能类型判断 `elementBonusType` 和 `attackBonusType`
5. 生成符合规范的配置 JSON

### 5. 检查未实现数据（可选）

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

### 3. const.ts (`src/app/shared/const/const.ts`)

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

### ⚠️ 特殊情况：判断复合倍率 vs 两个独立伤害

**重要区别**：paramDescList中的 `+` 号可能表示两种不同的情况：

| 描述格式 | 含义 | 配置方式 | 示例 |
|---------|------|---------|-------|
| `"灭净三业伤害|{param3:F1P}攻击力+{param4:F1P}元素精通"` | **复合倍率**：`+`前后有**明确的base说明**（攻击力 vs 元素精通） | 使用 `indexesAttach` 和 `baseAttach` | 纳西妲灭净三业：`param3×攻击力 + param4×元素精通` |
| `"三段伤害|{param3:F1P}+{param4:F1P}"` | **两个独立伤害**：`+`前后都**没有单位说明**，都是纯数值倍率 | 创建两个独立的 `damage` 对象 | 兹白普通攻击三段：两个独立的伤害实例 |

**判断规则**：
- **复合倍率**：当且仅当 `+` 前后**都有明确的base说明**（如 `攻击力 + 元素精通`、`防御力 + HP`）
- **两个独立伤害**：`+` 前后都**没有单位说明**，只是两个独立的攻击力倍率伤害

**判断方法**：
1. **查看 `+` 前后的单位说明**：
   - `+` 前有 `攻击力/防御力/HP`，`+` 后也有 `攻击力/防御力/HP/元素精通` 等 → **复合倍率**
   - `+` 前后都只是 `{paramX:F1P}` 格式，没有额外单位说明 → **两个独立伤害**
2. **查看描述开头**：如果有明确的伤害类型名称（如"三段伤害"、"重击伤害"），说明这是描述**该类型伤害的定义**，`+` 在格式内部连接的是**同一类型的多个伤害实例**

**示例：兹白(10000126)普通攻击三段**
```javascript
// paramDescList (简体中文)
[
  "三段伤害|{param3:F1P}+{param4:F1P}",  // 两个独立伤害
  ...
]

// 正确配置：两个独立的damage对象
"normal": [
  {
    "damage": {
      "indexes": [2],  // 第一个伤害：param3 × 攻击力
      "base": "ATTACK",
      ...
    }
  },
  {
    "damage": {
      "indexes": [3],  // 第二个伤害：param4 × 攻击力
      "base": "ATTACK",
      ...
    }
  }
]

// 错误配置：使用indexesAttach（复合倍率）
"normal": [
  {
    "damage": {
      "indexes": [2],
      "indexesAttach": [[3]],  // ❌ 错误！这不是复合倍率
      "baseAttach": ["ATTACK"],
      ...
    }
  }
]
```

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
  "二段伤害|{param2:F1P}",           // param2 = 0.486846
  "三段伤害|{param3:F1P}",           // param3 = 0.626218
  "四段伤害|{param4:F1P}*3",         // param4 = 0.226464 (3次)
  "五段伤害|{param7:F1P}",           // param7 = 0.781817
  "重击伤害|{param8:F1P}*3",         // param8 = 0.55126 (3次)
  "重击体力消耗|{param9:F1}点",
  "下坠期间伤害|{param10:P}",
  "低空/高空坠地冲击伤害|{param11:P}/{param12:P}"
]

// paramMap["01"] (等级1的参数值)
[0.457253, 0.486846, 0.626218, 0.226464, 0, 0, 0.781817, 0.55126, 20, 0.639324, 1.278377, 1.596762, ...]
```

**说明**: 神里绫华的普通攻击包含**多个不同的伤害类型**，每个需要单独配置。注意param5和param6未使用（值为0），需要跳过。

**推断过程**:

**步骤1: 分析每一行的含义和参数**
- 第1-5行: 普通攻击的各段伤害（一段到五段）
- 第6行: 重击伤害（3次连续攻击）
- 第7行: 重击体力消耗（非伤害，忽略）
- 第8-9行: 下落攻击伤害（需要单独配置）

**步骤2: 提取普通攻击的参数索引**
- `param1` (一段) → index = 0
- `param2` (二段) → index = 1
- `param3` (三段) → index = 2
- `param4` (四段) → index = 3
- 跳过 param5, param6 (未使用，值为0)
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

**步骤7: 为每个伤害类型创建配置对象**
- 普通攻击（一段到五段）→ 第1个 `damage` 对象
- 重击 → 第2个 `damage` 对象
- 下落攻击 → 第3个 `damage` 对象

**最终配置** (data.json中的实际配置):
```javascript
"normal": [
  {
    "damage": {
      "indexes": [0, 1, 2, 3, 6],     // 普通攻击一段到五段
      "base": "ATTACK",
      "canOverride": true,
      "elementBonusType": "DMG_BONUS_PHYSICAL",
      "attackBonusType": "DMG_BONUS_NORMAL"
    }
  },
  {
    "damage": {
      "indexes": [7],                   // 重击伤害（param8 = index 7）
      "base": "ATTACK",
      "canOverride": true,
      "elementBonusType": "DMG_BONUS_PHYSICAL",
      "attackBonusType": "DMG_BONUS_CHARGED"
    }
  },
  {
    "damage": {
      "indexes": [9, 10, 11],          // 下落攻击伤害（param10-12）
      "base": "ATTACK",
      "canOverride": true,
      "elementBonusType": "DMG_BONUS_PHYSICAL",
      "attackBonusType": "DMG_BONUS_PLUNGING"
    }
  }
]
```

**计算公式**:
```
普通攻击一段伤害 = param[0] × 攻击力 = 0.457253 × 攻击力
重击伤害 = param[7] × 攻击力 = 0.55126 × 攻击力
```

---

#### 示例1.2: 法器角色普通攻击 - 元素伤害（纳西妲）

**角色**: 纳西妲 (10000073) - 行相

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "一段伤害|{param1:F1P}",           // param1 = 0.403048 (等级1)
  "二段伤害|{param2:F1P}",           // param2 = 0.369744
  "三段伤害|{param3:F1P}",           // param3 = 0.458744
  "四段伤害|{param4:F1P}",           // param4 = 0.584064
  "重击伤害|{param5:F1P}",           // param5 = 1.32
  "重击体力消耗|{param6:F1}点",
  "下坠期间伤害|{param7:F1P}",
  "低空/高空坠地冲击伤害|{param8:P}/{param9:P}"
]

// 武器类型: WEAPON_CATALYST (法器)
// 元素类型: 草元素

// paramMap["01"] (等级1的参数值)
[0.403048, 0.369744, 0.458744, 0.584064, 1.32, 50, 0.568288, 1.136335, 1.419344, ...]
```

**说明**: 法器角色的普通攻击使用角色元素属性（纳西妲为草元素），而非物理伤害。

**推断过程**:

**步骤1: 识别伤害的行**
- 第1-4行: 普通攻击的各段伤害
- 第5行: 重击伤害
- 第7-9行: 下落攻击伤害

**步骤2: 提取参数索引**
- 普通攻击: `param1`到`param4` → `indexes = [0, 1, 2, 3]`
- 重击: `param5` → `indexes = [4]`
- 下落攻击: `param7-9` → `indexes = [6, 7, 8]`

**步骤3: 判断 canOverride**
- 技能类型: normal
- 武器类型: 法器
- 结果: `canOverride = false` (法器普通攻击使用元素伤害，不可被附魔覆盖)

**步骤4: 判断 elementBonusType**
- 法器角色普通攻击使用角色元素
- 纳西妲是草元素角色 → `elementBonusType = "DMG_BONUS_DENDRO"`

**步骤5: 判断 attackBonusType**
- 普通攻击 → `attackBonusType = "DMG_BONUS_NORMAL"`
- 重击 → `attackBonusType = "DMG_BONUS_CHARGED"`
- 下落攻击 → `attackBonusType = "DMG_BONUS_PLUNGING"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [0, 1, 2, 3],           // 普通攻击一段到四段
    "base": "ATTACK",
    "canOverride": false,              // 法器普通攻击不可覆盖
    "elementBonusType": "DMG_BONUS_DENDRO",  // 使用角色元素（草）
    "attackBonusType": "DMG_BONUS_NORMAL"
  }
}
```

**对比物理普通攻击（神里绫华）**:
- 神里绫华: `canOverride: true`, `elementBonusType: "DMG_BONUS_PHYSICAL"`
- 纳西妲: `canOverride: false`, `elementBonusType: "DMG_BONUS_DENDRO"`

---

#### 示例1.3: 参考技能配置 - 雷泽狼魂伤害

**角色**: 雷泽 (10000020) - 雷牙（元素爆发）

**源数据**:
```javascript
// elementalBurst 的 paramDescList (简体中文)
[
  "爆发伤害|{param1:P}",              // param1 = 1.6 (等级1)
  "狼魂伤害|{param2:F1P}普通攻击伤害",  // param2 = 0.24，关键！参考普通攻击
  "普通攻击速度提升|{param3:P}",      // param3 = 0.26
  "雷元素抗性提升|{param4:P}",        // param4 = 0.8
  "持续时间|{param5:F1}秒",
  "冷却时间|{param6:F1}秒",
  "元素能量|{param7:I}"
]

// normal 的 paramDescList (简体中文)
[
  "一段伤害|{param1:F1P}",            // param1 = 0.9592 (等级1)，被引用的参数
  ...
]

// elementalBurst desc (简体中文): "...狼魂存在期间，会与雷泽共同战斗...狼魂会随雷泽的普通攻击协同攻击，造成雷元素伤害..."
```

**说明**: 狼魂的伤害基于普通攻击倍率，再乘以狼魂自己的倍率。这种机制需要使用`originSkills`来引用普通攻击的参数。

**推断过程**:

**步骤1: 识别参考技能**
- 描述: "狼魂伤害|{param2:F1P}**普通攻击伤害**"
- "普通攻击伤害" → 参考 `normal` 技能
- desc中也明确说明"会随雷泽的普通攻击协同攻击"

**步骤2: 提取当前技能的 indexes**
- `param2` (狼魂伤害) → `indexes = [1]`

**步骤3: 提取 originIndexes**
- normal 的 `param1` (一段伤害) → `originIndexes = [0]`
- 注: 这里作为例子只使用第一段普通攻击，实际配置中需要引用所有段数

**步骤4: 确定 originRelations**
- 描述格式: "X%普通攻击伤害" → 乘法关系
- 结果: `originRelations = ["*"]`

**步骤5: 判断其他字段**
- 技能类型: elementalBurst
- 元素: 雷（desc中明确"造成雷元素伤害"）→ `elementBonusType = "DMG_BONUS_ELECTRO"`
- 攻击类型: 虽然是元素爆发，但伤害是"随普通攻击协同攻击" → `attackBonusType = "DMG_BONUS_NORMAL"`

**步骤6: 判断是否需要特殊标签 (tag)**

**如何判断是否需要添加tag？**

需要检查角色的所有proudSkills（突破天赋）和talents（命座），查找是否有以下情况：
1. 专门针对"狼魂"的伤害加成
2. 提到"Soul Companion"、"狼魂"等关键词

**检查源数据 (proudSkills)**:
```javascript
// proudSkills[2] - "魔女的前夜礼·苍雷奔涌"
{
  "desc": {
    "cn_sim": "...雷泽的元素爆发雷牙唤醒的雷狼存在期间，如果雷泽积攒元素战技利爪与苍雷中的雷之印时发生溢出，雷狼将会引下落雷攻击附近的敌人，造成相当于雷泽150%攻击力的雷元素范围伤害...",
    "en": "...While the Wolf Within summoned by Razor's Elemental Burst Lightning Fang is active, if the Electro Sigils from Razor's Elemental Skill Claw and Thunder overflow, the Wolf Within will call down a lightning strike on nearby enemies, dealing AoE Electro DMG equal to 150% of Razor's ATK..."
  },
  "paramMap": {
    "01": [0.7, 1.5, 7, 1, ...]  // param1 = 0.7 (狼魂伤害提升比例)
  }
}
```

**分析过程**:
1. 天赋描述中提到"雷狼造成的伤害提升"
2. 这个加成只针对"狼魂"伤害，不包括元素爆发的直接伤害
3. 因此需要添加tag来区分狼魂伤害和爆发伤害
4. 从en中提取名称: "Soul Companion" → `tag = "RAZOR_SOUL_COMPANION"`

**结果**: 添加tag → `tag = "RAZOR_SOUL_COMPANION"`

**最终配置**:
```javascript
"elementalBurst": [
  {
    "damage": {
      "indexes": [0],                    // 爆发伤害 param[1]
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_ELECTRO",
      "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
    }
  },
  {
    "damage": {
      "originSkills": ["normal"],        // 参考普通攻击
      "originIndexes": [0],              // normal的param[0]（一段伤害）
      "originRelations": ["*"],          // 乘法关系
      "indexes": [1],                    // 当前技能的param[1]（狼魂倍率）
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_ELECTRO",
      "attackBonusType": "DMG_BONUS_NORMAL",
      "tag": "RAZOR_SOUL_COMPANION"      // 狼魂专属标签
    }
  }
]
```

**计算公式**:
```
狼魂伤害 = normal[0] × param[1] × 攻击力
         = (普通攻击一段倍率) × (狼魂倍率) × 攻击力
         = 0.9592 × 0.24 × 攻击力
         = 0.230208 × 攻击力
```

---

#### 示例1.4: 复合倍率伤害 - 纳西妲灭净三业

**角色**: 纳西妲 (10000073) - 所闻遍计（元素战技）

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "点按伤害|{param1:F1P}",              // param1 = 0.984 (等级1)
  "长按伤害|{param2:F1P}",              // param2 = 1.304
  "灭净三业伤害|{param3:F1P}攻击力+{param4:F1P}元素精通",  // 关键！复合倍率
  "灭净三业触发间隔|{param5:F1}秒",
  "蕴种印持续时间|{param6:F1}秒",
  "点按冷却时间|{param7:F1}秒",
  "长按冷却时间|{param8:F1}秒"
]

// paramMap["01"] (等级1的参数值)
[0.984, 1.304, 1.032, 2.064, 2.5, 25, 5, 6, ...]

// desc (简体中文): "...纳西妲将基于攻击力与元素精通，对该敌人及其所处连结中的所有敌人释放灭净三业，造成草元素伤害..."
```

**说明**: 灭净三业的伤害由两部分组成：基于攻击力的部分 + 基于元素精通的部分。这种机制需要使用`indexesAttach`和`baseAttach`来配置额外的倍率。

**推断过程**:

**步骤1: 识别每一行的含义和参数**
- 第1行: 点按伤害（元素战技直接伤害）
- 第2行: 长按伤害（元素战技直接伤害）
- 第3行: 灭净三业伤害（复合倍率：攻击力 + 元素精通）

**步骤2: 分析灭净三业的复合倍率**
- 描述格式: `{param3:F1P}攻击力+{param4:F1P}元素精通`
- 主要倍率: `param3攻击力` → `indexes = [2]`, `base = "ATTACK"`
- 额外倍率: `+ param4元素精通` → `indexesAttach = [[3]]`, `baseAttach = ["ELEMENTAL_MASTERY"]`
- 计算关系: 有`+`号 → 加法

**步骤3: 判断其他字段**
- 技能类型: skill → `attackBonusType = "DMG_BONUS_SKILL"`
- 元素: 草 → `elementBonusType = "DMG_BONUS_DENDRO"`

**步骤4: 判断是否需要特殊标签 (tag)**

**如何判断是否需要添加tag？**

需要检查角色的所有proudSkills（突破天赋）和talents（命座），查找是否有以下情况：
1. 专门针对"灭净三业"的伤害加成
2. 提到"Tri-Karma Purification"、"灭净三业"等关键词

**检查源数据 (proudSkills)**:
```javascript
// proudSkills[1] - "慧明缘觉智论"
{
  "desc": {
    "cn_sim": "基于纳西妲元素精通超过200点的部分，每1点元素精通能使所闻遍计的灭净三业造成的伤害提升0.1%，暴击率提升0.03%。通过这种方式，至多使灭净三业造成的伤害提升80%，暴击率提升24%。",
    "en": "Each point of Nahida's Elemental Mastery beyond 200 will grant 0.1% Bonus DMG and 0.03% CRIT Rate to Tri-Karma Purification from \"All Schemes to Know\". A maximum of 80% Bonus DMG and 24% CRIT Rate can be granted to Tri-Karma Purification in this manner."
  },
  "paramMap": {
    "01": [200, 800, 0.001, 0.003, ...]  // param1 = 200 (基础值), param2 = 800 (上限)
  }
}
```

**分析过程**:
1. 天赋描述中明确提到"灭净三业造成的伤害提升"和"Tri-Karma Purification"
2. 这个加成只针对"灭净三业"伤害，不包括元素战技的点按/长按直接伤害
3. 因此需要添加tag来区分灭净三业伤害和其他元素战技伤害
4. 从en中提取名称: "Tri-Karma Purification" → `tag = "NAHIDA_TRI_KARMA"`

**结果**: 添加tag → `tag = "NAHIDA_TRI_KARMA"`

**步骤4: 为每个效果创建配置对象**
- 点按伤害 → 第1个 `damage` 对象
- 长按伤害 → 第2个 `damage` 对象
- 灭净三业伤害 → 第3个 `damage` 对象（复合倍率）

**最终配置** (data.json中的实际配置):
```javascript
"skill": [
  {
    "damage": {                         // 点按伤害
      "indexes": [0],
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_DENDRO",
      "attackBonusType": "DMG_BONUS_SKILL"
    }
  },
  {
    "damage": {                         // 长按伤害
      "indexes": [1],
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_DENDRO",
      "attackBonusType": "DMG_BONUS_SKILL"
    }
  },
  {
    "damage": {                         // 灭净三业伤害（复合倍率）
      "indexes": [2],                    // 主要倍率: param[2] × 攻击力
      "indexesAttach": [[3]],            // 额外倍率: param[3] × 元素精通
      "base": "ATTACK",
      "baseAttach": ["ELEMENTAL_MASTERY"],
      "elementBonusType": "DMG_BONUS_DENDRO",
      "attackBonusType": "DMG_BONUS_SKILL",
      "tag": "NAHIDA_TRI_KARMA"
    }
  }
]
```

**计算公式**:
```
灭净三业伤害 = (param[2] × 攻击力) + (param[3] × 元素精通)
             = (1.032 × 攻击力) + (2.064 × 元素精通)
```

**⚠️ 重要说明**:
- `indexesAttach` 和 `baseAttach` 必须是数组格式，即使只有一个额外倍率
- 额外倍率的计算关系是固定的加法（`+`）
- 如果有多个额外倍率，`indexesAttach` 和 `baseAttach` 可以继续添加元素

---

#### 示例1.5: 最终计算队列 - 阿贝多生灭之花

**角色**: 阿贝多 (10000038) - 诞生式·大地之潮（元素爆发）

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "爆发伤害|{param1:P}",               // param1 = 3.672 (等级1)
  "生灭之花伤害|每朵{param2:F1P}",      // param2 = 0.72 (等级1)
  "冷却时间|{param3:F1}秒",
  "元素能量|{param4:I}"
]

// paramMap["01"] (等级1的参数值)
[3.672, 0.72, 12, 40, ...]

// desc (简体中文): "场上存在阿贝多自己创造的阳华时，会在阳华的领域内生成7朵生灭之花..."
```

**说明**: 生灭之花的伤害基于花朵数量计算。每朵花造成固定伤害，总伤害 = 每朵花伤害 × 花朵数量。花朵数量通过`VAR_CHARA_1`变量控制（1-7朵）。

**推断过程**:

**步骤1: 识别每一行的含义**
- 第1行: 爆发伤害（元素爆发直接伤害）
- 第2行: 生灭之花伤害（每朵花，需要乘以花朵数量）

**步骤2: 提取生灭之花的参数**
- 描述: "生灭之花伤害|每朵{param2:F1P}"
- `param2` → 数组索引 = 2-1 = 1
- 基础属性: 默认攻击力 → `base = "ATTACK"`

**步骤3: 确定最终计算队列**
- 生灭之花伤害基于花朵数量计算
- `VAR_CHARA_1` = 生灭之花数量（由Buff滑块控制，1-7朵）
- 计算公式: 每朵花伤害 × (0 + VAR_CHARA_1)
- 使用 `finalResCalQueue` 实现这个计算

**步骤4: 判断其他字段**
- 技能类型: elementalBurst → `attackBonusType = "DMG_BONUS_ELEMENTAL_BURST"`
- 元素: 岩 → `elementBonusType = "DMG_BONUS_GEO"`

**步骤5: 判断是否需要特殊标签 (tag)**

**如何判断是否需要添加tag？**

需要检查角色的所有proudSkills（突破天赋）和talents（命座），查找是否有以下情况：
1. 专门针对"生灭之花"的伤害加成
2. 提到"Fatal Blossom"、"生灭之花"等关键词

**检查源数据 (talents)**:
```javascript
// talents[1] - "显生之宙" (命座2)
{
  "desc": {
    "cn_sim": "...施放诞生式·大地之潮时，清除所有生灭计数效果，并根据清除的层数，提高诞生式·大地之潮的爆发伤害与生灭之花造成的伤害；每层生灭计数，会提高等同于阿贝多防御力的30%的伤害；该效果至多叠加4次。",
    "en": "...Unleashing Rite of Progeniture: Tectonic Tide consumes all stacks of Fatal Reckoning. Each stack of Fatal Reckoning consumed increases the DMG dealt by Fatal Blossoms and Rite of Progeniture: Tectonic Tide's burst DMG by 30% of Albedo's DEF. This effect stacks up to 4 times."
  },
  "paramMap": {
    "01": [0.3, 3, ...]  // param1 = 0.3 (每层提升比例), param2 = 3 (最大层数)
  }
}
```

**分析过程**:
1. 命座描述中明确提到"生灭之花造成的伤害"和"Fatal Blossoms"
2. 这个加成同时影响"爆发伤害"和"生灭之花伤害"，但两者是独立的
3. 为了让buff系统可以区分这两种伤害并分别应用加成，需要添加tag
4. 从en中提取名称: "Fatal Blossom" → `tag = "ALBEDO_FATAL_BLOSSOM"`

**结果**: 添加tag → `tag = "ALBEDO_FATAL_BLOSSOM"`

**步骤6: 定义VAR_CHARA_1变量**

由于生灭之花的伤害基于花朵数量计算，需要定义一个滑块来控制花朵数量。

**VAR_CHARA_1定义配置**:
```javascript
"buffs": [
  {
    "showIndex": 1,                      // 显示顺序
    "setTos": ["VAR_CHARA_1"],          // 设置的目标变量
    "settingType": "slider",            // 滑块类型
    "sliderInitialValue": 1,            // 初始值：1朵花
    "sliderMin": 1,                     // 最小值：1朵花
    "sliderMax": 7,                     // 最大值：7朵花
    "sliderStep": 1,                    // 步长：1
    "title": "BUFF.COMMON_QUANTITY.TITLE"  // 显示标题（i18n key）
  }
]
```

**配置说明**:
- `showIndex`: 控制Buff在UI中的显示顺序
- `setTos`: 设置的目标变量数组（这里设置VAR_CHARA_1）
- `sliderInitialValue`: 滑块初始值（默认1朵花）
- `sliderMin/Max`: 滑块范围（1-7朵花，对应desc中提到的7朵生灭之花）
- `sliderStep`: 滑块步长（每次调整1朵）
- `title`: i18n key，用于多语言显示

**步骤5: 为每个效果创建配置对象**
- 爆发伤害 → 第1个 `damage` 对象
- 生灭之花伤害 → 第2个 `damage` 对象（带最终计算队列）

**最终配置** (data.json中的实际配置):
```javascript
"elementalBurst": [
  {
    "damage": {                         // 爆发伤害
      "indexes": [0],
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_GEO",
      "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
    }
  },
  {
    "buffs": [                          // VAR_CHARA_1 定义（生灭之花数量滑块）
      {
        "showIndex": 1,
        "setTos": ["VAR_CHARA_1"],
        "settingType": "slider",
        "sliderInitialValue": 1,
        "sliderMin": 1,
        "sliderMax": 7,
        "sliderStep": 1,
        "title": "BUFF.COMMON_QUANTITY.TITLE"
      }
    ]
  },
  {
    "damage": {                         // 生灭之花伤害
      "indexes": [1],                    // param[1] 每朵花伤害
      "base": "ATTACK",
      "finalResCalQueue": [              // 基于花朵数量的计算
        {
          "relation": "*",               // 乘法
          "inner": [
            {
              "relation": "+",
              "variable": "VAR_CHARA_1" // 花朵数量（1-7）
            }
          ]
        }
      ],
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_GEO",
      "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST",
      "tag": "ALBEDO_FATAL_BLOSSOM"
    }
  }
]
```

**计算公式**:
```
每朵花伤害 = param[1] × 攻击力 = 0.72 × 攻击力
总伤害 = 每朵花伤害 × (0 + VAR_CHARA_1)
       = 0.72 × 攻击力 × (0 + 花朵数量)

例如: 花朵数量 = 3
总伤害 = 0.72 × 攻击力 × 3 = 2.16 × 攻击力
```

**显示逻辑**:
```
用户通过Buff滑块设置花朵数量（1-7朵）
伤害计算时自动乘以花朵数量
```

---

#### 示例1.6: 特殊伤害类型 - 菈乌玛月绽放伤害

**角色**: 菈乌玛 (10000119) - 元素战技

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "点按伤害|{param1:F1P}",
  "长按一段伤害|{param2:F1P}",
  "长按二段伤害|每枚草露{param3:F1P}元素精通",  // 关键！月绽放伤害
  ...
]

// desc (简体中文): "...咏唱狩猎的祷歌，造成草元素范围伤害...与一次视为月绽放反应伤害的草元素范围伤害"
```

**说明**: 菈乌玛的长按二段伤害被明确说明为"视为月绽放反应伤害"的草元素伤害。这种特殊伤害类型需要使用`specialDamageType`来标记。

**推断过程**:

**步骤1: 识别特殊伤害类型**
- desc明确说明: "视为月绽放反应伤害"
- 由于技能中有明确技能倍率，因此视为**直接**月绽放伤害
- 使用 `specialDamageType = "moon-rupture-direction"`

**步骤2: 提取参数**
- 描述: "长按二段伤害|每枚草露{param3:F1P}元素精通"
- `param3` → `indexes = [2]`
- 基础属性: 元素精通 → `base = "ELEMENTAL_MASTERY"`

**步骤3: 确定最终计算队列**
- 伤害基于草露数量计算
- `VAR_CHARA_5` = 草露数量（1-3个）
- 计算公式: 每枚草露伤害 × (0 + VAR_CHARA_5)

**步骤4: 判断其他字段**
- 技能类型: skill → `attackBonusType = "DMG_BONUS_SKILL"`
- 元素: 草 → `elementBonusType = "DMG_BONUS_DENDRO"`
- 特殊伤害类型: 月绽放 → `specialDamageType = "moon-rupture-direction"`

**最终配置**:
```javascript
{
  "damage": {
    "indexes": [2],                      // param[2]
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
    "attackBonusType": "DMG_BONUS_SKILL",
    "specialDamageType": "moon-rupture-direction"  // 直接月绽放伤害
  }
}
```

**计算公式**:
```
每枚草露伤害 = param[2] × 元素精通
总伤害 = 每枚草露伤害 × (0 + VAR_CHARA_5)
       = param[2] × 元素精通 × (0 + 草露数量)
```

---

### 2. 增益配置示例

#### 示例2.1: 开关型增益 - 元素附魔（神里绫华）

**角色**: 神里绫华 (10000002) - other 技能（神里流·霰步）

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "启动体力消耗|{param1:F1}点",      // param1 = 10
  "持续体力消耗|每秒{param2:F1}点",   // param2 = 15
  "附魔持续时间|{param3:F1}秒"        // param3 = 5
]

// paramMap["01"] (等级1的参数值)
[10, 15, 5, ...]

// desc (简体中文): "...将寒气凝聚在剑上，使神里绫华在短时间内获得冰元素附魔..."
```

**说明**: 元素附魔是一种特殊的增益效果，它不会直接提供数值加成，而是改变普通攻击、重击、下落攻击的元素类型。

**推断过程**:

**步骤1: 从desc识别增益类型**
- desc描述: "将寒气凝聚在剑上，使神里绫华在短时间内获得冰元素附魔"
- 这是元素附魔效果，可以主动开启 → `settingType = "switch"`

**步骤2: 确定附魔的元素类型**
- desc中明确提到: "冰元素附魔"
- 结果: `overrideElement = "DMG_BONUS_CRYO"`

**步骤3: 设置其他必要字段**
- 附魔不需要实际数值buff → `target = []` (空数组)
- 默认关闭 → `defaultEnable = false`
- index可以是任意值（因为不涉及实际数值计算）→ `index = 1`

**最终配置**:
```javascript
"other": [
  {
    "buffs": [
      {
        "index": 1,                          // 任意一个Index即可
        "overrideElement": "DMG_BONUS_CRYO",  // 冰元素附魔
        "target": [],                        // 空数组，不追加实际Buff
        "settingType": "switch",             // 开关型
        "defaultEnable": false               // 默认关闭
      }
    ]
  }
]
```

**效果说明**:
- 开启后，普通攻击、重击、下落攻击从物理伤害转为冰元素伤害
- 持续时间内有效（param3 = 5秒）
- 附魔可以被再次使用刷新持续时间

---

#### 示例2.2: 开关型增益 - 班尼特攻击力提升

**角色**: 班尼特 (10000032) - 元素爆发「美妙旅程」

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "技能伤害|{param1:P}",               // 爆发伤害
  "持续治疗|每秒{param2:F2P}生命值上限+{param3:I}",  // 治疗效果
  "攻击力加成比例|{param4:P}",           // param4 = 0.56 (等级1)，关键！
  "持续时间|{param5:F1}秒",
  "冷却时间|{param6:F1}秒",
  "元素能量|{param7:I}"
]

// paramMap["01"] (等级1的参数值)
[2.328, 0.06, 577.3388, 0.56, 12, 15, 60, ...]

// desc (简体中文): "...领域内的角色如果生命值高于70%，会基于班尼特的基础攻击力，以一定比例获得攻击力加成..."
```

**说明**: 班尼特的元素爆发同时包含伤害、治疗和攻击力增益三种效果。攻击力增益基于班尼特的**基础攻击力**，而非最终攻击力。

**推断过程**:

**步骤1: 分析每一行的含义和参数**
- 第1行: 爆发伤害（伤害效果）
- 第2-3行: 持续治疗（治疗效果）
- 第4行: 攻击力加成比例（增益效果）
- 第5-7行: 持续时间、冷却时间、元素能量

**步骤2: 识别增益类型**
- desc描述: "领域内...获得攻击力加成"
- 领域内持续生效，可以主动开启 → `settingType = "switch"`

**步骤3: 确定基础属性**
- desc明确提到: "基础攻击力"
- ⚠️ **重要**: 是 `ATTACK_BASE` (基础攻击力)，不是 `ATTACK` (最终攻击力)
- 结果: `base = "ATTACK_BASE"`

**步骤4: 确定目标效果**
- 提升攻击力数值（百分比形式的数值提升）
- 结果: `target = ["ATTACK_VAL_UP"]`

**步骤5: 确定目标范围**
- desc描述: "领域内的角色" → 影响全队
- 结果: `isAllTeam = true`

**步骤6: 提取参数索引**
- `param4` (攻击力加成比例) → index = 4-1 = 3

**步骤7: 为每个效果创建配置对象**
- 爆发伤害 → `damage` 对象
- 持续治疗 → `healing` 对象
- 攻击力增益 → `buffs` 对象

**最终配置** (data.json中的实际配置):
```javascript
"elementalBurst": [
  {
    "damage": {                         // 爆发伤害
      "indexes": [0],
      "base": "ATTACK",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_PYRO",
      "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
    }
  },
  {
    "healing": {                        // 持续治疗
      "index": 1,
      "constIndex": 2,
      "constCalRelation": "+",
      "base": "HP",
      "healingBonusType": "HEALING_BONUS_ELEMENTAL_BURST"
    }
  },
  {
    "buffs": [                          // 攻击力增益
      {
        "index": 3,                      // 对应param[3]
        "base": "ATTACK_BASE",           // ⚠️ 基于基础攻击力
        "target": ["ATTACK_VAL_UP"],     // 提升攻击力数值
        "settingType": "switch",         // 开关型
        "defaultEnable": false,          // 默认关闭
        "isAllTeam": true                // 全队生效
      }
    ]
  }
]
```

**计算公式**:
```
攻击力提升 = param[3] × 班尼特的基础攻击力
           = 0.56 × 基础攻击力

例如: 基础攻击力 = 1000
攻击力提升 = 0.56 × 1000 = 560
```

**⚠️ 重要说明**:
- 班尼特的攻击力增益基于**基础攻击力**，不是最终攻击力
- 基础攻击力 = 角色白值攻击力 + 武器白值攻击力
- 不包含圣遗物、沙漏等提供的攻击力加成

---

#### 示例2.3: 滑块型增益 - 芙宁娜气氛值

**角色**: 芙宁娜 (10000089) - 元素爆发「万众狂欢」

**源数据**:
```javascript
// paramDescList (简体中文)
[
  "技能伤害|{param1:F1P}生命值上限",      // 爆发伤害
  "持续时间|{param2:F1}秒",
  "气氛值上限|{param4:I}",                   // param4 = 300
  "气氛值转化提升伤害比例|{param5:F2P}",     // param5 = 0.0007 (每点气氛值)
  "气氛值转化受治疗加成比例|{param6:F2P}",   // param6 = 0.0001 (每点气氛值)
  "冷却时间|{param7:F1}秒",
  "元素能量|{param8:I}"
]

// paramMap["01"] (等级1的参数值)
[0.114064, 18, 0.01, 300, 0.0007, 0.0001, 15, 60, ...]

// desc (简体中文): "...每1%都将使芙宁娜获得1点「气氛值」。同时，基于芙宁娜持有的「气氛值」，附近的队伍中所有角色造成的伤害提升，受治疗加成提升。"
```

**说明**: 芙宁娜的气氛值是一个动态变化的值，范围0-300。气氛值越高，提供的伤害加成和受治疗加成越高。需要使用滑块来模拟这个可变值。

**推断过程**:

**步骤1: 分析每一行的含义和参数**
- 第1行: 技能伤害（爆发伤害）
- 第2行: 持续时间
- 第3行: 气氛值上限（非伤害，用于确定滑块最大值）
- 第4-5行: 气氛值转化比例（增益效果）

**步骤2: 识别增益类型**
- desc描述: "每1%都将使芙宁娜获得1点「气氛值」。同时，基于芙宁娜持有的「气氛值」...伤害提升，受治疗加成提升"
- 这是一个可变数值的效果，用滑块模拟 → `settingType = "slider"`

**步骤3: 确定数值范围**
- `param4` = 300 (气氛值上限)
- 设置滑块最大值 → `sliderMax = 300`
- 初始值 → `sliderInitialValue = 0`

**步骤4: 确定目标效果**
- desc描述: "造成的伤害提升，受治疗加成提升"
- 需要两个不同的target:
  - 伤害加成 → `DMG_BONUS_ALL`
  - 受到治疗加成 → `REVERSE_HEALING_BONUS`
- 全队生效 → `isAllTeam = true`

**步骤5: 提取参数索引**
- `param5` (伤害转化比例) → index = 5-1 = 4
- `param6` (治疗转化比例) → index = 6-1 = 5

**步骤6: 理解双对象配置**
- 因为两个不同的param需要共享同一个滑块值
- 所以使用两个buff对象：
  - 第一个对象定义滑块和受治疗加成
  - 第二个对象仅定义伤害加成（共享第一个对象的滑块值）

**步骤7: 为每个效果创建配置对象**
- 爆发伤害 → `damage` 对象
- 气氛值增益 → `buffs` 数组（两个对象）

**最终配置** (data.json中的实际配置):
```javascript
"elementalBurst": [
  {
    "damage": {                         // 爆发伤害
      "indexes": [0],
      "base": "HP",
      "canOverride": false,
      "elementBonusType": "DMG_BONUS_HYDRO",
      "attackBonusType": "DMG_BONUS_ELEMENTAL_BURST"
    }
  },
  {
    "buffs": [                          // 气氛值增益（双对象配置）
      {
        "index": 5,                      // 对应param[6]
        "target": ["REVERSE_HEALING_BONUS"],  // 受到治疗加成
        "settingType": "slider",         // 滑块型
        "sliderInitialValue": 0,         // 初始值0
        "sliderMax": 300,                // 最大300点气氛值
        "sliderStep": 1,                 // 步长1
        "isAllTeam": true                // 全队生效
      },
      {
        "index": 4,                      // 对应param[5]
        "target": ["DMG_BONUS_ALL"],     // 所有伤害加成
        "isAllTeam": true                // 全队生效
      }
    ]
  }
]
```

**计算公式**:
```
伤害提升 = 气氛值 × param[5]
受治疗提升 = 气氛值 × param[6]

例如: 气氛值 = 300（最大值）
伤害提升 = 300 × 0.0007 = 0.21 = 21%
受治疗提升 = 300 × 0.0001 = 0.03 = 3%
```

**机制说明**:
- 队友每变化1%生命值上限，芙宁娜获得1点气氛值
- 气氛值上限为300点
- 每点气氛值提供 param[5] 的伤害加成和 param[6] 的受治疗加成
- 用户通过滑块手动设置气氛值（模拟实际游戏中的变化）

**⚠️ 重要说明**:
- 双对象配置的第一个对象必须包含 `settingType` 相关字段
- 第二个对象只需要 `index` 和 `target`，会自动共享第一个对象的滑块值

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
