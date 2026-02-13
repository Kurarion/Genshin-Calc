#!/usr/bin/env python3
"""
版本获取脚本
获取指定仓库/分支的最新几个 commit ID，仅获取本地不存在的版本数据
"""

import json
import subprocess
import sys
import argparse
import shutil
import urllib.request
from pathlib import Path
from datetime import datetime
from typing import List
from urllib.parse import quote

# 导入 version_manager
try:
    from version_manager import (
        create_version_dir,
        save_version_metadata,
        update_metadata_index,
        calculate_checksums,
        get_all_versions,
        get_latest_version,
    )
except ImportError:
    print("错误: 无法导入 version_manager 模块")
    print("请确保 version_manager.py 在同一目录下")
    sys.exit(1)


# 默认 GitLab 仓库配置
DEFAULT_REPO_URL = "https://gitlab.com/Dimbreath/AnimeGameData"
DEFAULT_BRANCH = "master"
FETCH_COUNT = 3  # 获取最新3个版本

# 项目路径配置
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR
while not (PROJECT_ROOT / "src").exists() and PROJECT_ROOT.parent != PROJECT_ROOT:
    PROJECT_ROOT = PROJECT_ROOT.parent

# GenshinData main.go 在项目根目录
GENSHIN_SRC_DIR = PROJECT_ROOT / "src" / "assets" / "genshin"


def parse_repo_url(repo_url: str) -> tuple:
    """解析 Git 仓库 URL

    Args:
        repo_url: Git 仓库 URL (如 https://gitlab.com/Dimbreath/AnimeGameData)

    Returns:
        (platform, project_path, api_base) 元组
    """
    from urllib.parse import urlparse
    repo_url = repo_url.rstrip("/")
    parsed = urlparse(repo_url)
    path_parts = parsed.path.strip("/").split("/")

    if len(path_parts) < 2:
        raise ValueError(f"无效的仓库 URL: {repo_url}")

    namespace = path_parts[-2]
    project_name = path_parts[-1]
    project_path = f"{namespace}/{project_name}"
    encoded_path = quote(project_path, safe='')

    if "github" in parsed.netloc:
        return "github", encoded_path, "https://api.github.com"
    else:
        return "gitlab", encoded_path, "https://gitlab.com/api/v4"


def get_latest_commits(repo_url: str, branch: str, count: int = 3) -> List[dict]:
    """获取指定分支的最新几个 commit

    Args:
        repo_url: Git 仓库 URL
        branch: 分支名称
        count: 获取的 commit 数量

    Returns:
        commit 信息列表，每个元素包含 id, short_id, created_at, title
    """
    print(f"正在获取最新 {count} 个 commit (分支: {branch})...")

    try:
        platform, project_path, api_base = parse_repo_url(repo_url)

        if platform == "github":
            api_url = f"{api_base}/repos/{project_path}/commits?sha={branch}&per_page={count}"
        else:
            api_url = f"{api_base}/projects/{project_path}/repository/commits?ref_name={branch}&per_page={count}"

        print(f"  API 请求: {api_url}")

        with urllib.request.urlopen(api_url, timeout=30) as response:
            data = json.load(response)

        commits = []
        for commit in data[:count]:
            if platform == "github":
                cid = commit.get("sha")
                short_cid = cid[:7]
                created_at = commit.get("commit", {}).get("committer", {}).get("date")
                title = commit.get("commit", {}).get("message", "").split("\n")[0]
            else:
                cid = commit.get("id")
                short_cid = commit.get("short_id")
                created_at = commit.get("created_at")
                title = commit.get("title", "")

            commits.append({
                "id": cid,
                "short_id": short_cid,
                "created_at": created_at,
                "title": title
            })

        return commits

    except Exception as e:
        print(f"  错误: {e}")
        return []


def get_existing_commit_ids() -> set:
    """获取本地已存在的 commit ID 集合"""
    versions = get_all_versions()
    return {v.get("commitId") for v in versions} if versions else set()


