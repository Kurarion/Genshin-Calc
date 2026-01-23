#!/usr/bin/env python3
"""
检查data.json中尚未实现的ID，方便了解待处理的游戏数据
"""

import json
import argparse
from pathlib import Path
import sys

# 设置路径（从脚本位置查找项目根目录）
script_dir = Path(__file__).resolve().parent
project_root = script_dir
while not (project_root / "src").exists() and project_root.parent != project_root:
    project_root = project_root.parent

PROCESSED_FILE = (
    project_root / ".claude/skills/genshin-data-generator/output/processed_data.json"
)
DATA_FILE = project_root / "src/assets/init/data.json"


def load_processed_data():
    """加载预处理后的数据"""
    try:
        with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"错误: 未找到预处理数据文件 {PROCESSED_FILE}")
        print("请先运行 preprocess.py")
        sys.exit(1)


def load_data_json():
    """加载data.json"""
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"警告: 未找到 {DATA_FILE}")
        return None


def check_characters():
    """检查尚未实现的角色"""
    print("\n" + "=" * 60)
    print("角色实现情况")
    print("=" * 60)

    processed_data = load_processed_data()
    data_json = load_data_json()

    processed_chars = processed_data.get("characters", {})
    implemented_chars = data_json.get("characters", {}) if data_json else {}

    processed_ids = set(processed_chars.keys())
    implemented_ids = set(implemented_chars.keys())

    # 未实现的角色
    unimplemented_ids = processed_ids - implemented_ids
    # 已实现但不在解包数据中的角色
    extra_ids = implemented_ids - processed_ids

    print(f"\n解包数据中的角色总数: {len(processed_ids)}")
    print(f"data.json中已实现的角色数: {len(implemented_ids)}")
    print(f"未实现的角色数: {len(unimplemented_ids)}")
    print(f"多余的角色数: {len(extra_ids)}")

    if unimplemented_ids:
        print(f"\n未实现的角色 ({len(unimplemented_ids)}):")
        print("-" * 60)
        for chara_id in sorted(unimplemented_ids):
            chara_data = processed_chars[chara_id]
            name = chara_data.get("name", "未知")
            weapon_type = chara_data.get("weaponType", "未知")
            quality = chara_data.get("qualityType", "未知")
            print(f"  [{chara_id}] {name} (武器: {weapon_type}, 品质: {quality})")

    if extra_ids:
        print(f"\n多余的角色 (已实现但不在解包数据中) ({len(extra_ids)}):")
        print("-" * 60)
        for chara_id in sorted(extra_ids):
            print(f"  [{chara_id}]")

    # 输出到文件
    output_dir = project_root / ".claude/skills/genshin-data-generator/output"
    output_dir.mkdir(parents=True, exist_ok=True)

    if unimplemented_ids:
        unimplemented_file = output_dir / "unimplemented_characters.txt"
        with open(unimplemented_file, "w", encoding="utf-8") as f:
            for chara_id in sorted(unimplemented_ids):
                chara_data = processed_chars[chara_id]
                name = chara_data.get("name", "未知")
                weapon_type = chara_data.get("weaponType", "未知")
                f.write(f"{chara_id}\t{name}\t{weapon_type}\n")
        print(f"\n未实现角色列表已导出到: {unimplemented_file}")


