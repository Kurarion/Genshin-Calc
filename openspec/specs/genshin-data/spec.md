# genshin-data Specification

## Purpose
TBD - created by archiving change add-special-proud-skills. Update Purpose after archive.
## Requirements
### Requirement: 角色技能数据处理
系统在处理角色技能数据时，SHALL按照以下顺序排列技能：InherentProudSkillOpens（固有技能）、SpecialProudSkillOpens（特殊技能），然后是其他技能，并且SHALL支持处理进化后的技能描述文本。

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
- **When** 前端组件显示技能描述时
- **And** SpecialDesc字段当前语言的值不为空字符串
- **Then** SHALL显示SpecialDesc中的进化技能描述
- **And** SHALL忽略原始Desc字段的内容

#### Scenario: 原始描述回退显示
- **When** 前端组件显示技能描述时
- **And** SpecialDesc字段当前语言的值为空字符串
- **Then** SHALL回退显示Desc字段中的原始技能描述
- **And** SHALL确保显示功能正常工作

#### Scenario: 多语言支持
- **When** 用户切换语言时
- **Then** 系统SHALL在SpecialDesc中查找对应语言的文本
- **And** 当SpecialDesc中目标语言文本为空字符串时
- **Then** SHALL回退到Desc字段中的对应语言文本

### Requirement: 角色背景图片加载处理
系统必须优雅处理角色背景图片加载失败的情况。
#### Scenario: 当用户访问角色页面时，如果背景图片URL无效或返回错误
- **Given** 角色的背景图片URL无法访问
- **When** 系统尝试加载背景图片
- **Then** 系统应在5秒内显示默认背景图片
- **And** 用户体验不应受到影响（无明显延迟或卡顿）
- **And** 系统应在控制台记录警告信息用于调试

### Requirement: 背景图片加载超时机制
系统应实现图片加载超时机制。
#### Scenario: 当背景图片加载时间过长时
- **Given** 背景图片加载开始
- **When** 加载时间超过5秒
- **Then** 系统应中断加载并切换到默认背景
- **And** UI应保持响应，不出现卡顿

### Requirement: Assets背景图片支持
系统应支持从本地assets目录加载角色背景图片。
#### Scenario: 当角色在assets/background/目录有对应背景图片时
- **Given** 角色英文名对应的PNG文件存在于assets/background/目录
- **When** 系统加载角色背景
- **Then** 系统应优先使用本地assets文件
- **And** 应使用2秒超时加载本地文件
- **And** 本地文件加载失败时fallback到远程URL

### Requirement: 背景图片缓存机制
系统应缓存背景图片加载结果。
#### Scenario: 当用户再次访问同一角色页面时
- **Given** 该角色的背景图片之前已成功加载
- **When** 用户再次访问该角色页面
- **Then** 系统应直接使用缓存的背景图片
- **And** 不重新发起网络请求
- **And** 背景应立即显示

