# 变更提案: 队伍伤害模拟器

## 基本信息
- **提案ID**: PROJ-2023-001
- **创建日期**: 2023-12-05
- **状态**: 草案
- **作者**: AI助手
- **审阅者**: 
- **优先级**: 高

## 变更概述
添加一个队伍伤害模拟器功能，允许用户模拟完整队伍的伤害输出，包括角色切换、元素反应和连招计算。

## 问题陈述
当前应用只支持单个角色的伤害计算，但原神是一个队伍游戏，实际伤害输出受到队伍配置、角色切换顺序和元素反应的影响。用户无法准确评估整个队伍的实战表现，特别是在复杂的元素反应和连招场景下。

## 解决方案
实现一个队伍伤害模拟器，支持以下功能：
1. 多角色队伍配置（最多4个角色）
2. 角色切换时间轴编辑
3. 元素反应自动计算
4. 伤害时间轴可视化
5. 总伤害统计和DPS计算
6. 常用连招模板保存

## 技术实现

### 前端组件
- `team-simulator.component.ts`: 主要模拟器组件
- `timeline-editor.component.ts`: 时间轴编辑器
- `damage-visualization.component.ts`: 伤害可视化图表
- `reaction-calculator.service.ts`: 元素反应计算服务

### 数据模型
```typescript
interface TeamSimulation {
  id: string;
  name: string;
  characters: CharacterSimulation[];
  timeline: TimelineEvent[];
  totalDamage: number;
  duration: number;
  dps: number;
}

interface CharacterSimulation {
  character: Character;
  level: number;
  weapon: Weapon;
  artifacts: Artifact[];
  talents: TalentLevel[];
}

interface TimelineEvent {
  timestamp: number;
  characterIndex: number;
  action: ActionType;
  damage?: DamageResult;
  reaction?: ElementalReaction;
}
```

### 服务扩展
- 扩展 `calculator.service.ts` 添加队伍伤害计算方法
- 扩展 `dps.service.ts` 添加时间轴DPS计算
- 新增 `team-simulation.service.ts` 管理模拟数据

## 用户界面设计

### 主要页面布局
1. **队伍配置区域**: 左侧面板，显示4个角色槽位
2. **时间轴编辑器**: 中央区域，可视化编辑角色行动
3. **伤害图表**: 右侧面板，显示伤害时间轴和统计
4. **操作按钮**: 底部工具栏，播放、暂停、重置等

### 交互流程
1. 用户选择4个角色并配置装备
2. 在时间轴上添加角色行动（技能、攻击等）
3. 系统自动计算元素反应和伤害
4. 显示伤害时间轴和总统计
5. 用户可以保存和分享模拟结果

## 实施计划

### 第一阶段：基础框架（2周）
- [ ] 创建基础组件结构
- [ ] 实现队伍配置界面
- [ ] 集成现有角色数据

### 第二阶段：时间轴编辑（2周）
- [ ] 实现时间轴编辑器
- [ ] 添加角色行动类型
- [ ] 实现基础伤害计算

### 第三阶段：元素反应（2周）
- [ ] 实现元素反应计算
- [ ] 添加反应可视化
- [ ] 优化计算性能

### 第四阶段：可视化和优化（1周）
- [ ] 实现伤害图表
- [ ] 添加统计功能
- [ ] 性能优化和测试

## 测试策略
- **单元测试**: 对所有计算逻辑进行单元测试
- **集成测试**: 测试组件间交互和数据流
- **用户测试**: 邀请玩家测试实际使用场景
- **性能测试**: 确保复杂计算的性能表现

## 风险评估
- **计算复杂度**: 多角色元素反应计算可能很复杂
  - 缓解措施：优化算法，限制时间轴长度
- **用户体验**: 时间轴编辑可能过于复杂
  - 缓解措施：提供预设模板，简化交互
- **性能问题**: 大量计算可能影响响应性
  - 缓解措施：使用Web Workers，分批计算

## 成功指标
- 用户能够创建和保存队伍模拟
- 模拟结果与游戏内实际表现误差 < 5%
- 复杂模拟计算时间 < 500ms
- 用户满意度评分 > 4.0/5.0

## 依赖项
- 需要更新元素反应数据
- 需要添加角色技能动画时长数据
- 可能需要添加新的图表库

## 影响分析
- **代码影响**: 新增约2000行代码，修改现有计算服务
- **性能影响**: 增加计算复杂度，需要优化
- **用户影响**: 提供更准确的队伍评估，提升用户体验

## 审阅历史
| 日期 | 审阅者 | 状态 | 评论 |
|------|--------|------|------|
| 2023-12-05 | AI助手 | 草案 | 初始版本 |

## 相关资源
- [原神元素反应机制文档](https://genshin-impact.fandom.com/wiki/Elemental_Reactions)
- [现有伤害计算服务](src/app/shared/service/genshin/calculator.service.ts)
- [角色数据结构](src/app/shared/class/character.ts)