def check_weapons():
    """检查尚未实现的武器"""
    print("\n" + "=" * 60)
    print("武器实现情况")
    print("=" * 60)

    processed_data = load_processed_data()
    data_json = load_data_json()

    processed_weapons = processed_data.get("weapons", {})
    implemented_weapons = data_json.get("weapons", {}) if data_json else {}

    processed_ids = set(processed_weapons.keys())
    implemented_ids = set(implemented_weapons.keys())

    # 未实现的武器
    unimplemented_ids = processed_ids - implemented_ids
    # 已实现但不在解包数据中的武器
    extra_ids = implemented_ids - processed_ids

    print(f"\n解包数据中的武器总数: {len(processed_ids)}")
    print(f"data.json中已实现的武器数: {len(implemented_ids)}")
    print(f"未实现的武器数: {len(unimplemented_ids)}")
    print(f"多余的武器数: {len(extra_ids)}")

    if unimplemented_ids:
        print(f"\n未实现的武器 ({len(unimplemented_ids)}):")
        print("-" * 60)
        for weapon_id in sorted(unimplemented_ids):
            weapon_data = processed_weapons[weapon_id]
            name = weapon_data.get("name", "未知")
            weapon_type = weapon_data.get("weaponType", "未知")
            rank = weapon_data.get("rankLevel", "未知")
            print(f"  [{weapon_id}] {name} (类型: {weapon_type}, 稀有度: {rank})")

    if extra_ids:
        print(f"\n多余的武器 (已实现但不在解包数据中) ({len(extra_ids)}):")
        print("-" * 60)
        for weapon_id in sorted(extra_ids):
            print(f"  [{weapon_id}]")

    # 输出到文件
    output_dir = project_root / ".claude/skills/genshin-data-generator/output"
    output_dir.mkdir(parents=True, exist_ok=True)

    if unimplemented_ids:
        unimplemented_file = output_dir / "unimplemented_weapons.txt"
        with open(unimplemented_file, "w", encoding="utf-8") as f:
            for weapon_id in sorted(unimplemented_ids):
                weapon_data = processed_weapons[weapon_id]
                name = weapon_data.get("name", "未知")
                weapon_type = weapon_data.get("weaponType", "未知")
                f.write(f"{weapon_id}\t{name}\t{weapon_type}\n")
        print(f"\n未实现武器列表已导出到: {unimplemented_file}")


def check_artifacts():
    """检查尚未实现的圣遗物"""
    print("\n" + "=" * 60)
    print("圣遗物实现情况")
    print("=" * 60)

    processed_data = load_processed_data()
    data_json = load_data_json()

    processed_artifacts = processed_data.get("artifacts", {})
    implemented_artifacts = data_json.get("artifact", {}) if data_json else {}

    processed_ids = set(processed_artifacts.keys())
    implemented_ids = set(implemented_artifacts.keys())

    # 未实现的圣遗物
    unimplemented_ids = processed_ids - implemented_ids
    # 已实现但不在解包数据中的圣遗物
    extra_ids = implemented_ids - processed_ids

    print(f"\n解包数据中的圣遗物总数: {len(processed_ids)}")
    print(f"data.json中已实现的圣遗物数: {len(implemented_ids)}")
    print(f"未实现的圣遗物数: {len(unimplemented_ids)}")
    print(f"多余的圣遗物数: {len(extra_ids)}")

    if unimplemented_ids:
        print(f"\n未实现的圣遗物 ({len(unimplemented_ids)}):")
        print("-" * 60)
        for set_id in sorted(unimplemented_ids):
            artifact_data = processed_artifacts[set_id]
            name = artifact_data.get("setName", "未知")
            print(f"  [{set_id}] {name}")

    if extra_ids:
        print(f"\n多余的圣遗物 (已实现但不在解包数据中) ({len(extra_ids)}):")
        print("-" * 60)
        for set_id in sorted(extra_ids):
            print(f"  [{set_id}]")

    # 输出到文件
    output_dir = project_root / ".claude/skills/genshin-data-generator/output"
    output_dir.mkdir(parents=True, exist_ok=True)

    if unimplemented_ids:
        unimplemented_file = output_dir / "unimplemented_artifacts.txt"
        with open(unimplemented_file, "w", encoding="utf-8") as f:
            for set_id in sorted(unimplemented_ids):
                artifact_data = processed_artifacts[set_id]
                name = artifact_data.get("setName", "未知")
                f.write(f"{set_id}\t{name}\n")
        print(f"\n未实现圣遗物列表已导出到: {unimplemented_file}")


def main():
    parser = argparse.ArgumentParser(description="检查data.json中尚未实现的ID")
    parser.add_argument(
        "--type",
        type=str,
        choices=["character", "weapon", "artifact", "all"],
        default="all",
        help="检查类型",
    )
    args = parser.parse_args()

    if args.type in ["character", "all"]:
        check_characters()

    if args.type in ["weapon", "all"]:
        check_weapons()

    if args.type in ["artifact", "all"]:
        check_artifacts()

    print("\n" + "=" * 60)
    print("检查完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
