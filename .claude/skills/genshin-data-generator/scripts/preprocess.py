#!/usr/bin/env python3
"""
原神数据预处理脚本
从解包数据中提取核心信息，去除levelMap等无用数据
"""

import json
import os
import re
from pathlib import Path


def compact_json_dump(obj, f, ensure_ascii=False):
    """紧凑地输出 JSON，列表显示在一行"""
    # 先生成带缩进的 JSON
    json_str = json.dumps(obj, ensure_ascii=ensure_ascii, indent=2)

    # 使用正则表达式将多行列表压缩成一行
    # 匹配包含简单值的列表（数字、字符串、布尔值）
    def compact_list(match):
        content = match.group(1)
        # 去掉换行和缩进空格，用空格分隔
        items = re.findall(r'[0-9.-]+|"[^"]*"|true|false|null', content)
        return '[' + ', '.join(items) + ']'

    # 压缩只包含简单值的列表
    json_str = re.sub(
        r'\[\n((?:\s+(?:[0-9.-]+|"[^"]*"|true|false|null),?\n)+)\s*\]',
        compact_list,
        json_str
    )

    f.write(json_str)


def process_avatar_data(data):
    """处理角色数据

    数据结构说明：
    - skills.normal/skill/elementalBurst 是单个字典（不是列表）
    - skills.proudSkills/talents 是列表
    - skills.constellation 是字典，键是 "0", "1", ..., "5"，值是技能列表
    - 参数存储在 paramMap 中（等级→参数列表），不是 paramList
    """
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

        # 处理单个技能类型的（normal, skill, elementalBurst, other）
        for skill_type in ["normal", "skill", "elementalBurst", "other"]:
            if skill_type in skills and isinstance(skills[skill_type], dict):
                # 将单个字典包装成列表
                processed[chara_id]["skills"][skill_type] = [
                    extract_skill_data(skills[skill_type])
                ]

        # 处理列表类型的（proudSkills, talents）
        for skill_type in ["proudSkills", "talents"]:
            if skill_type in skills and isinstance(skills[skill_type], list):
                processed[chara_id]["skills"][skill_type] = [
                    extract_skill_data(skill) for skill in skills[skill_type]
                ]

        # 处理constellation（特殊的字典结构）
        if "constellation" in skills and isinstance(skills["constellation"], dict):
            constellation_data = {}
            for const_id in ["0", "1", "2", "3", "4", "5"]:
                if const_id in skills["constellation"]:
                    const_skill = skills["constellation"][const_id]
                    if isinstance(const_skill, dict):
                        constellation_data[const_id] = [extract_skill_data(const_skill)]
                    elif isinstance(const_skill, list):
                        constellation_data[const_id] = [
                            extract_skill_data(skill) for skill in const_skill
                        ]
            processed[chara_id]["skills"]["constellation"] = constellation_data

    return processed


def extract_skill_data(skill):
    """从技能数据中提取核心字段"""
    # 只保留 paramMap 中的等级 01 和 10，减少文件大小
    param_map = skill.get("paramMap")
    filtered_param_map = {}
    if param_map and isinstance(param_map, dict):
        if "01" in param_map:
            filtered_param_map["01"] = param_map["01"]
        if "10" in param_map:
            filtered_param_map["10"] = param_map["10"]

    return {
        "id": skill.get("id"),
        "name": skill.get("name"),
        "desc": skill.get("desc"),
        "paramMap": filtered_param_map,
        "paramDescList": skill.get("paramDescList", {}),
        "paramValidIndexes": skill.get("paramValidIndexes"),
    }


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

        # 只保留精炼 1 阶和 5 阶（键 '1' 和 '5'）
        skill_affix = weapon_data.get("skillAffixMap", {})
        for affix_id in ["1", "5"]:
            if affix_id in skill_affix:
                affix_data = skill_affix[affix_id]
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

    # 输出（使用紧凑格式，列表显示在一行）
    with open(output_file, "w", encoding="utf-8") as f:
        compact_json_dump(processed_data, f, ensure_ascii=False)

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
