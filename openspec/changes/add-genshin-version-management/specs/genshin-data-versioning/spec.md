# Genshin Data Version Management Specification

## ADDED Requirements

### Requirement: Version Metadata Storage

系统 SHALL 在 `versions/metadata.json` 中维护所有版本的索引。

**Schema**:
```json
{
  "versions": [
    {
      "commitId": "string (Git commit SHA)",
      "shortId": "string (short commit SHA)",
      "timestamp": "ISO 8601 string",
      "sourceUrl": "string (GitLab raw URL)",
      "gameVersion": "string (optional, game version tag)",
      "branch": "string (branch name)",
      "fetchSource": "gitlab",
      "stats": {
        "characters": "number",
        "weapons": "number",
        "artifacts": "number"
      },
      "parentVersion": "string (parent commit SHA or null)"
    }
  ],
  "latest": "string (commit ID of latest version)"
}
```

#### Scenario: Fetch New Version

- **WHEN** 用户执行 `fetch_version.py` 获取新版本
- **THEN** 系统 SHALL 创建新版本目录并更新 `metadata.json`
- **AND** `latest` 字段 SHALL 指向新版本 commit ID

---

### Requirement: Per-Version Metadata

每个版本目录 SHALL 包含 `meta.json` 文件。

**Schema**:
```json
{
  "commitId": "string",
  "shortId": "string",
  "timestamp": "ISO 8601 string",
  "sourceUrl": "string",
  "gameVersion": "string (optional)",
  "branch": "string",
  "fetchSource": "gitlab",
  "files": {
    "source": ["array of source file names"],
    "processed": ["array of processed file names"]
  },
  "checksums": {
    "relative/path": "sha256:checksum"
  }
}
```

---

### Requirement: Version Directory Structure

系统 SHALL 为每个版本创建以下目录结构：

```
versions/
├── metadata.json
├── latest -> [commit-id]/
└── [commit-id]/
    ├── source/
    │   ├── avatar_map.json
    │   ├── weapon_map.json
    │   ├── reliquary_set_map.json
    │   └── ...
    ├── processed/
    │   ├── processed_data.json
    │   ├── name_id_map.json
    │   ├── characters/
    │   ├── weapons/
    │   └── artifacts/
    └── meta.json
```

#### Scenario: Latest Version Resolution

- **WHEN** 用户指定 `--version latest`
- **THEN** 系统 SHALL 解析 `metadata.json` 中的 `latest` 字段
- **AND** 返回对应的版本目录路径

---

### Requirement: Version Fetch Workflow

`fetch_version.py` SHALL 支持以下执行流程：

1. 检测/获取 commit ID（自动或手动指定）
2. 执行 GenshinData Go 工具获取原始数据到临时目录
3. 运行 `preprocess.py` 处理数据
4. 创建版本目录并移动数据
5. 生成并保存元数据
6. 更新索引和符号链接

#### Scenario: Auto-Detect Latest Commit

- **WHEN** 用户执行 `python3 fetch_version.py`（无参数）
- **THEN** 系统 SHALL 通过 GitLab API 检测默认仓库和分支的最新 commit ID
- **AND** 使用该 commit ID 获取数据

#### Scenario: Specify Custom Repository and Branch

- **WHEN** 用户执行 `python3 fetch_version.py --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master`
- **THEN** 系统 SHALL 使用指定的仓库和分支检测最新 commit ID
- **AND** 构建正确的 GitLab raw URL 格式：`https://gitlab.com/Dimbreath/AnimeGameData/-/raw/{commit_id}`

#### Scenario: Specify Commit

- **WHEN** 用户执行 `python3 fetch_version.py --commit abc1234def5678`
- **THEN** 系统 SHALL 使用指定的 commit ID 获取数据

#### Scenario: Local Source

- **WHEN** 用户执行 `python3 fetch_version.py --local /path/to/data`
- **THEN** 系统 SHALL 使用本地数据而不调用 GitLab API

---

### Requirement: Differential Analysis

`diff_analyzer.py` SHALL 提供版本对比功能：

1. 加载两个版本的预处理数据
2. 比对角色、武器、圣遗物列表
3. 识别新增、修改、删除的项目
4. 生成 AI 友好的差分报告

#### Scenario: Compare Versions

- **WHEN** 用户执行 `python3 diff_analyzer.py --from abc1234 --to def5678`
- **THEN** 系统 SHALL：
  - 加载两个版本的 `processed_data.json`
  - 生成包含以下分类的差分：
    - `ADDED`: 新增的项目
    - `MODIFIED`: 修改的项目
    - `REMOVED`: 删除的项目
    - `UNIMPLEMENTED`: 未实现的项目（对比 data.json）
  - 输出格式化的 Markdown 报告

#### Scenario: Check Unimplemented

- **WHEN** 用户执行 `python3 diff_analyzer.py --from latest --check-unimplemented`
- **THEN** 系统 SHALL：
  - 加载最新版本数据
  - 对比 `src/assets/init/data.json`
  - 列出源数据中存在但未实现的项目

