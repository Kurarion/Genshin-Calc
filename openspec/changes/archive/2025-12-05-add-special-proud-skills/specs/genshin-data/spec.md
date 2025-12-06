## ADDED Requirements
### Requirement: 角色技能数据处理
系统在处理角色技能数据时，SHALL按照以下顺序排列技能：
1. InherentProudSkillOpens（固有技能）
2. SpecialProudSkillOpens（特殊技能）
3. 其他技能

#### Scenario: 技能顺序处理
- **WHEN** 系统处理角色技能数据时
- **THEN** SpecialProudSkillOpens SHALL插入在InherentProudSkillOpens的最后一个item的前面
- **AND** SHALL保持技能数据的其他处理逻辑不变

#### Scenario: 数据输出验证
- **WHEN** 系统输出角色技能数据到ProudSkills数组时
- **THEN** 数组中技能的顺序 SHALL符合上述要求的顺序
- **AND** 每个技能的属性和数据 SHALL完整保留