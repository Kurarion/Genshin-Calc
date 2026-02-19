# Change: Add Genshin Data Version Management

## Why

当前 `genshin-data-generator` skill 缺少版本追踪和差分分析能力，导致：

1. **无法追溯数据来源** - 每次配置更新后，无法确定基于哪个游戏版本的数据
2. **手动差分困难** - 比对版本变化需要手动处理大型 JSON 文件
3. **更新效率低下** - 无法精确识别哪些角色/武器/圣遗物需要更新
4. **历史管理缺失** - 保留所有版本数据用于回溯和测试

## What Changes

### 新增功能

1. **版本获取系统** (`fetch_version.py`)
   - 通过 GitLab API 自动检测指定仓库和分支的最新 commit ID
   - 支持自定义仓库 URL (`--repo`) 和分支名称 (`--branch`)
   - 执行 GenshinData Go 工具获取数据（使用 `-targetDir` 和 `-resUrl` 参数）
   - 运行预处理脚本
   - 生成版本元数据

2. **版本管理工具** (`version_manager.py`)
   - 创建版本化目录结构
   - 管理 commit ID 和时间戳
   - 解析版本标识符（`latest`、短 ID、完整 commit ID）
   - 计算文件校验和

3. **差分分析引擎** (`diff_analyzer.py`)
   - 对比任意两个版本
   - 生成结构化差分（新增、修改、删除、未实现）
   - 输出 AI 友好的 Markdown 报告
   - 合并原 `check_unimplemented.py` 功能

### 目录结构变更

```
.claude/skills/genshin-data-generator/
├── versions/                      # 新增 - 版本化数据存储
│   ├── metadata.json              # 版本索引
│   ├── latest                    # 符号链接
│   └── [commit-hash]/           # 按版本组织的目录
│       ├── source/              # 原始游戏数据
│       ├── processed/           # 预处理数据
│       └── meta.json           # 版本元数据
└── scripts/
    ├── fetch_version.py         # 新增
    ├── version_manager.py       # 新增
    └── diff_analyzer.py        # 新增（合并 check_unimplemented）
```

### 移除内容

- `output/` 目录 - 被 `versions/` 替代
- `archive/` 目录 - 不再需要
- `check_unimplemented.py` - 功能合并到 `diff_analyzer.py`

### 现有脚本适配

- `preprocess.py` - 添加 `--output-dir` 参数支持自定义输出目录
- `query_data_config.py` - 添加 `--version` 参数支持查询历史版本

## Impact

### Affected Specs

- [genshin-data-versioning] 新增规范

### Affected Code

- `.claude/skills/genshin-data-generator/scripts/`
- `.claude/skills/genshin-data-generator/SKILL.md`
- `.gitignore`

### Data Storage

- 新增 `versions/` 目录存储所有版本数据
- 元数据文件（`metadata.json`、`meta.json`）由 Git 追踪

## Breaking Changes

**无破坏性变更** - 现有工作流继续可用

**迁移路径**：
1. 首次运行 `fetch_version.py --repo <仓库URL> --branch <分支名>` 自动建立版本结构
2. 旧数据仍可通过 `src/assets/genshin` 访问
3. 配置更新使用 `diff_analyzer.py` 生成的报告

**使用示例**：
```bash
# 获取默认仓库的最新版本
python3 fetch_version.py

# 指定仓库和分支
python3 fetch_version.py --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master
```
