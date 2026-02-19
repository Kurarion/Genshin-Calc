#!/usr/bin/env python3
"""
高级配置模式分析工具

功能：
1. 导出每种特殊配置类型的完整示例
2. 将源游戏数据与data.json配置进行对比分析
3. 生成详细的推断规则文档
"""

import json
from pathlib import Path
from typing import Any, Dict, List


def find_project_root() -> Path:
    """查找项目根目录"""
    script_dir = Path(__file__).resolve().parent
    root = script_dir
    while not (root / "src").exists() and root.parent != root:
        root = root.parent
    return root


def load_data() -> tuple[Dict, Dict]:
    """加载预处理数据和配置数据"""
    project_root = find_project_root()
    processed_file = (
        project_root
        / ".claude/skills/genshin-data-generator/output/processed_data.json"
    )
    config_file = project_root / "src/assets/init/data.json"

    print("加载数据...")
    with open(processed_file, "r", encoding="utf-8") as f:
        processed_data = json.load(f)
    with open(config_file, "r", encoding="utf-8") as f:
        config_data = json.load(f)

    return processed_data, config_data


def get_character_name(processed_data: Dict, chara_id: str) -> Dict[str, str]:
    """获取角色多语言名称"""
    avatar = processed_data.get("avatar_map", {}).get(chara_id, {})
    name_info = avatar.get("info", {}).get("name", {})
    if isinstance(name_info, dict):
        return name_info
    return {"cn_sim": chara_id, "en": chara_id}


def analyze_config_type(
    processed_data: Dict,
    config_data: Dict,
    config_type: str,
    subfield: str = None,
) -> List[Dict]:
    """
    分析特定类型的配置

    Args:
        processed_data: 预处理数据
        config_data: data.json配置
        config_type: 配置类型 (damage, buffs, healing, shield)
        subfield: 子字段 (如 damage 下的 origin, attach 等)
    """
    results = []
    characters = config_data.get("characters", {})
    avatar_map = processed_data.get("avatar_map", {})

    # buff在data.json中是buffs（复数）
    config_key = "buffs" if config_type == "buff" else config_type

    for chara_id, chara_config in characters.items():
        chara_name = get_character_name(processed_data, chara_id)
        source_data = avatar_map.get(chara_id, {})
        skills_config = chara_config.get("skills", {})

        for skill_type, skill_list in skills_config.items():
            if not isinstance(skill_list, list):
                continue

            for skill_idx, skill_entry in enumerate(skill_list):
                if config_key in skill_entry:
                    configs = skill_entry[config_key]

                    # 处理单个配置或配置列表
                    if isinstance(configs, dict):
                        configs = [configs]

                    for config_idx, config in enumerate(configs):
                        # 检查是否匹配子字段类型
                        if subfield:
                            has_subfield = False
                            if subfield == "origin" and "originSkills" in config:
                                has_subfield = True
                            elif subfield == "attach" and "indexesAttachTo" in config:
                                has_subfield = True
                            elif subfield == "display_queue" and "displayCalQueue" in config:
                                has_subfield = True
                            elif subfield == "final_queue" and "finalResCalQueue" in config:
                                has_subfield = True
                            elif subfield == "tag" and "tag" in config:
                                has_subfield = True
                            elif subfield == "special" and "specialDamageType" in config:
                                has_subfield = True
                            elif subfield == "custom" and "customValues" in config:
                                has_subfield = True

                            if not has_subfield:
                                continue

                        results.append(
                            {
                                "chara_id": chara_id,
                                "chara_name": chara_name,
                                "skill_type": skill_type,
                                "skill_index": skill_idx,
                                "config_index": config_idx,
                                "config": config,
                                "source_skill": source_data.get(skill_type, {}),
                            }
                        )

    return results


def export_pattern_analysis(pattern_name: str, results: List[Dict], output_dir: Path):
    """导出模式分析结果"""
    # 导出详细分析
    analysis_file = output_dir / f"pattern_{pattern_name}_analysis.json"
    with open(analysis_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"  {pattern_name}: {len(results)} 个示例 -> {analysis_file.name}")


