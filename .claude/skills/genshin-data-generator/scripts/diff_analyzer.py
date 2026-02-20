#!/usr/bin/env python3
"""
差分分析引擎
对比两个版本的数据，生成结构化差分报告
合并原 check_unimplemented.py 功能
"""

import json
import argparse
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Set, Tuple

# 导入 version_manager
try:
    from version_manager import (
        resolve_version,
        get_versions_dir,
        get_version_path,
    )
except ImportError:
    print("错误: 无法导入 version_manager 模块")
    sys.exit(1)


# 项目路径配置
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR
while not (PROJECT_ROOT / "src").exists() and PROJECT_ROOT.parent != PROJECT_ROOT:
    PROJECT_ROOT = PROJECT_ROOT.parent

DATA_FILE = PROJECT_ROOT / "src" / "assets" / "init" / "data.json"
# 默认输出目录：项目内部的 diffs 目录
DEFAULT_OUTPUT_DIR = SCRIPT_DIR.parent / "diffs"


def load_processed_data(version_spec: str) -> Optional[dict]:
    """加载指定版本的预处理数据

    Args:
        version_spec: 版本标识符 (短ID/完整commit ID)

    Returns:
        预处理数据字典，失败返回 None
    """
    version_path = get_version_path(version_spec)
    if version_path is None:
        print(f"错误: 未找到版本 '{version_spec}'")
        return None

    processed_file = version_path / "processed" / "processed_data.json"
    if not processed_file.exists():
        print(f"错误: 版本 '{version_spec}' 缺少处理后的数据文件")
        return None

    try:
        with open(processed_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"错误: 无法读取数据文件 - {e}")
        return None


def load_data_json() -> Optional[dict]:
    """加载 data.json

    Returns:
        data.json 内容，失败返回 None
    """
    if not DATA_FILE.exists():
        return None

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"警告: 无法读取 data.json - {e}")
        return None


def compare_items(
    old_items: Dict,
    new_items: Dict,
    item_type: str
) -> Dict[str, List[Dict]]:
    """比对两个版本的项目

    Args:
        old_items: 旧版本的项目字典
        new_items: 新版本的项目字典
        item_type: 项目类型 (character/weapon/artifact)

    Returns:
        差分字典，包含 ADDED, MODIFIED, REMOVED, UNCHANGED
    """
    old_ids = set(old_items.keys()) if old_items else set()
    new_ids = set(new_items.keys()) if new_items else set()

    added_ids = new_ids - old_ids
    removed_ids = old_ids - new_ids
    common_ids = old_ids & new_ids

    added = []
    removed = []
    modified = []
    unchanged = []

    # 处理新增项目
    for item_id in sorted(added_ids):
        item = new_items[item_id]
        added.append({
            "id": item_id,
            "name": item.get("name", item.get("setName", "未知")),
            "data": item,
        })

    # 处理删除项目
    for item_id in sorted(removed_ids):
        item = old_items[item_id]
        removed.append({
            "id": item_id,
            "name": item.get("name", item.get("setName", "未知")),
        })

    # 处理共同项目（检测修改）
    for item_id in sorted(common_ids):
        old_item = old_items[item_id]
        new_item = new_items[item_id]

        # 深度比较（转换为 JSON 字符串）
        if json.dumps(old_item, sort_keys=True) != json.dumps(new_item, sort_keys=True):
            changes = detect_changes(old_item, new_item, item_type)
            modified.append({
                "id": item_id,
                "name": new_item.get("name", new_item.get("setName", "未知")),
                "changes": changes,
                "data": new_item,
            })
        else:
            unchanged.append({
                "id": item_id,
                "name": new_item.get("name", new_item.get("setName", "未知")),
            })

    return {
        "ADDED": added,
        "MODIFIED": modified,
        "REMOVED": removed,
        "UNCHANGED": unchanged,
    }


