#!/usr/bin/env python3
"""
导出指定ID的解包数据，方便 AI 分析
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


def clean_skill_data(data):
    """清理技能数据，移除不需要的字段"""
    if not isinstance(data, dict):
        return data

    result = data.copy()
    if "paramDescSplitedList" in result:
        del result["paramDescSplitedList"]

    # 递归清理嵌套结构
    for key, value in result.items():
        if isinstance(value, dict):
            result[key] = clean_skill_data(value)
        elif isinstance(value, list):
            result[key] = [clean_skill_data(item) if isinstance(item, dict) else item for item in value]

    return result


def export_character(chara_id, processed_data, output_dir):
    """导出单个角色的解包数据"""
    characters = processed_data.get("characters", {})

    if chara_id not in characters:
        print(f"错误: 未找到角色 {chara_id}")
        print(f"可用的角色ID: {list(characters.keys())[:10]}...")
        return

    # 清理数据后再导出
    chara_data = clean_skill_data(characters[chara_id])

    # 创建输出文件
    output_file = output_dir / f"character_{chara_id}.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(chara_data, f, ensure_ascii=False, indent=2)

    print(
        f"角色 {chara_id} ({chara_data.get('name', '未知')}) 数据已导出到: {output_file}"
    )

    # 显示基本信息
    print(f"\n基本信息:")
    print(f"  - 名称: {chara_data.get('name', '未知')}")
    print(f"  - 武器类型: {chara_data.get('weaponType', '未知')}")
    print(f"  - 品质: {chara_data.get('qualityType', '未知')}")

    # 显示技能概览
    skills = chara_data.get("skills", {})
    print(f"\n技能概览:")
    for skill_type, skill_list in skills.items():
        if skill_list:
            print(f"  - {skill_type}: {len(skill_list)} 个技能")


def export_weapon(weapon_id, processed_data, output_dir):
    """导出单个武器的解包数据"""
    weapons = processed_data.get("weapons", {})

    if weapon_id not in weapons:
        print(f"错误: 未找到武器 {weapon_id}")
        print(f"可用的武器ID: {list(weapons.keys())[:10]}...")
        return

    # 清理数据后再导出
    weapon_data = clean_skill_data(weapons[weapon_id])

    # 创建输出文件
    output_file = output_dir / f"weapon_{weapon_id}.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(weapon_data, f, ensure_ascii=False, indent=2)

    print(
        f"武器 {weapon_id} ({weapon_data.get('name', '未知')}) 数据已导出到: {output_file}"
    )

    # 显示基本信息
    print(f"\n基本信息:")
    print(f"  - 名称: {weapon_data.get('name', '未知')}")
    print(f"  - 稀有度: {weapon_data.get('rankLevel', '未知')}")
    print(f"  - 武器类型: {weapon_data.get('weaponType', '未知')}")

    # 显示精炼效果
    skill_affix = weapon_data.get("skillAffixMap", {})
    print(f"\n精炼效果:")
    for affix_id, affix_data in skill_affix.items():
        print(f"  - {affix_id}: {affix_data.get('name', '未知')}")


def export_artifact(set_id, processed_data, output_dir):
    """导出单个圣遗物套装的解包数据"""
    artifacts = processed_data.get("artifacts", {})

    if set_id not in artifacts:
        print(f"错误: 未找到圣遗物套装 {set_id}")
        print(f"可用的套装ID: {list(artifacts.keys())[:10]}...")
        return

    # 清理数据后再导出
    artifact_data = clean_skill_data(artifacts[set_id])

    # 创建输出文件
    output_file = output_dir / f"artifact_{set_id}.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(artifact_data, f, ensure_ascii=False, indent=2)

    print(
        f"圣遗物套装 {set_id} ({artifact_data.get('setName', '未知')}) 数据已导出到: {output_file}"
    )

    # 显示基本信息
    print(f"\n基本信息:")
    print(f"  - 套装名称: {artifact_data.get('setName', '未知')}")
    print(f"  - 套装ID: {artifact_data.get('setId', '未知')}")

    # 显示套装效果
    set_affixes = artifact_data.get("setAffixes", [])
    print(f"\n套装效果:")
    for i, affix_data in enumerate(set_affixes):
        print(f"  - {'2件套' if i == 0 else '4件套'}: {affix_data.get('name', '未知')}")


def main():
    parser = argparse.ArgumentParser(description="导出指定ID的解包数据")
    parser.add_argument(
        "--type",
        type=str,
        choices=["character", "weapon", "artifact"],
        required=True,
        help="数据类型",
    )
    parser.add_argument("--id", type=str, required=True, help="要导出的ID")
    parser.add_argument("--output", type=str, help="输出目录（默认为output/exports/）")
    args = parser.parse_args()

    print("加载预处理数据...")
    processed_data = load_processed_data()

    # 设置输出目录
    if args.output:
        output_dir = Path(args.output)
    else:
        output_dir = project_root / ".claude/skills/genshin-data-generator/output" / "exports"

    output_dir.mkdir(parents=True, exist_ok=True)

    # 根据类型导出
    if args.type == "character":
        export_character(args.id, processed_data, output_dir)
    elif args.type == "weapon":
        export_weapon(args.id, processed_data, output_dir)
    elif args.type == "artifact":
        export_artifact(args.id, processed_data, output_dir)

    print("\n导出完成！")


if __name__ == "__main__":
    main()
