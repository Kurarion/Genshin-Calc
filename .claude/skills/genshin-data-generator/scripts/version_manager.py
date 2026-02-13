#!/usr/bin/env python3
"""
版本管理工具
负责版本元数据管理、目录创建、版本解析等
"""

import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import sys


# 获取版本目录
def get_versions_dir() -> Path:
    """获取版本根目录"""
    script_dir = Path(__file__).resolve().parent
    versions_dir = script_dir.parent / "versions"
    return versions_dir


def get_metadata_file() -> Path:
    """获取元数据索引文件路径"""
    return get_versions_dir() / "metadata.json"


def create_version_dir(commit_id: str) -> Path:
    """创建版本目录结构

    Args:
        commit_id: Git commit SHA (完整40字符)

    Returns:
        版本目录路径
    """
    versions_dir = get_versions_dir()
    version_dir = versions_dir / commit_id

    # 创建目录结构
    (version_dir / "source").mkdir(parents=True, exist_ok=True)
    (version_dir / "processed").mkdir(parents=True, exist_ok=True)
    (version_dir / "processed" / "characters").mkdir(parents=True, exist_ok=True)
    (version_dir / "processed" / "weapons").mkdir(parents=True, exist_ok=True)
    (version_dir / "processed" / "artifacts").mkdir(parents=True, exist_ok=True)

    return version_dir


def save_version_metadata(commit_id: str, metadata: dict) -> None:
    """保存版本元数据到 meta.json

    Args:
        commit_id: Git commit SHA
        metadata: 版本元数据字典
    """
    version_dir = get_versions_dir() / commit_id
    meta_file = version_dir / "meta.json"

    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)


def load_version_metadata(commit_id: str) -> dict:
    """加载指定版本的元数据

    Args:
        commit_id: Git commit SHA

    Returns:
        元数据字典，如果不存在返回 None
    """
    # 首先尝试解析版本标识符
    resolved_id = resolve_version(commit_id)
    if resolved_id is None:
        return None

    version_dir = get_versions_dir() / resolved_id
    meta_file = version_dir / "meta.json"

    if not meta_file.exists():
        return None

    with open(meta_file, "r", encoding="utf-8") as f:
        return json.load(f)