def run_genshindata_go(target_dir: Path, repo_url: str, commit_id: str) -> bool:
    """执行 GenshinData Go 工具获取数据

    Args:
        target_dir: 目标输出目录
        repo_url: Git 仓库 URL
        commit_id: commit ID

    Returns:
        成功返回 True
    """
    print("  正在运行 GenshinData Go 工具...")

    main_go_path = PROJECT_ROOT / "main.go"
    if not main_go_path.exists():
        print(f"    错误: 未找到 main.go")
        return False

    # 清理现有输出目录
    if GENSHIN_SRC_DIR.exists():
        shutil.rmtree(GENSHIN_SRC_DIR)

    # 构建 Go 命令（不指定 targetDir，使用默认的 ./src/assets/genshin）
    cmd = ["go", "run", "main.go", "-repo", repo_url, "-commit", commit_id]

    # 显示执行的命令
    short_cid = commit_id[:7] if len(commit_id) > 7 else commit_id
    print(f"    命令: go run main.go -repo {repo_url} -commit {short_cid}")

    try:
        import os
        env_copy = os.environ.copy()
        env_copy["GODEBUG"] = "netdns=go"

        result = subprocess.run(
            cmd,
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=600,
            env=env_copy,
        )

        # 显示 Go 工具的输出
        if result.stdout:
            for line in result.stdout.strip().split('\n'):
                print(f"    {line}")

        if result.returncode != 0:
            print(f"    错误: Go 工具执行失败 (返回码: {result.returncode})")
            if result.stderr:
                print(f"    stderr: {result.stderr[:500]}")
            return False

        # 检查数据是否生成
        if not GENSHIN_SRC_DIR.exists():
            print("    错误: 未生成数据")
            return False

        json_files = list(GENSHIN_SRC_DIR.glob("*.json"))
        if not json_files:
            print("    错误: 未生成 JSON 文件")
            return False

        # 复制数据到目标目录（保留原文件）
        target_dir.mkdir(parents=True, exist_ok=True)
        for item in GENSHIN_SRC_DIR.glob("*"):
            dest = target_dir / item.name
            if dest.exists():
                if dest.is_dir():
                    shutil.rmtree(dest)
                else:
                    dest.unlink()
            if item.is_dir():
                shutil.copytree(item, dest)
            else:
                shutil.copy2(item, dest)

        print(f"    已复制 {len(json_files)} 个文件")
        return True

    except subprocess.TimeoutExpired:
        print("    错误: 执行超时")
        return False
    except Exception as e:
        print(f"    错误: {e}")
        return False


def run_preprocess(version_dir: Path) -> bool:
    """运行预处理脚本

    Args:
        version_dir: 版本目录

    Returns:
        成功返回 True
    """
    print("  正在运行预处理...")

    preprocess_script = SCRIPT_DIR / "preprocess.py"
    if not preprocess_script.exists():
        print(f"    错误: 未找到 preprocess.py")
        return False

    output_dir = version_dir / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "characters").mkdir(exist_ok=True)
    (output_dir / "weapons").mkdir(exist_ok=True)
    (output_dir / "artifacts").mkdir(exist_ok=True)

    # 备份现有 genshin 目录
    backup_dir = None
    if GENSHIN_SRC_DIR.exists():
        backup_dir = GENSHIN_SRC_DIR.with_suffix(".bak")
        if backup_dir.exists():
            shutil.rmtree(backup_dir)
        shutil.move(str(GENSHIN_SRC_DIR), str(backup_dir))

    try:
        # 创建符号链接
        source_dir = version_dir / "source"
        GENSHIN_SRC_DIR.parent.mkdir(parents=True, exist_ok=True)
        GENSHIN_SRC_DIR.symlink_to(source_dir.resolve())

        cmd = [sys.executable, str(preprocess_script), "--output-dir", str(output_dir)]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

        if result.returncode != 0:
            print(f"    错误: 预处理失败 - {result.stderr[:200]}")
            return False

        print("    预处理完成")
        return True

    except Exception as e:
        print(f"    错误: {e}")
        return False

    finally:
        # 恢复
        if GENSHIN_SRC_DIR.is_symlink() or GENSHIN_SRC_DIR.exists():
            GENSHIN_SRC_DIR.unlink()
        if backup_dir and backup_dir.exists():
            shutil.move(str(backup_dir), str(GENSHIN_SRC_DIR))


