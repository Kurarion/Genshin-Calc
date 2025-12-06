## 1. 后端数据结构更新
- [x] 1.1 在 `genshindata/genshintype.go` 中的 `GenshinAvatarSkillData` 和 `GenshinAvatarTalentData` 结构体添加 `SpecialDescTextMapHash uint64` 字段（JSON标签保持"IACNAENANDH"）
- [x] 1.2 在 `genshindata/datatype.go` 中的 `AVATARSKILLINFO` 结构体添加 `SpecialDesc map[string]string` 字段

## 2. 数据处理逻辑更新
- [x] 2.1 在 `genshindata/clac.go` 中更新技能处理逻辑，为每个AVATARSKILLINFO初始化SpecialDesc字段
- [x] 2.2 SpecialDesc初始化时应包含所有支持语言键：cn_sim, cn_tra, en, jp，初始值为空字符串
- [x] 2.3 当SpecialDescTextMapHash > 0时，调用TextMap解析函数获取进化技能描述文本（覆盖Normal、Skill、ElementalBurst、Other、Talent等所有技能类型）
- [x] 2.4 将解析后的文本存储到SpecialDesc字段对应语言键中
- [x] 2.5 当SpecialDescTextMapHash = 0或解析失败时，保持SpecialDesc字段对应语言为空字符串
- [x] 2.6 确保所有技能的SpecialDesc字段始终存在

## 3. 前端显示逻辑更新
- [x] 3.1 修改 `src/app/features/character/component/talent/talent.component.html` 中的显示逻辑
- [x] 3.2 更新显示逻辑：检查SpecialDesc[currentLanguage]是否为空字符串
- [x] 3.3 当SpecialDesc不为空时显示进化文本，为空时回退到Desc
- [x] 3.4 在相关的前端组件中添加相同的回退逻辑（talent和constellation组件）
- [x] 3.5 确保前端不需要检查字段是否存在，只需要检查内容是否为空

## 4. 数据验证和测试
- [x] 4.1 验证包含IACNAENANDH字段的原始数据能够正确解析（JSON标签正确映射到SpecialDescTextMapHash）
- [x] 4.2 测试有进化技能描述的字符能够正确显示进化文本
- [x] 4.3 测试没有进化技能描述的字符仍能正常显示原始文本（SpecialDesc为空）
- [x] 4.4 验证多语言切换时文本显示正确
- [x] 4.5 验证所有技能对象都包含SpecialDesc字段，不为nil

## 5. 错误处理和边界情况
- [x] 5.1 处理IACNAENANDH字段不存在的情况（向后兼容，默认值为0）
- [x] 5.2 处理IACNAENANDH值无效（无法解析到文本）的情况，保持SpecialDesc为空字符串
- [x] 5.3 确保数据输出格式保持一致性和向后兼容性
- [x] 5.4 验证SpecialDesc字段总是被初始化，从不会是nil

## 6. 集成和部署
- [x] 6.1 重新编译和生成处理后的数据文件
- [x] 6.2 测试前端应用加载更新后的数据
- [x] 6.3 验证所有技能显示功能正常工作

## 7. ProudSkills进化描述支持（新增）
- [x] 7.1 在 `genshindata/genshintype.go` 中的 `GenshinAvatarProudSkillData` 结构体添加 `SpecialDescTextMapHash uint64` 字段（JSON标签保持"IACNAENANDH"）
- [x] 7.2 在 `genshindata/clac.go` 中更新固有技能（InherentProudSkillOpens）处理逻辑，使用 `getSpecialDesc()` 函数填充 SpecialDesc 字段
- [x] 7.3 在 `genshindata/clac.go` 中更新特殊技能（SpecialProudSkillOpens）处理逻辑，使用 `getSpecialDesc()` 函数填充 SpecialDesc 字段
- [x] 7.4 验证前端 TypeScript 接口已支持 ProudSkills 的 SpecialDesc（CharSkill 接口已包含 specialDesc 字段）
- [x] 7.5 验证前端组件（talent.component.ts 和 constellation.component.ts）的 getSkillDescription 方法已正确处理 SpecialDesc 优先级
- [x] 7.6 测试包含进化描述的 ProudSkills 能够正确显示进化文本，不包含的显示原始描述