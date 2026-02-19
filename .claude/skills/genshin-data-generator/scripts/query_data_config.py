#!/usr/bin/env python3
"""
查询并导出 data.json 中角色/武器/圣遗物的配置

支持：
1. 根据ID导出完整配置到文件或直接输出
2. 根据名称搜索ID（需要先生成名称映射文件）
3. 支持模糊搜索名称

用法：
    # 根据ID查询并输出
    python query_data_config.py --type character --id 10000073

    # 根据名称搜索
    python query_data_config.py --type character --name 纳西妲

    # 模糊搜索
    python query_data_config.py --type character --name 纳

    # 导出到文件
    python query_config.py --type character --id 10000073 --output config_export.json

    # 查询所有（不指定id或name）
    python query_data_config.py --type character --list
"""

import json
import argparse
from pathlib import Path
import sys
from typing import Optional

# 设置路径（从脚本位置查找项目根目录）
script_dir = Path(__file__).resolve().parent
project_root = script_dir
while not (project_root / "src").exists() and project_root.parent != project_root:
    project_root = project_root.parent

DATA_FILE = project_root / "src" / "assets" / "init" / "data.json"
DEFAULT_NAME_MAP_FILE = (
    project_root / ".claude/skills/genshin-data-generator/output/name_id_map.json"
)

# 类型配置
TYPE_CONFIG = {
    "character": {
        "key": "characters",
        "data_key": "characters",
        "display_name": "角色",
        "name_field": None,  # 名称从映射文件获取
    },
    "weapon": {
        "key": "weapons",
        "data_key": "weapons",
        "display_name": "武器",
        "name_field": None,
    },
    "artifact": {
        "key": "artifacts",
        "data_key": "artifact",  # 注意: data.json 中键名是 "artifact" (单数)
        "display_name": "圣遗物",
        "name_field": None,
    },
}


def load_data_file():
    """加载 data.json"""
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"错误: 未找到数据文件 {DATA_FILE}")
        sys.exit(1)


def load_name_map(version: Optional[str] = None):
    """加载名称-ID映射文件

    Args:
        version: 版本标识符，如果指定则从版本目录加载
    """
    # 确定映射文件路径
    if version:
        try:
            from version_manager import get_version_path
            version_path = get_version_path(version)
            if version_path:
                name_map_file = version_path / "processed" / "name_id_map.json"
            else:
                print(f"警告: 未找到版本 '{version}'", file=sys.stderr)
                return None
        except ImportError:
            print(f"警告: 无法导入 version_manager，使用默认路径", file=sys.stderr)
            name_map_file = DEFAULT_NAME_MAP_FILE
    else:
        name_map_file = DEFAULT_NAME_MAP_FILE

    try:
        with open(name_map_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"警告: 未找到名称映射文件 {name_map_file}", file=sys.stderr)
        print("提示: 请先运行 preprocess.py 生成映射文件", file=sys.stderr)
        return None


def find_id_by_name(name_map: dict, data_type: str, name: str, fuzzy: bool = False) -> list[str]:
    """根据名称查找ID

    Args:
        name_map: 名称映射字典
        data_type: 数据类型 (character/weapon/artifact)
        name: 搜索的名称
        fuzzy: 是否模糊搜索

    Returns:
        匹配的ID列表
    """
    if not name_map:
        return []

    type_key = TYPE_CONFIG[data_type]["key"]
    type_map = name_map.get(type_key, {})

    matches = []
    search_name = name.lower()

    for id_, names in type_map.items():
        # 检查简体、繁体、英文名称
        for name_field in ["cn_sim", "cn_trad", "en"]:
            if name_field in names:
                target_name = names[name_field].lower()
                if fuzzy:
                    if search_name in target_name:
                        matches.append((id_, names))
                        break
                else:
                    if search_name == target_name:
                        return [(id_, names)]
    return matches


def format_config_output(data: dict, data_type: str, include_id: bool = True) -> str:
    """格式化配置输出（美观打印）"""
    type_name = TYPE_CONFIG[data_type]["display_name"]

    lines = []
    lines.append(f"{'='*60}")
    lines.append(f"{type_name}配置")
    lines.append(f"{'='*60}")

    if data_type == "character":
        lines.append(f"\n技能配置：")
        for skill_type in ["normal", "skill", "elementalBurst", "other", "proudSkills"]:
            if skill_type in data.get("skills", {}):
                lines.append(f"\n  【{skill_type}】")
                for i, skill_config in enumerate(data["skills"][skill_type]):
                    lines.append(f"    配置 {i+1}:")
                    lines.append(f"      {json.dumps(skill_config, ensure_ascii=False, indent=8)}")

        if "constellation" in data:
            lines.append(f"\n  【constellation】")
            for const_id, const_config in data["constellation"].items():
                lines.append(f"    命座 {const_id}:")
                lines.append(f"      {json.dumps(const_config, ensure_ascii=False, indent=8)}")

    elif data_type == "weapon":
        lines.append(f"\n配置：")
        lines.append(f"  {json.dumps(data, ensure_ascii=False, indent=2)}")

    elif data_type == "artifact":
        lines.append(f"\n配置：")
        lines.append(f"  {json.dumps(data, ensure_ascii=False, indent=2)}")

    return "\n".join(lines)