def detect_changes(
    old_item: dict,
    new_item: dict,
    item_type: str
) -> Dict[str, List[str]]:
    """检测项目的具体变化

    Args:
        old_item: 旧版本项目
        new_item: 新版本项目
        item_type: 项目类型

    Returns:
        变化详情字典
    """
    changes = {
        "fields": [],
        "skills": [],
        "params": [],
        "added_skills": [],
        "removed_skills": [],
    }

    # 检测字段变化
    for key in new_item.keys():
        if key not in old_item:
            changes["fields"].append(f"新增字段: {key}")
        elif old_item[key] != new_item[key]:
            if key == "skills" and item_type == "character":
                # 特殊处理技能变化
                skill_changes, added, removed = compare_skills_detailed(old_item.get("skills", {}), new_item.get("skills", {}))
                if skill_changes:
                    changes["skills"] = skill_changes
                if added:
                    changes["added_skills"] = added
                if removed:
                    changes["removed_skills"] = removed
            else:
                # 描述变化时显示新旧值对比
                if key == "desc":
                    old_desc = old_item[key].get("cn_sim", "")
                    new_desc = new_item[key].get("cn_sim", "")
                    if old_desc and new_desc and old_desc != new_desc:
                        changes["fields"].append(f"描述已修改 (游戏更新)")
                else:
                    changes["fields"].append(f"字段 '{key}' 已修改")

    # 检测参数变化（角色）
    if item_type == "character" and "skills" in new_item:
        param_changes = detect_parameter_changes_detailed(old_item, new_item)
        if param_changes:
            changes["params"] = param_changes

    # 检测属性变化（武器/圣遗物）
    if item_type in ["weapon", "artifact"]:
        for key in ["rankLevel", "qualityType", "weaponType"]:
            if key in old_item and key in new_item and old_item[key] != new_item[key]:
                changes["fields"].append(f"{key}: {old_item[key]} -> {new_item[key]}")

    return changes


def compare_skills_detailed(old_skills: dict, new_skills: dict) -> tuple:
    """详细对比技能数据变化

    Args:
        old_skills: 旧版本技能数据
        new_skills: 新版本技能数据

    Returns:
        (skill_changes, added_skills, removed_skills) 三元组
    """
    changes = {}
    added = []
    removed = []

    for skill_type in ["normal", "skill", "elementalBurst", "other", "proudSkills", "talents"]:
        if skill_type not in old_skills and skill_type in new_skills:
            # 新增的技能类型
            added.append(f"{skill_type} (新增技能类型)")
            continue
        elif skill_type in old_skills and skill_type not in new_skills:
            # 移除的技能类型
            removed.append(f"{skill_type} (移除技能类型)")
            continue
        elif skill_type not in old_skills or skill_type not in new_skills:
            continue

        old_list = old_skills[skill_type]
        new_list = new_skills[skill_type]

        if isinstance(old_list, dict):
            old_list = [old_list] if old_list else []
        if isinstance(new_list, dict):
            new_list = [new_list] if new_list else []

        # 检测技能数量变化
        if len(new_list) != len(old_list):
            changes[skill_type] = [f"技能数量变化: {len(old_list)} -> {len(new_list)}"]

        # 检测每个技能的参数变化
        type_changes = []
        for old_skill, new_skill in zip(old_list, new_list):
            if not old_skill or not new_skill:
                continue
            old_id = old_skill.get("id", "")
            new_id = new_skill.get("id", "")
            old_name_obj = old_skill.get("name", {})
            new_name_obj = new_skill.get("name", {})
            old_name = old_name_obj.get("cn_sim", "") if old_name_obj else ""
            new_name = new_name_obj.get("cn_sim", "") if new_name_obj else ""

            # 检查参数变化
            old_params = old_skill.get("paramMap", {})
            new_params = new_skill.get("paramMap", {})

            # 检查等级1的前3个参数
            for level in ["01", "02", "03"]:
                if level in old_params and level in new_params:
                    old_vals = old_params[level][:3]  # 前3个参数
                    new_vals = new_params[level][:3]
                    if old_vals != new_vals:
                        changes_found = []
                        for j, (o, n) in enumerate(zip(old_vals, new_vals)):
                            if o != n:
                                pct = ((n - o) / o * 100) if o != 0 else 0
                                changes_found.append(f"[{j}]{level}: {o:.4f} -> {n:.4f} ({pct:+.1f}%)")
                        if changes_found:
                            type_changes.append(f"{old_name} 等级{level}参数变化")
                            type_changes.extend(changes_found[:2])  # 只显示前2个变化

            # 检查描述变化
            old_desc_obj = old_skill.get("desc", {})
            new_desc_obj = new_skill.get("desc", {})
            old_desc = old_desc_obj.get("cn_sim", "") if old_desc_obj else ""
            new_desc = new_desc_obj.get("cn_sim", "") if new_desc_obj else ""
            if old_desc != new_desc:
                type_changes.append(f"{old_name} 描述已修改")

        if type_changes:
            changes[skill_type] = type_changes

    return changes, added, removed