def generate_inference_guide(output_dir: Path):
    """生成推断指南文档"""
    guide_lines = []
    guide_lines.append("# 高级配置推断指南\n")
    guide_lines.append("本文档基于源游戏数据与data.json配置的对比分析，总结各种配置模式的推断规则。\n")

    patterns = [
        "origin",
        "attach",
        "display_queue",
        "final_queue",
        "tag",
        "special",
        "custom",
    ]

    for pattern in patterns:
        analysis_file = output_dir / f"pattern_{pattern}_analysis.json"
        if not analysis_file.exists():
            continue

        with open(analysis_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        if not data:
            continue

        guide_lines.append(f"## {pattern.upper()} 配置模式\n")
        guide_lines.append(f"**数量**: {len(data)} 个示例\n\n")

        # 提取配置特征
        if pattern == "origin":
            guide_lines.append("### 特征\n")
            guide_lines.append("- 使用 `originSkills` 引用其他技能的参数\n")
            guide_lines.append("- 使用 `originIndexes` 指定引用的参数索引\n")
            guide_lines.append("- 使用 `originRelations` 指定运算关系（通常是乘法 `*`）\n")
            guide_lines.append("- 通常与 `displayCalQueue` 配合使用添加额外倍率\n\n")

        elif pattern == "attach":
            guide_lines.append("### 特征\n")
            guide_lines.append("- 使用 `indexesAttachTo` 将伤害附加到其他技能\n")
            guide_lines.append("- 被附加的伤害会在触发目标技能时一并造成\n\n")

        elif pattern == "display_queue":
            guide_lines.append("### 特征\n")
            guide_lines.append("- 使用 `displayCalQueue` 控制伤害显示的计算队列\n")
            guide_lines.append("- 支持嵌套计算（`inner` 字段）\n")
            guide_lines.append("- 运算符：`+`（加法）、`*`（乘法）\n")
            guide_lines.append("- 变量类型：`VAR_CHARA_X`（角色变量）、`value`（固定值）\n\n")

        elif pattern == "final_queue":
            guide_lines.append("### 特征\n")
            guide_lines.append("- 使用 `finalResCalQueue` 控制最终结果计算的队列\n")
            guide_lines.append("- 与 `displayCalQueue` 类似但应用于最终结果\n")
            guide_lines.append("- 用于实现复杂的伤害修正逻辑\n\n")

        elif pattern == "tag":
            guide_lines.append("### 特征\n")
            guide_lines.append("- 使用 `tag` 字段标记特殊伤害类型\n")
            guide_lines.append("- 常见标签：\n")
            guide_lines.append('  - `"SHARE_DEFLAG_MAIN"`: 共享元素附着\n')
            guide_lines.append('  - `"NO_BREAK"`: 不破盾\n')
            guide_lines.append('  - `"BREAK_EFFECT_IF_HAVE"`: 破盾效果加成\n\n')

        elif pattern == "special":
            guide_lines.append("### 特征\n")
            guide_lines.append("- 使用 `specialDamageType` 指定特殊伤害类型\n")
            guide_lines.append("- 常见类型：\n")
            guide_lines.append('  - `"SPECIAL_DAMAGE_NONE"`: 普通伤害\n')
            guide_lines.append('  - `"SPECIAL_DAMAGE_DO_NOT_HIT"`: 不造成命中\n\n')

        elif pattern == "custom":
            guide_lines.append("### 特征\n")
            guide_lines.append("- 使用 `customValues` 定义自定义倍率值\n")
            guide_lines.append("- 不依赖参数列表，直接使用固定值\n")
            guide_lines.append('- 值的格式为 `["值1", "值2", ...]` 对应不同等级\n\n')

        # 添加示例
        if len(data) > 0:
            guide_lines.append("### 示例\n")
            example = data[0]
            guide_lines.append(f"**角色**: {example['chara_name'].get('cn_sim', example['chara_id'])}\n")
            guide_lines.append(f"**技能**: {example['skill_type']}\n\n")
            guide_lines.append("```json\n")
            guide_lines.append(json.dumps(example["config"], ensure_ascii=False, indent=2))
            guide_lines.append("\n```\n\n")

    return guide_lines


def main():
    """主函数"""
    processed_data, config_data = load_data()
    output_dir = find_project_root() / ".claude/skills/genshin-data-generator/output/patterns"
    output_dir.mkdir(parents=True, exist_ok=True)

    print("分析配置模式...\n")

    # 分析各种damage子类型
    for pattern in ["origin", "attach", "display_queue", "final_queue", "tag", "special", "custom"]:
        results = analyze_config_type(
            processed_data, config_data, "damage", subfield=pattern
        )
        export_pattern_analysis(pattern, results, output_dir)

    # 分析其他配置类型
    for config_type in ["buff", "healing", "shield"]:
        results = analyze_config_type(processed_data, config_data, config_type)
        export_pattern_analysis(config_type, results, output_dir)

    # 生成推断指南
    print("\n生成推断指南...")
    guide_lines = generate_inference_guide(output_dir)

    guide_file = output_dir / "advanced_inference_guide.md"
    with open(guide_file, "w", encoding="utf-8") as f:
        f.writelines(line + "\n" for line in guide_lines)

    print(f"\n推断指南已生成: {guide_file}")
    print("\n分析完成！")


if __name__ == "__main__":
    main()