def query_by_id(data: dict, data_type: str, id_: str) -> Optional[dict]:
    """根据ID查询配置"""
    type_key = TYPE_CONFIG[data_type]["key"]
    data_key = TYPE_CONFIG[data_type].get("data_key", type_key)  # 对于 artifact 使用 "artifact"
    type_data = data.get(data_key, {})
    return type_data.get(id_)


def list_all_ids(data: dict, data_type: str, name_map: Optional[dict] = None):
    """列出所有ID"""
    type_key = TYPE_CONFIG[data_type]["key"]
    data_key = TYPE_CONFIG[data_type].get("data_key", type_key)  # 对于 artifact 使用 "artifact"
    type_name = TYPE_CONFIG[data_type]["display_name"]
    type_data = data.get(data_key, {})

    print(f"\n{type_name}列表 (共{len(type_data)}个):")
    print(f"{'='*60}")

    ids = sorted(type_data.keys())
    for id_ in ids:
        name = ""
        if name_map and type_key in name_map and id_ in name_map[type_key]:
            names = name_map[type_key][id_]
            name = f" - {names.get('cn_sim', names.get('en', ''))}"
        print(f"  [{id_}]{name}")


def main():
    parser = argparse.ArgumentParser(
        description="查询并导出 data.json 中的配置",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--type",
        type=str,
        choices=["character", "weapon", "artifact"],
        required=True,
        help="数据类型",
    )
    group = parser.add_mutually_exclusive_group(required=False)
    group.add_argument("--id", type=str, help="要查询的ID")
    group.add_argument("--name", type=str, help="要查询的名称（精确匹配）")
    group.add_argument(
        "--fuzzy", type=str, help="模糊搜索名称（支持部分匹配）"
    )
    parser.add_argument("--list", action="store_true", help="列出所有ID")
    parser.add_argument("--output", type=str, help="输出文件路径（不指定则打印到控制台）")
    parser.add_argument("--json", action="store_true", help="以纯JSON格式输出（不美化）")
    parser.add_argument(
        "--version",
        type=str,
        default=None,
        help="查询的版本标识符（默认: latest）。从版本目录加载名称映射。",
    )

    args = parser.parse_args()

    # 加载数据
    data = load_data_file()
    name_map = load_name_map(version=args.version)

    # 列出所有ID
    if args.list:
        list_all_ids(data, args.type, name_map)
        return

    # 确定要查询的ID
    target_id = args.id
    name_info = None

    if args.name:
        matches = find_id_by_name(name_map, args.type, args.name, fuzzy=False)
        if not matches:
            print(f"未找到名称为 '{args.name}' 的 {TYPE_CONFIG[args.type]['display_name']}")
            sys.exit(1)
        target_id = matches[0][0]
        name_info = matches[0][1]
        print(f"找到匹配: {name_info.get('cn_sim', '')} (ID: {target_id})")

    elif args.fuzzy:
        matches = find_id_by_name(name_map, args.type, args.fuzzy, fuzzy=True)
        if not matches:
            print(f"未找到包含 '{args.fuzzy}' 的 {TYPE_CONFIG[args.type]['display_name']}")
            sys.exit(1)
        print(f"找到 {len(matches)} 个匹配结果:")
        for id_, names in matches:
            print(f"  [{id_}] {names.get('cn_sim', names.get('en', ''))}")
        return

    elif not target_id:
        parser.print_help()
        print("\n错误: 必须指定 --id, --name, --fuzzy 或 --list")
        sys.exit(1)

    # 查询配置
    config = query_by_id(data, args.type, target_id)
    if not config:
        print(f"错误: 未找到ID为 {target_id} 的 {TYPE_CONFIG[args.type]['display_name']}")
        sys.exit(1)

    # 输出结果
    if args.output:
        # 导出到文件时使用纯JSON格式（便于程序读取）
        output = json.dumps(config, ensure_ascii=False, indent=2)
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"配置已导出到: {output_path}")
    elif args.json:
        # 纯JSON输出到控制台
        print(json.dumps(config, ensure_ascii=False, indent=2))
    else:
        # 美化输出到控制台
        print(format_config_output(config, args.type))


if __name__ == "__main__":
    main()