---

### Requirement: Output Format

差分报告 SHALL 使用以下 Markdown 格式：

```markdown
# 版本差分: [from-commit] → [to-commit]
# 时间: [timestamp]

## 概要
| 类别 | 新增 | 修改 | 删除 | 未实现 |
|-----|-----|-----|-----|-------|
| 角色 | X | Y | Z | W |
| 武器 | X | Y | Z | W |
| 圣遗物 | X | Y | Z | W |

## 优先级建议
### 🔴 高优先级
[优先级说明]

### 🟡 中优先级
[优先级说明]

### 🟢 低优先级
[优先级说明]

## 新增项目（需要配置）
[详细列表]

## 修改项目（需要更新）
[详细列表，包括具体变化]

## 未实现项目
[列表]
```

---

### Requirement: Version Resolution

系统 SHALL 支持 `version_manager.resolve_version()` 函数：

- `latest` → 解析为 `metadata.json` 中的 `latest` commit ID
- 短 ID（7字符）→ 匹配 `shortId` 字段
- 完整 commit ID（40字符）→ 直接返回

#### Scenario: Resolve Latest

- **WHEN** 调用 `resolve_version("latest")`
- **THEN** 系统 SHALL 返回最新版本的完整 commit ID

#### Scenario: Resolve Short ID

- **WHEN** 调用 `resolve_version("abc1234")`
- **THEN** 系统 SHALL 搜索匹配的版本并返回完整 commit ID

---

### Requirement: Script Integration

现用脚本 SHALL 支持与版本系统的集成：

1. `preprocess.py` SHALL 接受 `--output-dir` 参数
2. `query_data_config.py` SHALL 接受 `--version` 参数

#### Scenario: Preprocess with Custom Output

- **WHEN** 执行 `python3 preprocess.py --output-dir versions/abc1234/processed`
- **THEN** 系统 SHALL 将输出写入指定目录

#### Scenario: Query Historical Version

- **WHEN** 执行 `python3 query_data_config.py --version abc1234 --type character --id 10000073`
- **THEN** 系统 SHALL 从指定版本加载数据

---

### Requirement: Checksum Calculation

系统 SHALL 为版本数据生成 SHA256 校验和：

1. 计算所有源数据文件的校验和
2. 计算所有处理数据文件的校验和
3. 存储在 `meta.json` 的 `checksums` 字段

#### Scenario: Verify Data Integrity

- **WHEN** 版本数据已创建
- **THEN** 校验和 SHALL 可用于验证数据完整性
- **AND** 相同 commit 的重复获取 SHALL 被检测

---

### Requirement: GitLab Integration

系统 SHALL 支持 GitLab.com 数据源：

1. 默认仓库: `https://gitlab.com/Dimbreath/AnimeGameData`
2. 默认分支: `master`
3. API 端点格式: `https://gitlab.com/api/v4/projects/{encoded_project_path}/repository/commits?ref_name={branch}&per_page=1`
4. Raw URL 格式: `https://gitlab.com/{namespace}/{project}/-/raw/{commit_id}`
5. 支持本地开发模式

#### Scenario: Fetch from GitLab

- **WHEN** 用户执行 `fetch_version.py --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master`
- **THEN** 系统 SHALL：
  - 正确 URL 编码项目路径（`Dimbreath%2FAnimeGameData`）
  - 调用 GitLab API 获取指定分支的最新 commit
  - 构建 raw URL：`https://gitlab.com/Dimbreath/AnimeGameData/-/raw/{commit_id}`
  - 传递给 GenshinData Go 工具的 `-resUrl` 参数

---

## MODIFIED Requirements

### Requirement: preprocess.py Extensions

现有的 `preprocess.py` SHALL 扩展支持：

- 添加 `--output-dir` 命令行参数
- 当指定时，使用自定义目录而非默认 `output/`
- 保持向后兼容（默认行为不变）

**完整的修改需求请参考提案文档。**

---

## REMOVED Requirements

### Requirement: Legacy Output Directory

移除 `output/` 固定目录，使用版本化 `versions/` 替代。

**迁移**：
1. 首次运行 `fetch_version.py` 自动创建 `versions/latest/`
2. 现有脚本可通过 `--output-dir` 参数使用版本目录
3. 用户可通过 `--version latest` 查询最新版本

### Requirement: Archive Directory

移除 `archive/` 目录，版本历史由 `versions/` 系统管理。

**原因**：
- 版本化系统提供更好的历史管理
- `archive/` 仅用于特殊示例，使用频率低
- 简化目录结构

### Requirement: Standalone check_unimplemented.py

移除独立的 `check_unimplemented.py` 脚本，功能合并到 `diff_analyzer.py`。

**迁移**：
- 使用 `diff_analyzer.py --check-unimplemented` 替代原功能
- 新实现提供更好的格式化和输出选项