def collect_stats(processed_dir: Path) -> dict:
    """收集统计信息"""
    stats = {"characters": 0, "weapons": 0, "artifacts": 0}

    processed_file = processed_dir / "processed_data.json"
    if processed_file.exists():
        try:
            with open(processed_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            stats["characters"] = len(data.get("characters", {}))
            stats["weapons"] = len(data.get("weapons", {}))
            stats["artifacts"] = len(data.get("artifacts", {}))
        except:
            pass

    return stats


def fetch_commit(commit_info: dict, repo_url: str, branch: str, set_as_latest: bool = False) -> bool:
    """获取单个 commit 的数据

    Args:
        commit_info: commit 信息
        repo_url: Git 仓库 URL
        branch: 分支名称
        set_as_latest: 是否设置为最新版本

    Returns:
        成功返回 True
    """
    commit_id = commit_info["id"]
    short_id = commit_info["short_id"]

    print(f"\n{'='*60}")
    print(f"获取版本: {short_id}")
    print(f"  时间: {commit_info['created_at']}")
    print(f"  标题: {commit_info['title'][:60]}")
    print(f"{'='*60}")

    # 创建版本目录
    version_dir = create_version_dir(commit_id)
    source_dir = version_dir / "source"

    # 获取原始数据
    if not run_genshindata_go(source_dir, repo_url, commit_id):
        return False

    # 预处理
    if not run_preprocess(version_dir):
        return False

    # 生成元数据
    processed_dir = version_dir / "processed"
    source_files = list(source_dir.glob("**/*.json"))
    processed_files = list(processed_dir.glob("**/*.json"))
    checksums = calculate_checksums(source_files + processed_files)
    stats = collect_stats(processed_dir)

    timestamp = datetime.now().isoformat() + "Z"
    metadata = {
        "commitId": commit_id,
        "shortId": short_id,
        "timestamp": timestamp,
        "sourceUrl": repo_url,
        "branch": branch,
        "fetchSource": "gitlab",
        "stats": stats,
        "checksums": checksums,
    }

    save_version_metadata(commit_id, metadata)
    update_metadata_index(
        commit_id=commit_id,
        short_id=short_id,
        timestamp=timestamp,
        source_url=repo_url,
        branch=branch,
        fetch_source="gitlab",
        stats=stats,
        set_as_latest=set_as_latest,
    )

    print(f"  完成: {stats.get('characters', 0)} 角色, {stats.get('weapons', 0)} 武器, {stats.get('artifacts', 0)} 圣遗物")
    return True


def main():
    parser = argparse.ArgumentParser(
        description="获取原神数据版本",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 获取最新3个版本（默认）
  python fetch_version.py

  # 指定仓库和分支
  python fetch_version.py --repo https://gitlab.com/Dimbreath/AnimeGameData --branch master
        """
    )

    parser.add_argument(
        "--repo",
        type=str,
        default=DEFAULT_REPO_URL,
        help=f"Git 仓库 URL (默认: {DEFAULT_REPO_URL})",
    )
    parser.add_argument(
        "--branch",
        type=str,
        default=DEFAULT_BRANCH,
        help=f"分支名称 (默认: {DEFAULT_BRANCH})",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=FETCH_COUNT,
        help=f"获取的版本数量 (默认: {FETCH_COUNT})",
    )

    args = parser.parse_args()

    print("=" * 60)
    print("原神数据版本获取")
    print("=" * 60)
    print(f"仓库: {args.repo}")
    print(f"分支: {args.branch}")
    print(f"获取数量: {args.count}")

    # 获取最新 commits
    commits = get_latest_commits(args.repo, args.branch, args.count)
    if not commits:
        print("错误: 无法获取 commit 信息")
        sys.exit(1)

    print(f"\n获取到 {len(commits)} 个 commit:")
    for i, c in enumerate(commits, 1):
        print(f"  [{i}] {c['short_id']} - {c['title'][:50]}")

    # 获取已存在的 commits
    existing_ids = get_existing_commit_ids()
    if existing_ids:
        print(f"\n本地已有 {len(existing_ids)} 个版本")
        latest_local = get_latest_version()
        if latest_local:
            print(f"  最新: {latest_local.get('shortId', '????')}")

    # 筛选需要获取的 commits
    commits_to_fetch = [c for c in commits if c["id"] not in existing_ids]

    if not commits_to_fetch:
        print("\n所有版本都已存在，无需获取")
        sys.exit(0)

    # 反转顺序，从旧到新处理
    commits_to_fetch.reverse()

    print(f"\n需要获取 {len(commits_to_fetch)} 个版本 (按从旧到新顺序):")
    for i, c in enumerate(commits_to_fetch, 1):
        print(f"  [{i}] {c['short_id']} - {c['title'][:50]}")

    # 确定真正的最新 commit（从 API 返回的原始列表中）
    newest_commit_id = commits[0]["id"] if commits else None

    # 逐个获取（从旧到新）
    success_count = 0
    for i, commit_info in enumerate(commits_to_fetch):
        # 只有这个 commit 是 API 返回的最新 commit 时才标记为 latest
        is_latest = (commit_info["id"] == newest_commit_id)
        if fetch_commit(commit_info, args.repo, args.branch, set_as_latest=is_latest):
            success_count += 1

    # 汇总
    print("\n" + "=" * 60)
    print(f"获取完成: {success_count}/{len(commits_to_fetch)} 个版本")
    print("=" * 60)

    if success_count == 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
