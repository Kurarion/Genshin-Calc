## 1. 分析现有代码结构
- [x] 1.1 分析genshindata/clac.go中的技能处理逻辑
- [x] 1.2 确认InherentProudSkillOpens和SpecialProudSkillOpens的处理位置

## 2. 修改技能处理逻辑
- [x] 2.1 收集所有InherentProudSkillOpens和SpecialProudSkillOpens
- [x] 2.2 创建临时数组存储所有技能
- [x] 2.3 将InherentProudSkillOpens添加到临时数组
- [x] 2.4 将SpecialProudSkillOpens插入到InherentProudSkillOpens的最后一个item的前面
- [x] 2.5 将处理后的临时数组赋值给ProudSkills

## 3. 测试和验证
- [x] 3.1 确保修改后的代码能够正确编译
- [x] 3.2 验证输出数据中技能的顺序是否符合预期
- [x] 3.3 确保没有破坏现有功能

## 4. 文档更新
- [x] 4.1 如有必要，更新相关代码注释