def get_all_versions() -> List[dict]:
    """获取所有版本列表（按 commit 时间顺序：旧→新）

    Returns:
        版本信息列表，每个元素包含 commitId, shortId, timestamp 等信息
    """
    metadata_file = get_metadata_file()

    if not metadata_file.exists():
        return []

    with open(metadata_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    versions = data.get("versions", [])
    # 按时间戳排序（旧的在前，保持 commit 先后顺序）
    versions.sort(key=lambda v: v.get("timestamp", ""))

    return versions


def get_latest_version() -> Optional[dict]:
    """获取最新版本信息

    Returns:
        最新版本的元数据字典，如果不存在返回 None
    """
    versions = get_all_versions()
    return versions[0] if versions else None


def resolve_version(version_spec: str) -> Optional[str]:
    """解析版本标识符为完整的 commit ID

    Args:
        version_spec: 版本标识符
            - "latest" -> 最新版本的 commit ID
            - 短ID (如 abc1234) -> 匹配的完整 commit ID
            - 完整 commit ID -> 直接返回

    Returns:
        完整的 commit ID，如果未找到返回 None
    """
    versions_dir = get_versions_dir()

    if version_spec == "latest":
        # 从 metadata.json 读取 latest 字段
        metadata_file = get_metadata_file()
        if not metadata_file.exists():
            return None

        with open(metadata_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        return data.get("latest")

    elif len(version_spec) == 40:
        # 完整 commit ID，验证是否存在
        version_dir = versions_dir / version_spec
        if version_dir.exists():
            return version_spec
        return None

    else:
        # 短 ID，先尝试在 metadata.json 中查找
        versions = get_all_versions()
        for version in versions:
            if version.get("shortId", "") == version_spec:
                return version.get("commitId")
            # 也支持完整 commit ID 的前缀匹配
            if version.get("commitId", "").startswith(version_spec):
                return version.get("commitId")

        # 如果 metadata.json 中没找到，直接检查目录是否存在
        # 这允许在没有 metadata.json 的情况下使用已存在的版本
        for item in versions_dir.iterdir():
            if item.is_dir() and not item.is_symlink():
                item_name = item.name
                if item_name == version_spec or item_name.startswith(version_spec):
                    return item_name
        return None


def calculate_checksums(files: List[Path]) -> Dict[str, str]:
    """计算文件的 SHA256 校验和

    Args:
        files: 文件路径列表

    Returns:
        字典，键为相对路径，值为 "sha256:校验和" 格式
    """
    checksums = {}
    versions_dir = get_versions_dir()

    for file_path in files:
        if not file_path.exists():
            continue

        # 计算相对路径
        try:
            rel_path = file_path.relative_to(versions_dir)
        except ValueError:
            # 文件不在 versions 目录下，使用绝对路径
            rel_path = str(file_path)

        # 计算 SHA256
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)

        checksums[str(rel_path)] = f"sha256:{sha256_hash.hexdigest()}"

    return checksums


def update_metadata_index(
    commit_id: str,
    short_id: str,
    timestamp: str,
    source_url: str,
    game_version: Optional[str] = None,
    branch: str = "master",
    fetch_source: str = "gitlab",
    stats: Optional[dict] = None,
    parent_version: Optional[str] = None,
    set_as_latest: bool = False,
) -> None:
    """更新 versions/metadata.json 索引

    Args:
        commit_id: 完整 commit SHA
        short_id: 短 commit SHA (7字符)
        timestamp: ISO 8601 时间戳
        source_url: 数据源 URL
        game_version: 可选的游戏版本标签
        branch: 分支名称
        fetch_source: 获取来源 (gitlab/github/local)
        stats: 统计信息字典
        parent_version: 父版本 commit ID
        set_as_latest: 是否设置为最新版本（默认 False）
    """
    metadata_file = get_metadata_file()
    versions_dir = get_versions_dir()

    # 确保目录存在
    versions_dir.mkdir(parents=True, exist_ok=True)

    # 加载现有数据或创建新结构
    if metadata_file.exists():
        with open(metadata_file, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = {"versions": [], "latest": ""}

    # 检查是否已存在该版本
    existing_index = None
    for i, version in enumerate(data["versions"]):
        if version.get("commitId") == commit_id:
            existing_index = i
            break

    version_info = {
        "commitId": commit_id,
        "shortId": short_id,
        "timestamp": timestamp,
        "sourceUrl": source_url,
        "branch": branch,
        "fetchSource": fetch_source,
    }

    if game_version:
        version_info["gameVersion"] = game_version

    if stats:
        version_info["stats"] = stats

    if parent_version:
        version_info["parentVersion"] = parent_version

    if existing_index is not None:
        # 更新现有版本
        data["versions"][existing_index] = version_info
    else:
        # 添加新版本
        data["versions"].append(version_info)

    # 只在明确指定时更新 latest 指针
    if set_as_latest:
        data["latest"] = commit_id
    elif not data.get("latest"):
        # 如果没有 latest，设置为第一个版本
        data["latest"] = commit_id

    # 保存
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def update_latest_symlink(commit_id: str) -> None:
    """更新 latest 符号链接

    Args:
        commit_id: commit ID
    """
    versions_dir = get_versions_dir()
    latest_link = versions_dir / "latest"
    version_dir = versions_dir / commit_id

    # 删除旧的符号链接
    if latest_link.exists() or latest_link.is_symlink():
        latest_link.unlink()

    # 创建新的符号链接
    latest_link.symlink_to(commit_id)


def get_version_path(version_spec: str) -> Optional[Path]:
    """获取版本目录路径

    Args:
        version_spec: 版本标识符 (latest/短ID/完整commit ID)

    Returns:
        版本目录路径，如果未找到返回 None
    """
    resolved_id = resolve_version(version_spec)
    if resolved_id is None:
        return None

    return get_versions_dir() / resolved_id


def get_processed_data_file(version_spec: str) -> Optional[Path]:
    """获取预处理数据文件路径

    Args:
        version_spec: 版本标识符

    Returns:
        processed_data.json 文件路径，如果版本不存在返回 None
    """
    version_path = get_version_path(version_spec)
    if version_path is None:
        return None

    return version_path / "processed" / "processed_data.json"


def list_versions():
    """列出所有版本（命令行友好输出）"""
    versions = get_all_versions()

    if not versions:
        print("暂无版本数据")
        return

    print(f"\n{'='*80}")
    print(f"{'版本列表':^76}")
    print(f"{'='*80}")
    print(f"{'Commit ID':<12} {'短ID':<10} {'时间':<20} {'来源':<10} {'游戏版本':<10}")
    print(f"{'-'*80}")

    latest_commit = get_latest_version()
    latest_id = latest_commit.get("commitId") if latest_commit else None

    for version in versions:
        commit_id = version.get("commitId", "")
        short_id = version.get("shortId", "")
        timestamp = version.get("timestamp", "")
        fetch_source = version.get("fetchSource", "")
        game_version = version.get("gameVersion", "-")

        # 标记最新版本
        prefix = "* " if commit_id == latest_id else "  "

        # 格式化时间
        try:
            dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            time_str = dt.strftime("%Y-%m-%d %H:%M")
        except:
            time_str = timestamp[:16]

        print(f"{prefix}{short_id:<10} {time_str:<20} {fetch_source:<10} {game_version:<10}")

    print(f"{'='*80}")


def main():
    """命令行入口"""
    import argparse

    parser = argparse.ArgumentParser(description="版本管理工具")
    subparsers = parser.add_subparsers(dest="command", help="子命令")

    # list 命令
    subparsers.add_parser("list", help="列出所有版本")

    # resolve 命令
    resolve_parser = subparsers.add_parser("resolve", help="解析版本标识符")
    resolve_parser.add_argument("version", help="版本标识符 (latest/短ID/完整commit ID)")

    # path 命令
    path_parser = subparsers.add_parser("path", help="获取版本目录路径")
    path_parser.add_argument("version", help="版本标识符")

    args = parser.parse_args()

    if args.command == "list":
        list_versions()

    elif args.command == "resolve":
        resolved = resolve_version(args.version)
        if resolved:
            print(f"{args.version} -> {resolved}")
        else:
            print(f"错误: 未找到版本 '{args.version}'", file=sys.stderr)
            sys.exit(1)

    elif args.command == "path":
        path = get_version_path(args.version)
        if path:
            print(path.resolve())
        else:
            print(f"错误: 未找到版本 '{args.version}'", file=sys.stderr)
            sys.exit(1)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
