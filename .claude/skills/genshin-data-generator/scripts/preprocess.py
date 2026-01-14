#!/usr/bin/env python3
"""
原神数据预处理脚本
从解包数据中提取核心信息，去除levelMap等无用数据
"""

import json
import os
from pathlib import Path


def process_avatar_data(data):
    """处理角色数据"""
    processed = {}
    for chara_id, chara_data in data.items():
        processed[chara_id] = {
            "id": chara_data.get("id"),
            "name": chara_data.get("name"),
            "desc": chara_data.get("desc"),
            "weaponType": chara_data.get("weaponType"),
            "tags": chara_data.get("tags", []),
            "qualityType": chara_data.get("qualityType"),
            "skills": {},
        }

        # 处理skills
        skills = chara_data.get("skills", {})
        for skill_type in [
            "normal",
            "skill",
            "elementalBurst",
            "proudSkills",
            "constellation",
        ]:
            if skill_type in skills:
                skill_list = []
                for skill in skills[skill_type]:
                    # 只保留核心字段
                    skill_data = {
                        "id": skill.get("id"),
                        "name": skill.get("name"),
                        "desc": skill.get("desc"),
                        "paramList": skill.get("paramList", []),
                        "paramMap": skill.get("paramMap", {}),
                        "paramDescList": skill.get("paramDescList", []),
                    }
                    skill_list.append(skill_data)
                processed[chara_id]["skills"][skill_type] = skill_list

    return processed


def process_weapon_data(data):
    """处理武器数据"""
    processed = {}
    for weapon_id, weapon_data in data.items():
        processed[weapon_id] = {
            "id": weapon_data.get("id"),
            "rankLevel": weapon_data.get("rankLevel"),
            "name": weapon_data.get("name"),
            "desc": weapon_data.get("desc"),
            "weaponType": weapon_data.get("weaponType"),
            "skillAffixMap": {},
        }

        # 处理skillAffixMap
        skill_affix = weapon_data.get("skillAffixMap", {})
        for affix_id, affix_data in skill_affix.items():
            processed[weapon_id]["skillAffixMap"][affix_id] = {
                "id": affix_data.get("id"),
                "name": affix_data.get("name"),
                "desc": affix_data.get("desc"),
                "paramList": affix_data.get("paramList", []),
                "paramValidIndexes": affix_data.get("paramValidIndexes", []),
                "addProps": affix_data.get("addProps", []),
            }

    return processed


def process_artifact_data(data):
    """处理圣遗物数据"""
    processed = {}
    for set_id, set_data in data.items():
        # 只处理5星套装
        if set_data.get("rankLevel") == "QUALITY_ORANGE":
            processed[set_id] = {
                "id": set_data.get("id"),
                "setId": set_data.get("setId"),
                "setName": set_data.get("setName"),
                "setAffixes": [],
            }

            # 处理setAffixs（注意字段名是setAffixs，不是setAffixes）
            set_affixes = set_data.get("setAffixs", [])
            for affix_data in set_affixes:
                processed[set_id]["setAffixes"].append(
                    {
                        "id": affix_data.get("id"),
                        "name": affix_data.get("name"),
                        "desc": affix_data.get("desc"),
                        "paramList": affix_data.get("paramList", []),
                        "paramValidIndexes": affix_data.get("paramValidIndexes", []),
                        "addProps": affix_data.get("addProps", []),
                    }
                )

    return processed


def main():
    # 设置路径（从脚本位置计算）
    script_dir = Path(__file__).resolve().parent
    # 向上查找项目根目录（包含src目录）
    project_root = script_dir
    while not (project_root / "src").exists() and project_root.parent != project_root:
        project_root = project_root.parent

    genshin_dir = project_root / "src" / "assets" / "genshin"
    output_file = (
        project_root
        / ".claude"
        / "skills"
        / "genshin-data-generator"
        / "output"
        / "processed_data.json"
    )

    # 确保output目录存在
    output_file.parent.mkdir(parents=True, exist_ok=True)

    print("开始预处理数据...")
    print(f"  输入目录: {genshin_dir.resolve()}")
    print(f"  输出文件: {output_file.resolve()}")

    # 处理avatar_map.json
    print("  处理角色数据...")
    with open(genshin_dir / "avatar_map.json", "r", encoding="utf-8") as f:
        avatar_data = json.load(f)
    processed_avatar = process_avatar_data(avatar_data)

    # 处理weapon_map.json
    print("  处理武器数据...")
    with open(genshin_dir / "weapon_map.json", "r", encoding="utf-8") as f:
        weapon_data = json.load(f)
    processed_weapon = process_weapon_data(weapon_data)

    # 处理reliquary_set_map.json
    print("  处理圣遗物数据...")
    with open(genshin_dir / "reliquary_set_map.json", "r", encoding="utf-8") as f:
        artifact_data = json.load(f)
        processed_artifact = process_artifact_data(artifact_data)

    # 合并输出
    processed_data = {
        "characters": processed_avatar,
        "weapons": processed_weapon,
        "artifacts": processed_artifact,
    }

    # 输出
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=2)

    # 统计信息
    original_avatar_size = os.path.getsize(genshin_dir / "avatar_map.json")
    original_weapon_size = os.path.getsize(genshin_dir / "weapon_map.json")
    output_size = os.path.getsize(output_file)

    print(f"\n预处理完成！")
    print(f"原始avatar_map.json: {original_avatar_size / 1024 / 1024:.2f} MB")
    print(f"原始weapon_map.json: {original_weapon_size / 1024 / 1024:.2f} MB")
    print(f"输出processed_data.json: {output_size / 1024 / 1024:.2f} MB")
    print(
        f"压缩率: {(1 - output_size / (original_avatar_size + original_weapon_size)) * 100:.2f}%"
    )


if __name__ == "__main__":
    main()