def detect_parameter_changes_detailed(old_char: dict, new_char: dict) -> List[str]:
    """检测角色参数变化（详细版）

    Args:
        old_char: 旧版本角色数据
        new_char: 新版本角色数据

    Returns:
        参数变化描述列表
    """
    param_changes = []
    old_skills = old_char.get("skills", {})
    new_skills = new_char.get("skills", {})

    for skill_type in ["normal", "skill", "elementalBurst"]:
        if skill_type in old_skills and skill_type in new_skills:
            old_skill_list = old_skills[skill_type]
            new_skill_list = new_skills[skill_type]

            if isinstance(old_skill_list, list) and isinstance(new_skill_list, list):
                for old_skill, new_skill in zip(old_skill_list, new_skill_list):
                    old_params = old_skill.get("paramMap", {})
                    new_params = new_skill.get("paramMap", {})
                    skill_name = new_skill.get("name", {}).get("cn_sim", "")

                    # 检查等级1的前3个参数
                    for level in ["01", "02", "03"]:
                        if level in old_params and level in new_params:
                            old_vals = old_params[level][:3]
                            new_vals = new_params[level][:3]

                            for j, (o, n) in enumerate(zip(old_vals, new_vals)):
                                if o != n:
                                    change_pct = ((n - o) / o * 100) if o != 0 else 0
                                    param_changes.append(
                                        f"{skill_name} {skill_type} [{j}]{level}: "
                                        f"{o:.4f} -> {n:.4f} ({change_pct:+.1f}%)"
                                    )

    return param_changes


def compare_skills(old_skills: dict, new_skills: dict) -> Dict[str, List[str]]:
    """对比技能数据变化

    Args:
        old_skills: 旧版本技能数据
        new_skills: 新版本技能数据

    Returns:
        技能变化字典
    """
    changes = {}

    for skill_type in ["normal", "skill", "elementalBurst", "proudSkills", "talents"]:
        if skill_type in new_skills:
            old_list = old_skills.get(skill_type, [])
            new_list = new_skills[skill_type]

            if isinstance(old_list, dict):
                old_list = [old_list] if old_list else []
            if isinstance(new_list, dict):
                new_list = [new_list] if new_list else []

            type_changes = []
            for i, (old_skill, new_skill) in enumerate(zip(old_list, new_list)):
                if old_skill and new_skill:
                    # 比较参数
                    old_params = old_skill.get("paramMap", {})
                    new_params = new_skill.get("paramMap", {})

                    for level in new_params.keys():
                        if level in old_params:
                            old_vals = old_params[level]
                            new_vals = new_params[level]

                            if old_vals != new_vals:
                                type_changes.append(f"{skill_type}[{i}] level {level} 参数变化")

            if type_changes:
                changes[skill_type] = type_changes

    return changes


def detect_parameter_changes(old_char: dict, new_char: dict) -> List[str]:
    """检测角色参数变化

    Args:
        old_char: 旧版本角色数据
        new_char: 新版本角色数据

    Returns:
        参数变化描述列表
    """
    param_changes = []
    old_skills = old_char.get("skills", {})
    new_skills = new_char.get("skills", {})

    for skill_type in ["normal", "skill", "elementalBurst"]:
        if skill_type in old_skills and skill_type in new_skills:
            old_skill_list = old_skills[skill_type]
            new_skill_list = new_skills[skill_type]

            if isinstance(old_skill_list, list) and isinstance(new_skill_list, list):
                for old_skill, new_skill in zip(old_skill_list, new_skill_list):
                    old_params = old_skill.get("paramMap", {})
                    new_params = new_skill.get("paramMap", {})

                    for level in new_params.keys():
                        if level in old_params and old_params[level] != new_params[level]:
                            old_vals = old_params[level]
                            new_vals = new_params[level]

                            # 找出变化的具体参数
                            for i, (o, n) in enumerate(zip(old_vals, new_vals)):
                                if o != n:
                                    change_pct = ((n - o) / o * 100) if o != 0 else 0
                                    param_changes.append(
                                        f"{skill_type} param[{i}] level {level}: "
                                        f"{o} -> {n} ({change_pct:+.1f}%)"
                                    )

    return param_changes


