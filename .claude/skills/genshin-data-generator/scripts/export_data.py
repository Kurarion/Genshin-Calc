#!/usr/bin/env python3
"""
导出指定ID的解包数据，方便 AI 分析

注意：预处理脚本已自动为所有角色、武器、圣遗物生成单独JSON文件，
     直接使用 output/characters/、output/weapons/、output/artifacts 中的文件即可。
     本脚本保留用于导出到 exports/ 目录（例如临时分析特定数据）。
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


def load_processed_data():
    """加载预处理后的数据"""
    try:
        with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"错误: 未找到预处理数据文件 {PROCESSED_FILE}")
        print("请先运行 preprocess.py")
        sys.exit(1)


def export_single_data(id, data_type, data, output_path):
    """通用的单个数据导出函数

    Args:
        id: 数据ID
        data_type: 数据类型 (character/weapon/artifact)
        data: 数据内容
        output_path: 输出文件路径
    """
    type_names = {
        "character": "角色",
        "weapon": "武器",
        "artifact": "圣遗物"
    }

    print(f"{type_names[data_type]} {id} 数据已导出到: {output_path}")
    print(f"\n基本信息:")

    # 根据类型显示不同的信息
    if data_type == "character":
        print(f"  - 名称: {data.get('name', {}).get('cn_sim', '未知')}")
        print(f"  - 武器类型: {data.get('weaponType', '未知')}")
        print(f"  - 品质: {data.get('qualityType', '未知')}")

        skills = data.get("skills", {})
        if skills:
            print(f"\n技能概览:")
            for skill_type, skill_list in skills.items():
                if skill_list:
                    print(f"  - {skill_type}: {len(skill_list)} 个技能")

    elif data_type == "weapon":
        print(f"  - 名称: {data.get('name', {}).get('cn_sim', '未知')}")
        print(f"  - 稀有度: {data.get('rankLevel', '未知')}")
        print(f"  - 武器类型: {data.get('weaponType', '未知')}")

        skill_affix = data.get("skillAffixMap", {})
        if skill_affix:
            print(f"\n精炼效果:")
            for affix_id, affix_data in skill_affix.items():
                print(f"  - {affix_id}: {affix_data.get('name', {}).get('cn_sim', '未知')}")

    elif data_type == "artifact":
        print(f"  - 套装名称: {data.get('setName', {}).get('cn_sim', '未知')}")
        print(f"  - 套装ID: {data.get('setId', '未知')}")

        set_affixes = data.get("setAffixes", [])
        if set_affixes:
            print(f"\n套装效果:")
            for i, affix_data in enumerate(set_affixes):
                print(f"  - {'2件套' if i == 0 else '4件套'}: {affix_data.get('name', {}).get('cn_sim', '未知')}")


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
    parser.add_argument(
        "--output",
        type=str,
        help="输出目录（默认为output/exports/）"
    )
    args = parser.parse_args()

    print("加载预处理数据...")
    processed_data = load_processed_data()

    # 设置输出目录（确保在项目内部）
    default_output_dir = script_dir.parent / "exports"

    if args.output:
        output_dir = Path(args.output)
        # 确保输出路径在项目内部
        if output_dir.is_absolute():
            try:
                output_dir.relative_to(project_root)
                # 在项目内部，使用原路径
                pass
            except ValueError:
                # 在项目外部，重定向到 exports 目录
                print(f"警告: 输出路径在项目外部，已重定向到项目内部目录")
                output_dir = default_output_dir
        else:
            # 相对路径，放到 exports 目录
            output_dir = default_output_dir / output_dir
    else:
        output_dir = default_output_dir

    output_dir.mkdir(parents=True, exist_ok=True)

    # 根据类型获取数据
    type_keys = {
        "character": "characters",
        "weapon": "weapons",
        "artifact": "artifacts"
    }

    data_dict = processed_data.get(type_keys[args.type], {})

    if args.id not in data_dict:
        type_names = {
            "character": "角色",
            "weapon": "武器",
            "artifact": "圣遗物套装"
        }
        print(f"错误: 未找到{type_names[args.type]} {args.id}")
        print(f"可用的ID: {list(data_dict.keys())[:10]}...")
        return

    # 导出数据
    data = data_dict[args.id]
    output_file = output_dir / f"{args.type}_{args.id}.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    export_single_data(args.id, args.type, data, output_file)

    print("\n导出完成！")


if __name__ == "__main__":
    main()
