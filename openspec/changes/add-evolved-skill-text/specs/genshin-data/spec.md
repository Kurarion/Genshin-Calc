## MODIFIED Requirements

### Requirement: 角色技能数据处理
系统在处理角色技能数据时，SHALL按照以下顺序排列技能：
1. InherentProudSkillOpens（固有技能）
2. SpecialProudSkillOpens（特殊技能）
3. 其他技能
AND SHALL支持处理进化后的技能描述文本

#### Scenario: 技能顺序处理
- **WHEN** 系统处理角色技能数据时
- **THEN** SpecialProudSkillOpens SHALL插入在InherentProudSkillOpens的最后一个item的前面
- **AND** SHALL保持技能数据的其他处理逻辑不变

#### Scenario: 数据输出验证
- **WHEN** 系统输出角色技能数据到ProudSkills数组时
- **THEN** 数组中技能的顺序 SHALL符合上述要求的顺序
- **AND** 每个技能的属性和数据 SHALL完整保留

#### Scenario: 进化技能描述处理
- **WHEN** 系统处理包含IACNAENANDH字段的技能数据时
- **AND** IACNAENANDH字段包含有效的TextMapHash值
- **THEN** 系统SHALL使用该TextMapHash解析对应的进化技能描述文本
- **AND** 将结果存储在AVATARSKILLINFO的SpecialDesc字段中
- **AND** SpecialDesc SHALL包含所有支持语言的翻译文本

## ADDED Requirements

### Requirement: 进化技能描述数据结构
系统SHALL在AVATARSKILLINFO结构中提供SpecialDesc字段以存储进化后的技能描述文本。

#### Scenario: 数据结构更新
- **WHEN** 定义AVATARSKILLINFO结构时
- **THEN** SHALL包含SpecialDesc map[string]string字段
- **AND** 该字段SHALL用于存储多语言的进化技能描述文本
- **AND** SpecialDesc字段SHALL始终存在且包含所有支持语言的键
- **AND** 当没有有效进化文本时，对应语言的值SHALL为空字符串

#### Scenario: 原始数据解析
- **WHEN** 解析GenshinAvatarSkillData原始数据时
- **THEN** SHALL支持IACNAENANDH字段
- **AND** SHALL始终为SpecialDesc字段初始化包含所有语言键的map
- **AND** 当IACNAENANDH值大于0且能成功解析时
- **THEN** SHALL将解析后的文本填充到SpecialDesc字段对应语言
- **AND** 当IACNAENANDH值为0或解析失败时
- **THEN** SHALL将SpecialDesc字段对应语言设置为空字符串

### Requirement: 前端技能描述显示
前端组件在显示技能描述时，SHALL优先显示进化后的技能描述文本，当不可用时回退到原始描述。

#### Scenario: 进化技能描述优先显示
- **WHEN** 前端组件显示技能描述时
- **AND** SpecialDesc字段当前语言的值不为空字符串
- **THEN** SHALL显示SpecialDesc中的进化技能描述
- **AND** SHALL忽略原始Desc字段的内容

#### Scenario: 原始描述回退显示
- **WHEN** 前端组件显示技能描述时
- **AND** SpecialDesc字段当前语言的值为空字符串
- **THEN** SHALL回退显示Desc字段中的原始技能描述
- **AND** SHALL确保显示功能正常工作

#### Scenario: 多语言支持
- **WHEN** 用户切换语言时
- **THEN** 系统SHALL在SpecialDesc中查找对应语言的文本
- **AND** 当SpecialDesc中目标语言文本为空字符串时
- **THEN** SHALL回退到Desc字段中的对应语言文本