def check_unimplemented(source_version: str) -> Dict[str, List[Dict]]:
    """检查未实现的项目（合并自原 check_unimplemented.py）

    Args:
        source_version: 源数据版本标识符

    Returns:
        未实现项目字典
    """
    print(f"检查未实现的项目 (版本: {source_version})...")

    # 加载源数据
    source_data = load_processed_data(source_version)
    if source_data is None:
        return {}

    # 加载 data.json
    data_json = load_data_json()
    if data_json is None:
        print("警告: 未找到 data.json，返回所有源数据项目")
        return {
            "characters": [{"id": k, "name": v.get("name", "未知")}
                         for k, v in source_data.get("characters", {}).items()],
            "weapons": [{"id": k, "name": v.get("name", "未知")}
                       for k, v in source_data.get("weapons", {}).items()],
            "artifacts": [{"id": k, "name": v.get("setName", "未知")}
                         for k, v in source_data.get("artifacts", {}).items()],
        }

    # 比对
    result = {}

    # 角色
    source_chars = source_data.get("characters", {})
    implemented_chars = data_json.get("characters", {})
    unimplemented_chars = set(source_chars.keys()) - set(implemented_chars.keys())

    result["characters"] = []
    for char_id in sorted(unimplemented_chars):
        char_data = source_chars[char_id]
        result["characters"].append({
            "id": char_id,
            "name": char_data.get("name", "未知"),
            "weaponType": char_data.get("weaponType", "未知"),
            "qualityType": char_data.get("qualityType", "未知"),
        })

    # 武器
    source_weapons = source_data.get("weapons", {})
    implemented_weapons = data_json.get("weapons", {})
    unimplemented_weapons = set(source_weapons.keys()) - set(implemented_weapons.keys())

    result["weapons"] = []
    for weapon_id in sorted(unimplemented_weapons):
        weapon_data = source_weapons[weapon_id]
        result["weapons"].append({
            "id": weapon_id,
            "name": weapon_data.get("name", "未知"),
            "weaponType": weapon_data.get("weaponType", "未知"),
            "rankLevel": weapon_data.get("rankLevel", "未知"),
        })

    # 圣遗物
    source_artifacts = source_data.get("artifacts", {})
    implemented_artifacts = data_json.get("artifact", {})  # 注意: data.json 中键名是 "artifact" (单数)
    unimplemented_artifacts = set(source_artifacts.keys()) - set(implemented_artifacts.keys())

    result["artifacts"] = []
    for set_id in sorted(unimplemented_artifacts):
        artifact_data = source_artifacts[set_id]
        result["artifacts"].append({
            "id": set_id,
            "name": artifact_data.get("setName", "未知"),
        })

    return result


def compare_versions(
    from_version: str,
    to_version: str,
    focus: Optional[List[str]] = None,
) -> dict:
    """对比两个版本

    Args:
        from_version: 起始版本标识符
        to_version: 目标版本标识符
        focus: 限制关注的数据类型 (characters/weapons/artifacts)

    Returns:
        差分结果字典
    """
    print(f"对比版本: {from_version} -> {to_version}")

    if focus is None:
        focus = ["characters", "weapons", "artifacts"]

    # 加载数据
    from_data = load_processed_data(from_version)
    if from_data is None:
        return {}

    to_data = load_processed_data(to_version)
    if to_data is None:
        return {}

    # 执行比对
    result = {
        "fromVersion": from_version,
        "toVersion": to_version,
        "timestamp": datetime.now().isoformat() + "Z",
    }

    if "characters" in focus:
        result["characters"] = compare_items(
            from_data.get("characters", {}),
            to_data.get("characters", {}),
            "character",
        )

    if "weapons" in focus:
        result["weapons"] = compare_items(
            from_data.get("weapons", {}),
            to_data.get("weapons", {}),
            "weapon",
        )

    if "artifacts" in focus:
        result["artifacts"] = compare_items(
            from_data.get("artifacts", {}),
            to_data.get("artifacts", {}),
            "artifact",
        )

    return result


