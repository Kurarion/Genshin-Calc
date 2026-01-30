#!/usr/bin/env python3
"""
分析 data.json 中的配置模式，导出源数据进行对照分析
"""

import json
import argparse
from pathlib import Path

# 设置路径（从脚本位置查找项目根目录）
script_dir = Path(__file__).resolve().parent
project_root = script_dir
while not (project_root / "src").exists() and project_root.parent != project_root:
    project_root = project_root.parent

DATA_FILE = project_root / "src/assets/init/data.json"
PROCESSED_FILE = (
    project_root / ".claude/skills/genshin-data-generator/output/processed_data.json"
)
OUTPUT_DIR = project_root / ".claude/skills/genshin-data-generator/output/analysis"


def load_data():
    """加载数据"""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_processed_data():
    """加载预处理后的数据"""
    try:
        with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"警告: 未找到预处理数据文件 {PROCESSED_FILE}")
        return None


def analyze_damage_configs(data):
    """分析所有 damage 配置"""
    damage_examples = {
        "basic": [],  # 基础配置（只有 indexes）
        "origin": [],  # 带参考技能的配置
        "attach": [],  # 带额外倍率的配置
        "display_queue": [],  # 带显示控制队列
        "final_queue": [],  # 带最终计算队列
        "tag": [],  # 带特殊标签
        "special": [],  # 特殊伤害类型
        "custom": [],  # 自定义倍率
    }

    for chara_id, chara_data in data.get("characters", {}).items():
        chara_name = chara_data.get("name", {}).get("cn_sim", chara_id)
        skills = chara_data.get("skills", {})

        for skill_type, skill_configs in skills.items():
            for skill_config in skill_configs:
                if "damage" in skill_config:
                    damage = skill_config["damage"]

                    # 分类
                    if "customValues" in damage:
                        damage_examples["custom"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })
                    elif "specialDamageType" in damage:
                        damage_examples["special"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })
                    elif "tag" in damage:
                        damage_examples["tag"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })
                    elif "originSkills" in damage:
                        damage_examples["origin"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })
                    elif "indexesAttach" in damage:
                        damage_examples["attach"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })
                    elif "displayCalQueue" in damage:
                        damage_examples["display_queue"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })
                    elif "finalResCalQueue" in damage:
                        damage_examples["final_queue"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })
                    elif "indexes" in damage and len(damage) == 5:  # 基础配置
                        damage_examples["basic"].append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "damage": damage
                        })

    return damage_examples


def analyze_buff_configs(data):
    """分析所有 buff 配置"""
    buff_examples = []

    for chara_id, chara_data in data.get("characters", {}).items():
        chara_name = chara_data.get("name", {}).get("cn_sim", chara_id)
        skills = chara_data.get("skills", {})

        for skill_type, skill_configs in skills.items():
            for skill_config in skill_configs:
                if "buffs" in skill_config:
                    for buff in skill_config["buffs"]:
                        buff_examples.append({
                            "chara_id": chara_id,
                            "chara_name": chara_name,
                            "skill_type": skill_type,
                            "buff": buff
                        })

    return buff_examples


def analyze_healing_configs(data):
    """分析所有治疗配置"""
    healing_examples = []

    for chara_id, chara_data in data.get("characters", {}).items():
        chara_name = chara_data.get("name", {}).get("cn_sim", chara_id)
        skills = chara_data.get("skills", {})

        for skill_type, skill_configs in skills.items():
            for skill_config in skill_configs:
                if "healing" in skill_config:
                    healing_examples.append({
                        "chara_id": chara_id,
                        "chara_name": chara_name,
                        "skill_type": skill_type,
                        "healing": skill_config["healing"]
                    })

    return healing_examples


def analyze_shield_configs(data):
    """分析所有护盾配置"""
    shield_examples = []

    for chara_id, chara_data in data.get("characters", {}).items():
        chara_name = chara_data.get("name", {}).get("cn_sim", chara_id)
        skills = chara_data.get("skills", {})

        for skill_type, skill_configs in skills.items():
            for skill_config in skill_configs:
                if "shield" in skill_config:
                    shield_examples.append({
                        "chara_id": chara_id,
                        "chara_name": chara_name,
                        "skill_type": skill_type,
                        "shield": skill_config["shield"]
                    })

    return shield_examples


