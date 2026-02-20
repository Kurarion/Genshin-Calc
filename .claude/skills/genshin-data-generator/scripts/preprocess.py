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


def process_avatar_data(data, output_dir=None):
    """处理角色数据

    数据结构说明：
    - skills.normal/skill/elementalBurst 是单个字典（不是列表）
    - skills.proudSkills/talents 是列表
    - skills.constellation 是字典，键是 "0", "1", ..., "5"，值是技能列表
    - 参数存储在 paramMap 中（等级→参数列表），不是 paramList

    Args:
        data: 原始角色数据
        output_dir: 如果提供，将为每个角色单独导出JSON文件
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

        # 为每个角色单独导出JSON文件
        if output_dir:
            char_output_file = output_dir / f"character_{chara_id}.json"
            with open(char_output_file, "w", encoding="utf-8") as f:
                json.dump(processed[chara_id], f, ensure_ascii=False, indent=2)

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


def process_weapon_data(data, output_dir=None):
    """处理武器数据

    Args:
        data: 原始武器数据
        output_dir: 如果提供，将为每个武器单独导出JSON文件
    """
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

        # 为每个武器单独导出JSON文件
        if output_dir:
            weapon_output_file = output_dir / f"weapon_{weapon_id}.json"
            with open(weapon_output_file, "w", encoding="utf-8") as f:
                json.dump(processed[weapon_id], f, ensure_ascii=False, indent=2)

    return processed


def process_artifact_data(data, output_dir=None):
    """处理圣遗物数据

    Args:
        data: 原始圣遗物数据
        output_dir: 如果提供，将为每个圣遗物套装单独导出JSON文件
    """
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

        # 为每个圣遗物套装单独导出JSON文件
        if output_dir:
            artifact_output_file = output_dir / f"artifact_{set_id}.json"
            with open(artifact_output_file, "w", encoding="utf-8") as f:
                json.dump(processed[set_id], f, ensure_ascii=False, indent=2)

    return processed


def generate_name_id_map(processed_data, output_path):
    """生成名称到ID的映射文件

    **重要**：此函数会读取现有的 data.json 来获取正确的 ID 顺序，
    确保生成的 name_id_map.json 与 data.json 保持相同的顺序。
    这样 AI 可以通过 name_id_map.json 来确定新配置的正确插入位置。

    Args:
        processed_data: 预处理后的数据
        output_path: 映射文件输出路径
    """
    # 尝试读取现有的 data.json 来获取 ID 顺序
    # 从 scripts/ 目录需要向上 4 层才能到达项目根目录
    data_json_path = Path(__file__).resolve().parent.parent.parent.parent.parent / "src" / "assets" / "init" / "data.json"

    existing_order = {
        "characters": [],
        "weapons": [],
        "artifacts": []
    }

    if data_json_path.exists():
        try:
            with open(data_json_path, "r", encoding="utf-8") as f:
                data_json = json.load(f)

            # 提取 ID 顺序
            if "characters" in data_json:
                existing_order["characters"] = list(data_json["characters"].keys())
            if "weapons" in data_json:
                existing_order["weapons"] = list(data_json["weapons"].keys())
            if "artifact" in data_json:  # 注意：data.json 中是 "artifact"（单数）
                existing_order["artifacts"] = list(data_json["artifact"].keys())

        except Exception as e:
            print(f"  警告: 无法读取 data.json 获取顺序: {e}")
            print(f"  将使用默认顺序（按 ID 排序）")

    name_map = {
        "characters": {},
        "weapons": {},
        "artifacts": {}
    }

    # 辅助函数：按正确的顺序生成映射
    def build_ordered_map(processed_items, existing_ids, data_type):
        """完全保持 data.json 的顺序，新项目按 ID 数值插入到合适位置"""
        existing_id_set = set(existing_ids)

        # 收集所有需要包含的项目（现有 + 新的）
        all_items = []

        # 首先按 data.json 顺序添加现有项目
        for existing_id in existing_ids:
            if existing_id in processed_items:
                all_items.append((existing_id, processed_items[existing_id]))

        # 收集新项目（不在现有顺序中的），并按数值排序
        new_items = []
        for item_id, item_data in processed_items.items():
            if item_id not in existing_id_set:
                new_items.append((item_id, item_data))
        new_items.sort(key=lambda x: int(x[0]) if x[0].isdigit() else 0)

        # 将新项目插入到合适的位置
        for new_item in new_items:
            new_id = new_item[0]
            inserted = False
            for i, (existing_id, _) in enumerate(all_items):
                if int(new_id) < int(existing_id):
                    all_items.insert(i, new_item)
                    inserted = True
                    break
            if not inserted:
                all_items.append(new_item)

        # 按最终顺序生成映射
        ordered_map = {}
        for item_id, item_data in all_items:
            if data_type == "character":
                name_obj = item_data.get("name", {})
                ordered_map[item_id] = {
                    "cn_sim": name_obj.get("cn_sim", ""),
                    "cn_tra": name_obj.get("cn_tra", ""),
                    "jp": name_obj.get("jp", ""),
                    "en": name_obj.get("en", ""),
                }
            elif data_type == "weapon":
                name_obj = item_data.get("name", {})
                ordered_map[item_id] = {
                    "cn_sim": name_obj.get("cn_sim", ""),
                    "cn_tra": name_obj.get("cn_tra", ""),
                    "jp": name_obj.get("jp", ""),
                    "en": name_obj.get("en", ""),
                }
            elif data_type == "artifact":
                name_obj = item_data.get("setName", {})
                ordered_map[item_id] = {
                    "cn_sim": name_obj.get("cn_sim", ""),
                    "cn_tra": name_obj.get("cn_tra", ""),
                    "jp": name_obj.get("jp", ""),
                    "en": name_obj.get("en", ""),
                }

        return ordered_map

    # 处理角色名称映射（保持 data.json 中的顺序）
    name_map["characters"] = build_ordered_map(
        processed_data["characters"],
        existing_order["characters"],
        "character"
    )

    # 处理武器名称映射（保持 data.json 中的顺序）
    name_map["weapons"] = build_ordered_map(
        processed_data["weapons"],
        existing_order["weapons"],
        "weapon"
    )

    # 处理圣遗物套装名称映射（保持 data.json 中的顺序）
    name_map["artifacts"] = build_ordered_map(
        processed_data["artifacts"],
        existing_order["artifacts"],
        "artifact"
    )

    # 输出映射文件
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(name_map, f, ensure_ascii=False, indent=2)

    # 统计信息
    total_count = (
        len(name_map["characters"])
        + len(name_map["weapons"])
        + len(name_map["artifacts"])
    )
    print(f"  已生成名称-ID映射文件: {output_path.resolve()}")
    print(f"    - 角色: {len(name_map['characters'])} 个")
    print(f"    - 武器: {len(name_map['weapons'])} 个")
    print(f"    - 圣遗物: {len(name_map['artifacts'])} 个")
    print(f"    - 总计: {total_count} 个")
    print(f"    - 映射文件保持与 data.json 相同的 ID 顺序")

    return name_map


def main():
    import argparse

    # 命令行参数解析
    parser = argparse.ArgumentParser(description="原神数据预处理脚本")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=None,
        help="指定输出目录（默认为 .claude/skills/genshin-data-generator/output/）"
    )
    args = parser.parse_args()

    # 设置路径（从脚本位置计算）
    script_dir = Path(__file__).resolve().parent
    # 向上查找项目根目录（包含src目录）
    project_root = script_dir
    while not (project_root / "src").exists() and project_root.parent != project_root:
        project_root = project_root.parent

    genshin_dir = project_root / "src" / "assets" / "genshin"

    # 确定输出目录
    if args.output_dir:
        output_file = args.output_dir / "processed_data.json"
    else:
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
    # 创建characters子目录用于单独导出角色文件
    characters_dir = output_file.parent / "characters"
    characters_dir.mkdir(parents=True, exist_ok=True)
    # 创建weapons子目录用于单独导出武器文件
    weapons_dir = output_file.parent / "weapons"
    weapons_dir.mkdir(parents=True, exist_ok=True)
    # 创建artifacts子目录用于单独导出圣遗物文件
    artifacts_dir = output_file.parent / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    print("开始预处理数据...")
    print(f"  输入目录: {genshin_dir.resolve()}")
    print(f"  输出文件: {output_file.resolve()}")
    print(f"  角色单独导出目录: {characters_dir.resolve()}")
    print(f"  武器单独导出目录: {weapons_dir.resolve()}")
    print(f"  圣遗物单独导出目录: {artifacts_dir.resolve()}")

    # 处理avatar_map.json
    print("  处理角色数据...")
    with open(genshin_dir / "avatar_map.json", "r", encoding="utf-8") as f:
        avatar_data = json.load(f)
    processed_avatar = process_avatar_data(avatar_data, output_dir=characters_dir)
    print(f"    已导出 {len(processed_avatar)} 个角色单独文件")

    # 处理weapon_map.json
    print("  处理武器数据...")
    with open(genshin_dir / "weapon_map.json", "r", encoding="utf-8") as f:
        weapon_data = json.load(f)
    processed_weapon = process_weapon_data(weapon_data, output_dir=weapons_dir)

    # 处理reliquary_set_map.json
    print("  处理圣遗物数据...")
    with open(genshin_dir / "reliquary_set_map.json", "r", encoding="utf-8") as f:
        artifact_data = json.load(f)
        processed_artifact = process_artifact_data(artifact_data, output_dir=artifacts_dir)
    print(f"    已导出 {len(processed_artifact)} 个圣遗物套装单独文件")

    # 合并输出
    processed_data = {
        "characters": processed_avatar,
        "weapons": processed_weapon,
        "artifacts": processed_artifact,
    }

    # 输出（使用紧凑格式，列表显示在一行）
    with open(output_file, "w", encoding="utf-8") as f:
        compact_json_dump(processed_data, f, ensure_ascii=False)

    # 生成名称-ID映射文件
    name_map_file = output_file.parent / "name_id_map.json"
    generate_name_id_map(processed_data, name_map_file)

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