def format_diff_markdown(diff: dict, include_unimplemented: bool = False) -> str:
    """格式化差分为 Markdown

    Args:
        diff: 差分字典
        include_unimplemented: 是否包含未实现检查

    Returns:
        Markdown 格式的差分报告
    """
    from_version = diff.get("fromVersion", "unknown")
    to_version = diff.get("toVersion", "unknown")
    timestamp = diff.get("timestamp", "")

    lines = []
    lines.append(f"# 版本差分: {from_version} → {to_version}")
    lines.append(f"# 时间: {timestamp}")
    lines.append("")

    # 生成概要表格
    lines.append("## 概要")
    lines.append("")

    table_header = "| 类别 | 新增 | 修改 | 删除 |"
    table_divider = "|-----|-----|-----|-----|"

    lines.append(table_header)
    lines.append(table_divider)

    # 角色统计
    if "characters" in diff:
        chars = diff["characters"]
        lines.append(f"| 角色 | {len(chars.get('ADDED', []))} | {len(chars.get('MODIFIED', []))} | {len(chars.get('REMOVED', []))} |")

    # 武器统计
    if "weapons" in diff:
        weapons = diff["weapons"]
        lines.append(f"| 武器 | {len(weapons.get('ADDED', []))} | {len(weapons.get('MODIFIED', []))} | {len(weapons.get('REMOVED', []))} |")

    # 圣遗物统计
    if "artifacts" in diff:
        artifacts = diff["artifacts"]
        lines.append(f"| 圣遗物 | {len(artifacts.get('ADDED', []))} | {len(artifacts.get('MODIFIED', []))} | {len(artifacts.get('REMOVED', []))} |")

    lines.append("")

    # 生成优先级建议
    lines.append("## 优先级建议")
    lines.append("")

    # 高优先级：新增 5 星角色/武器
    lines.append("### 🔴 高优先级（新增项目）")
    high_priority_items = []

    for item_type, type_key, name_key in [
        ("characters", "characters", "name"),
        ("weapons", "weapons", "name"),
    ]:
        if type_key in diff:
            for item in diff[type_key].get("ADDED", []):
                quality = item.get("data", {}).get("qualityType", "")
                rank = item.get("data", {}).get("rankLevel", "")
                if quality == "QUALITY_ORANGE" or rank == 5:
                    name = item.get("name", {}).get("cn_sim", "未知")
                    high_priority_items.append(f"- [{item['id']}] {name} (新增 5 星{item_type[:-1]})")

    if high_priority_items:
        lines.extend(high_priority_items)
    else:
        lines.append("无高优先级项目")
    lines.append("")

    # 中优先级：修改的项目
    lines.append("### 🟡 中优先级（修改项目）")
    medium_priority_count = 0

    for item_type, type_key in [
        ("角色", "characters"),
        ("武器", "weapons"),
        ("圣遗物", "artifacts"),
    ]:
        if type_key in diff:
            modified = diff[type_key].get("MODIFIED", [])
            if modified:
                medium_priority_count += len(modified)

    if medium_priority_count > 0:
        lines.append(f"共 {medium_priority_count} 个项目需要更新配置")
    else:
        lines.append("无需要更新的项目")
    lines.append("")

    # 低优先级
    lines.append("### 🟢 低优先级")
    lines.append("数据微调或低优先级项目")
    lines.append("")

    # 详细列表
    for item_type in ["characters", "weapons", "artifacts"]:
        if item_type not in diff:
            continue

        type_display = {"characters": "角色", "weapons": "武器", "artifacts": "圣遗物"}
        data = diff[item_type]

        # 新增
        if data.get("ADDED"):
            lines.append(f"## 新增{type_display[item_type]}（需要配置）")
            lines.append("")
            for item in data["ADDED"]:
                item_id = item["id"]
                name = item["name"]
                if isinstance(name, dict):
                    name = name.get("cn_sim", name.get("en", "未知"))
                lines.append(f"### [{item_id}] {name}")
                lines.append("")
                lines.append("**基本信息**：")
                lines.append(f"- **ID**: {item_id}")
                if item_type == "characters":
                    weapon = item.get("data", {}).get("weaponType", "未知")
                    quality = item.get("data", {}).get("qualityType", "未知")
                    lines.append(f"- **武器**: {weapon}")
                    lines.append(f"- **品质**: {quality}")
                elif item_type == "weapons":
                    w_type = item.get("data", {}).get("weaponType", "未知")
                    rank = item.get("data", {}).get("rankLevel", "未知")
                    lines.append(f"- **类型**: {w_type}")
                    lines.append(f"- **稀有度**: {rank}")
                lines.append("")
                lines.append("**操作**：")
                lines.append("生成完整的 data.json 配置")
                lines.append("")

        # 修改
        if data.get("MODIFIED"):
            lines.append(f"## 修改{type_display[item_type]}（需要更新）")
            lines.append("")
            for item in data["MODIFIED"]:
                item_id = item["id"]
                name = item["name"]
                if isinstance(name, dict):
                    name = name.get("cn_sim", name.get("en", "未知"))
                lines.append(f"### [{item_id}] {name}")
                lines.append("")

                changes = item.get("changes", {})
                has_changes = False

                # 技能变化
                if changes.get("skills"):
                    lines.append("**技能变化**：")
                    for skill_type, skill_changes in changes["skills"].items():
                        lines.append(f"- **{skill_type}**:")
                        for change in skill_changes[:5]:  # 限制显示数量
                            lines.append(f"  - {change}")
                        if len(skill_changes) > 5:
                            lines.append(f"  - ... 还有 {len(skill_changes) - 5} 个变化")
                    lines.append("")

                # 新增技能
                if changes.get("added_skills"):
                    lines.append("**新增技能**：")
                    for added in changes["added_skills"]:
                        lines.append(f"- {added}")
                    lines.append("")

                # 移除技能
                if changes.get("removed_skills"):
                    lines.append("**移除技能**：")
                    for removed in changes["removed_skills"]:
                        lines.append(f"- {removed}")
                    lines.append("")

                # 参数变化
                if changes.get("params"):
                    lines.append("**参数变化**（等级 1 前5个参数）:")
                    for param_desc in changes["params"][:5]:  # 限制显示数量
                        lines.append(f"- {param_desc}")
                    if len(changes["params"]) > 5:
                        lines.append(f"- ... 还有 {len(changes['params']) - 5} 个参数变化")
                    lines.append("")

                # 字段变化
                if changes.get("fields"):
                    lines.append("**其他变化**：")
                    for field_change in changes["fields"]:
                        lines.append(f"- {field_change}")
                    if not any([changes.get(k) for k in ["skills", "params", "added_skills", "removed_skills"]]):
                        has_changes = True
                    lines.append("")

                if not has_changes:
                    lines.append("**变化类型**: 数据结构变化（需要检查详情）")
                    lines.append("")

                lines.append("**操作**：")
                lines.append(f"在 data.json 中更新 {name} 的相关配置")
                lines.append("")

        # 删除
        if data.get("REMOVED"):
            lines.append(f"## 删除{type_display[item_type]}（已弃用）")
            lines.append("")
            for item in data["REMOVED"]:
                item_id = item["id"]
                name = item["name"]
                if isinstance(name, dict):
                    name = name.get("cn_sim", name.get("en", "未知"))
                lines.append(f"- [{item_id}] {name}")
            lines.append("")
            lines.append("**注意**：这些项目已从源数据中移除，请考虑是否需要更新或删除相关配置")
            lines.append("")

    # 未实现检查
    if include_unimplemented and "unimplemented" in diff:
        unimplemented = diff["unimplemented"]

        lines.append("## 未实现项目")
        lines.append("")

        for item_type, type_key, name_key in [
            ("角色", "characters", "name"),
            ("武器", "weapons", "name"),
            ("圣遗物", "artifacts", "setName"),
        ]:
            items = unimplemented.get(type_key, [])
            if items:
                lines.append(f"### 未实现{item_type}（{len(items)} 个）")
                lines.append("")
                lines.append("| ID | 名称 | 其他信息 |")
                lines.append("|----|------|----------|")

                for item in items[:20]:  # 限制显示数量
                    item_id = item["id"]
                    name = item["name"]
                    if isinstance(name, dict):
                        name = name.get("cn_sim", name.get("en", "未知"))

                    info = ""
                    if item_type == "角色":
                        info = f"武器: {item.get('weaponType', 'N/A')}"
                    elif item_type == "武器":
                        info = f"类型: {item.get('weaponType', 'N/A')}"

                    lines.append(f"| {item_id} | {name} | {info} |")

                if len(items) > 20:
                    lines.append(f"| ... | ... | 还有 {len(items) - 20} 个未实现项目 |")

                lines.append("")

        lines.append(f"**共计**：")
        lines.append(f"- 角色: {len(unimplemented.get('characters', []))} 个")
        lines.append(f"- 武器: {len(unimplemented.get('weapons', []))} 个")
        lines.append(f"- 圣遗物: {len(unimplemented.get('artifacts', []))} 个")
        lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="分析版本差分",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 比较两个版本
  python diff_analyzer.py --from abc1234 --to def5678

  # 比较最新版本与前一版本
  python diff_analyzer.py --from HEAD~1 --to latest

  # 只关注角色
  python diff_analyzer.py --from abc1234 --to def5678 --focus characters

  # 检查未实现项目
  python diff_analyzer.py --from latest --check-unimplemented

  # 输出到文件
  python diff_analyzer.py --from abc1234 --to def5678 --output diff_report.md
        """
    )

    parser.add_argument(
        "--from",
        dest="from_version",
        type=str,
        help="起始版本标识符",
    )
    parser.add_argument(
        "--to",
        dest="to_version",
        type=str,
        help="目标版本标识符",
    )
    parser.add_argument(
        "--focus",
        type=str,
        nargs="+",
        choices=["characters", "weapons", "artifacts"],
        help="限制关注的数据类型",
    )
    parser.add_argument(
        "--check-unimplemented",
        action="store_true",
        help="检查未实现的项目（对比 data.json）",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=str,
        help="输出文件路径（不指定则打印到控制台）",
    )
    parser.add_argument(
        "--format",
        type=str,
        choices=["markdown", "json"],
        default="markdown",
        help="输出格式（默认: markdown）",
    )

    args = parser.parse_args()

    # 检查参数
    if args.check_unimplemented:
        # 单独运行未实现检查
        version = args.from_version or "latest"
        unimplemented = check_unimplemented(version)

        output = {
            "version": version,
            "timestamp": datetime.now().isoformat() + "Z",
            "unimplemented": unimplemented,
        }

        if args.format == "json":
            content = json.dumps(output, ensure_ascii=False, indent=2)
        else:
            # 为未实现检查生成简单报告
            diff = {"unimplemented": unimplemented}
            content = format_diff_markdown(diff, include_unimplemented=True)

    else:
        # 版本比较模式
        if not args.from_version or not args.to_version:
            parser.print_help()
            print("\n错误: 版本比较模式需要 --from 和 --to 参数")
            sys.exit(1)

        # 执行比较
        diff = compare_versions(args.from_version, args.to_version, args.focus)

        # 格式化输出
        if args.format == "json":
            content = json.dumps(diff, ensure_ascii=False, indent=2)
        else:
            content = format_diff_markdown(diff, include_unimplemented=False)

    # 输出（确保在项目内部）
    if args.output:
        output_path = Path(args.output)
        # 确保输出路径在项目内部
        if output_path.is_absolute():
            try:
                output_path.relative_to(PROJECT_ROOT)
                # 在项目内部，使用原路径
                pass
            except ValueError:
                # 在项目外部，重定向到 diffs 目录
                print(f"警告: 输出路径在项目外部，已重定向到项目内部目录")
                output_path = DEFAULT_OUTPUT_DIR / output_path.name
        else:
            # 相对路径，放到 diffs 目录
            output_path = DEFAULT_OUTPUT_DIR / output_path
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"差分报告已保存到: {output_path}")
    else:
        print("\n" + content)


if __name__ == "__main__":
    main()
