# Change: 添加特殊技能处理逻辑

## Why
在genshindata/clac.go中已经存在SpecialProudSkillOpens的处理逻辑（第897-923行），但这些技能被简单地追加到ProudSkills数组的末尾。根据需求，SpecialProudSkillOpens应该插入在InherentProudSkillOpens的最后一个item的前面，以保持技能的正确顺序。

## What Changes
- 修改genshindata/clac.go中的技能处理逻辑
- 将SpecialProudSkillOpens插入到InherentProudSkillOpens的最后一个item的前面
- 保持其他处理逻辑不变

## Impact
- 受影响的代码: genshindata/clac.go
- 受影响的功能: 角色技能数据处理
- 数据输出: ProudSkills数组中技能的顺序