def analyze_summon_hp_configs(data):
    """分析所有生成物HP配置"""
    summon_examples = []

    for chara_id, chara_data in data.get("characters", {}).items():
        chara_name = chara_data.get("name", {}).get("cn_sim", chara_id)
        skills = chara_data.get("skills", {})

        for skill_type, skill_configs in skills.items():
            for skill_config in skill_configs:
                if "summon" in skill_config:
                    summon_examples.append({
                        "chara_id": chara_id,
                        "chara_name": chara_name,
                        "skill_type": skill_type,
                        "summon": skill_config["summon"]
                    })

    return summon_examples


def export_analysis_report(data, processed_data):
    """导出分析报告"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("分析 damage 配置...")
    damage_examples = analyze_damage_configs(data)

    print("分析 buff 配置...")
    buff_examples = analyze_buff_configs(data)

    print("分析 healing 配置...")
    healing_examples = analyze_healing_configs(data)

    print("分析 shield 配置...")
    shield_examples = analyze_shield_configs(data)

    print("分析 summon 配置...")
    summon_examples = analyze_summon_hp_configs(data)

    # 生成报告
    report = {
        "damage": {
            "basic": {
                "count": len(damage_examples["basic"]),
                "examples": damage_examples["basic"][:5]
            },
            "origin": {
                "count": len(damage_examples["origin"]),
                "examples": damage_examples["origin"][:5]
            },
            "attach": {
                "count": len(damage_examples["attach"]),
                "examples": damage_examples["attach"][:5]
            },
            "display_queue": {
                "count": len(damage_examples["display_queue"]),
                "examples": damage_examples["display_queue"][:5]
            },
            "final_queue": {
                "count": len(damage_examples["final_queue"]),
                "examples": damage_examples["final_queue"][:5]
            },
            "tag": {
                "count": len(damage_examples["tag"]),
                "examples": damage_examples["tag"][:5]
            },
            "special": {
                "count": len(damage_examples["special"]),
                "examples": damage_examples["special"][:5]
            },
            "custom": {
                "count": len(damage_examples["custom"]),
                "examples": damage_examples["custom"][:5]
            }
        },
        "buff": {
            "count": len(buff_examples),
            "examples": buff_examples[:10]
        },
        "healing": {
            "count": len(healing_examples),
            "examples": healing_examples[:10]
        },
        "shield": {
            "count": len(shield_examples),
            "examples": shield_examples[:10]
        },
        "summon": {
            "count": len(summon_examples),
            "examples": summon_examples[:10]
        }
    }

    report_file = OUTPUT_DIR / "config_analysis_report.json"
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n分析报告已生成: {report_file}")

    # 打印摘要
    print("\n=== 配置统计摘要 ===")
    print(f"\nDamage 配置:")
    for key, value in report["damage"].items():
        print(f"  {key}: {value['count']} 个")
    print(f"\nBuff 配置: {report['buff']['count']} 个")
    print(f"Healing 配置: {report['healing']['count']} 个")
    print(f"Shield 配置: {report['shield']['count']} 个")
    print(f"Summon 配置: {report['summon']['count']} 个")


def main():
    parser = argparse.ArgumentParser(description="分析配置模式")
    parser.add_argument("--export", action="store_true", help="导出特殊配置的角色ID列表")
    args = parser.parse_args()

    print("加载数据...")
    data = load_data()
    processed_data = load_processed_data()

    if args.export:
        # 导出需要分析的ID列表
        special_ids = set()

        for chara_id, chara_data in data.get("characters", {}).items():
            skills = chara_data.get("skills", {})
            for skill_type, skill_configs in skills.items():
                for skill_config in skill_configs:
                    # 检查是否有特殊配置
                    has_special = False
                    if "damage" in skill_config:
                        damage = skill_config["damage"]
                        if any(k in damage for k in [
                            "originSkills", "indexesAttach", "displayCalQueue",
                            "finalResCalQueue", "tag", "specialDamageType", "customValues"
                        ]):
                            has_special = True
                    if any(k in skill_config for k in ["buffs", "healing", "shield", "summon"]):
                        has_special = True

                    if has_special:
                        special_ids.add(chara_id)
                        break
                if chara_id in special_ids:
                    break

        # 导出ID列表
        id_file = OUTPUT_DIR / "special_config_ids.txt"
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        with open(id_file, "w", encoding="utf-8") as f:
            for chara_id in sorted(special_ids):
                f.write(f"{chara_id}\n")

        print(f"\n特殊配置角色ID列表已导出到: {id_file}")
        print(f"总计 {len(special_ids)} 个角色")
    else:
        export_analysis_report(data, processed_data)


if __name__ == "__main__":
    main()
