# 快速故障排除指南

本指南帮助你快速定位和解决使用 genshin-data-generator Skill 时遇到的问题。

## 目录

1. [预处理相关问题](#预处理相关问题)
2. [配置生成相关问题](#配置生成相关问题)
3. [配置验证相关问题](#配置验证相关问题)
4. [代码修改相关问题](#代码修改相关问题)

---

## 预处理相关问题

### 问题1：找不到解包数据文件

**错误信息**：

```
FileNotFoundError: [Errno 2] No such file or directory: 'src/assets/genshin/avatar_map.json'
```

**解决方案**：

1. 确认解包数据文件已下载到 `src/assets/genshin/` 目录
2. 检查文件名是否正确：
   - `avatar_map.json`
   - `weapon_map.json`
   - `reliquary_set_map.json`

**检查步骤**：

```bash
ls -lh src/assets/genshin/
```

---

### 问题2：预处理后的文件过大

**现象**：
预处理后的 `processed_data.json` 仍然很大（> 5MB）。

**可能原因**：

1. 解包数据格式不标准
2. 预处理脚本没有正确移除 levelMap
3. 解包数据包含大量冗余信息

**解决方案**：

1. 检查解包数据来源是否可靠
2. 手动检查预处理脚本是否正确执行
3. 尝试使用其他版本的解包数据

**检查步骤**：

```bash
# 查看预处理后的文件大小
ls -lh .claude/skills/genshin-data-generator/output/processed_data.json

# 查看文件内容结构
head -n 50 .claude/skills/genshin-data-generator/output/processed_data.json
```

---

## 配置生成相关问题

### 问题1：找不到预处理数据文件

**错误信息**：

```
错误: 未找到预处理数据文件 .claude/skills/genshin-data-generator/output/processed_data.json
请先运行 preprocess.py
```

**解决方案**：

1. 确认已经运行过 `preprocess.py`
2. 检查预处理文件是否存在于正确位置
3. 重新运行预处理脚本

**检查步骤**：

```bash
# 检查预处理文件是否存在
ls -lh .claude/skills/genshin-data-generator/output/processed_data.json

# 如果不存在，重新运行预处理
cd .claude/skills/genshin-data-generator/scripts
python3 preprocess.py
```

---

### 问题2：找不到指定的角色/武器/圣遗物ID

**错误信息**：

```
错误: 未找到角色 10000002
可用的角色ID: ['10000001', '10000003', ...]
```

**解决方案**：

1. 使用 `check_unimplemented.py` 查看所有可用的 ID
2. 检查 ID 是否正确（解包数据中的 ID）
3. 确认该角色/武器/圣遗物在当前版本的解包数据中

**检查步骤**：

```bash
# 查看所有可用角色
cd .claude/skills/genshin-data-generator/scripts
python3 check_unimplemented.py --type character

# 导出特定角色查看详细信息
python3 export_data.py --type character --id 10000002
```

---

### 问题3：生成的配置不完整

**现象**：
生成的配置缺少某些技能或效果。

**可能原因**：

1. paramDescList 为空或格式不正确
2. desc 中没有包含足够的关键词
3. 特殊机制需要手动配置

**解决方案**：

1. 导出该角色的解包数据，查看 paramDescList
2. 检查 desc 内容是否包含关键信息
3. 参考 [高级配置指南](advanced-config.md) 手动添加特殊配置

**检查步骤**：

```bash
# 导出角色数据
python3 export_data.py --type character --id 10000002

# 打开导出的文件，检查 skills 部分的 paramDescList 和 desc
```

---

### 问题4：生成的配置 indexes 错误

**现象**：
技能的 indexes 与 paramDescList 不对应。

**可能原因**：

1. paramDescList 格式不标准
2. 脚本解析逻辑有误
3. 特殊的参数索引格式

**解决方案**：

1. 导出该角色的解包数据
2. 手动检查 paramDescList 中的 `{paramX:F1P}` 格式
3. 根据实际 paramDescList 手动调整配置

**检查步骤**：

```bash
# 导出角色数据
python3 export_data.py --type character --id 10000002

# 打开导出的文件，找到有问题的技能
# 检查 paramDescList 中的格式，例如：
# "第1段伤害{param0:F1P}%攻击力"  → 应该对应 indexes: [0]
# "重击伤害{param5:F1P}%攻击力"  → 应该对应 indexes: [5]
```

---

## 配置验证相关问题

### 问题1：JSON 格式错误

**错误信息**：

```
Expecting ',' delimiter: line 123 column 5 (char 4567)
```

**解决方案**：

1. 使用 JSON 格式化工具检查错误
2. 查看错误行的上下文，查找缺少的逗号或引号
3. 使用编辑器的 JSON 格式化功能

**检查步骤**：

```bash
# 使用 Python 的 json.tool 验证
python3 -m json.tool src/assets/init/data.json

# 如果有错误，会显示错误位置和原因
```

---

### 问题2：配置不符合 interface.ts 定义的接口

**现象**：
应用启动后控制台报错，提示某个字段不存在或类型不正确。

**解决方案**：

1. 检查 interface.ts 中的接口定义
2. 对比生成的配置是否缺少必需字段
3. 检查字段类型是否正确（字符串、数字、数组等）

**检查步骤**：

```bash
# 查看接口定义
cat src/app/shared/interface/interface.ts

# 查看生成的配置
cat src/assets/init/data.json | grep -A 20 "\"10000002\""
```

---

### 问题3：常量名称不正确

**现象**：
配置中使用的常量在 const.ts 中不存在。

**解决方案**：

1. 检查 const.ts 中的常量定义
2. 确认常量名称拼写正确
3. 如果常量不存在，根据需要添加新常量

**检查步骤**：

```bash
# 在 const.ts 中搜索常量
grep "PROP_DMG_BONUS_CRYO" src/app/shared/const/const.ts

# 搜索常量定义部分（通常在文件中部）
grep -n "static readonly PROP_" src/app/shared/const/const.ts | head -n 20
```

---

## 代码修改相关问题

### 问题1：修改 const.ts 后类型检查失败

**错误信息**：

```
error TS2339: Property 'PROP_NEW_CONSTANT' does not exist on type 'typeof Const'.
```

**解决方案**：

1. 确认常量定义格式正确
2. 确认使用 `static readonly` 关键字
3. 确认常量在正确的位置（与其他 PROP\_\* 常量一起）

**检查步骤**：

```bash
# 运行类型检查
npm run typecheck

# 如果有错误，查看详细错误信息
# 根据错误行号修改 const.ts
```

---

### 问题2：修改 interface.ts 后类型检查失败

**错误信息**：

```
error TS2420: Class 'CalculatorService' incorrectly implements interface 'IExtraData'.
```

**解决方案**：

1. 确认接口定义格式正确
2. 确认实现类（CalculatorService）正确实现了接口
3. 检查字段名称和类型是否匹配

**检查步骤**：

```bash
# 运行类型检查
npm run typecheck

# 查看接口定义
cat src/app/shared/interface/interface.ts

# 查看实现类
cat src/app/shared/service/genshin/calculator.service.ts
```

---

### 问题3：修改 calculator.service.ts 后 lint 失败

**错误信息**：

```
error LINT: 'console.log' is forbidden: Use a proper logging mechanism instead.
```

**解决方案**：

1. 移除或注释调试用的 console.log
2. 使用项目的日志系统（如果有的话）
3. 添加 `// eslint-disable-next-line` 临时禁用规则（不推荐）

**检查步骤**：

```bash
# 运行 lint 检查
npm run lint

# 如果有错误，根据提示修改代码
```

---

## 常见错误代码速查

| 错误代码          | 可能原因            | 解决方案            |
| ----------------- | ------------------- | ------------------- |
| FileNotFoundError | 文件不存在          | 检查文件路径和名称  |
| KeyError          | JSON 键不存在       | 检查解包数据格式    |
| IndexError        | 列表索引越界        | 检查 paramList 长度 |
| TypeError         | 类型不匹配          | 检查数据类型转换    |
| JSONDecodeError   | JSON 格式错误       | 使用 json.tool 验证 |
| TS2339            | TypeScript 类型错误 | 检查类型定义        |
| TS2420            | 接口实现错误        | 检查接口和实现      |

---

## 获取帮助

如果以上方法都无法解决你的问题：

1. **查看日志**：检查控制台输出和日志文件
2. **搜索文档**：使用文档搜索功能查找相关信息
3. **查看示例**：参考 [实际使用示例](../SKILL.md#实际使用示例)
4. **检查代码**：使用调试工具逐步执行代码

---

## 预防措施

为了避免遇到问题，建议：

1. **定期更新解包数据**：确保使用最新版本的解包数据
2. **运行预处理**：每次版本更新后先运行预处理脚本
3. **验证 JSON**：修改配置后使用 `json.tool` 验证格式
4. **运行检查**：使用 `npm run lint` 和 `npm run typecheck` 检查代码
5. **备份配置**：在修改重要配置前先备份
6. **版本控制**：使用 Git 管理配置文件的修改历史
