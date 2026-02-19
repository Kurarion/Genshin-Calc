# 版本归档

此目录用于保存重要版本的特殊配置示例，供后续参考使用。

## 目录结构

```
archive/
├── v4.x.x/              # 按游戏版本归档
│   ├── README.md        # 版本特殊说明
│   ├── characters/      # 特殊角色配置示例
│   └── mechanics/       # 特殊机制说明
```

## 归档原则

### 何时归档

遇到以下情况时应创建版本归档：

1. **新机制引入**

   - 新元素反应类型
   - 新增特殊标签系统
   - 新的buff/debuff机制

2. **特殊角色**

   - 有独特计算逻辑的角色
   - 多层嵌套buff配置
   - 复杂的元素转换/附魔机制

3. **重要修复**
   - 重大计算逻辑修复
   - 影响多个角色的配置调整

### 归档内容

每个版本归档应包含：

- **README.md**: 版本概述、新增功能说明、特殊机制描述
- **配置示例**: 特殊角色的完整配置文件
- **实现说明**: 特殊机制的实现逻辑和代码片段

## 示例归档格式

### v4.x.x/README.md

```markdown
# v4.x.x 版本更新

## 新增内容

- 新增角色：[角色名]
- 新增武器：[武器名]
- 新增圣遗物：[圣遗物名]

## 特殊机制

### 机制1：[机制名称]
- 描述：简要说明
- 影响：受影响的角色/武器
- 配置：参考对应配置文件

## 重要更新

- [修复/优化内容]
```

## Git管理策略

**归档文件可选提交**：

- 特殊机制的示例：建议提交
- 临时生成的测试文件：不提交
- 中间数据文件：不提交

提交时使用清晰的commit message：

```
docs(genshin-data-generator): archive v4.x.x special configurations

- Add special mechanism examples for [角色名]
- Document new [机制名称] implementation
```

## 参考文档

- [高级配置指南](../references/advanced-config.md)
- [游戏机制参考](../references/game-mechanics.md)
- [更新检查清单](../references/update-checklist.md)
