#!/usr/bin/env python3
"""
原神配置生成脚本
根据解包数据和接口/常量定义生成data.json配置
"""

import json
import argparse
import re
from pathlib import Path
import sys

# 添加项目路径
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

# 设置路径
GENSHIN_DIR = project_root / "src/assets/genshin"
PROCESSED_FILE = (
    project_root / ".claude/skills/genshin-data-generator/output/processed_data.json"
)
OUTPUT_FILE = project_root / "src/assets/init/data.json"
INTERFACE_FILE = project_root / "src/app/shared/interface/interface.ts"
CONST_FILE = project_root / "src/app/shared/const/const.ts"

# 元素映射（基于const.ts）
ELEMENT_MAP = {
    "Fire": "PYRO",
    "Water": "HYDRO",
    "Wind": "ANEMO",
    "Electric": "ELECTRO",
    "Ice": "CRYO",
    "Rock": "GEO",
    "Grass": "DENDRO",
    "Physical": "PHYSICAL",
}

# 技能类型映射
SKILL_TYPE_MAP = {
    "normal": "DMG_BONUS_NORMAL",
    "charged": "DMG_BONUS_CHARGED",
    "plunging": "DMG_BONUS_PLUNGING",
    "skill": "DMG_BONUS_SKILL",
    "elementalBurst": "DMG_BONUS_ELEMENTAL_BURST",
}

# 武器类型映射
WEAPON_TYPE_MAP = {
    "WEAPON_SWORD_ONE_HAND": "WEAPON_SWORD",
    "WEAPON_CLAYMORE": "WEAPON_CLAYMORE",
    "WEAPON_POLE": "WEAPON_POLE",
    "WEAPON_BOW": "WEAPON_BOW",
    "WEAPON_CATALYST": "WEAPON_CATALYST",
}


# 加载处理后的数据
def load_processed_data():
    """加载预处理后的数据"""
    try:
        with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"错误: 未找到预处理数据文件 {PROCESSED_FILE}")
        print("请先运行 preprocess.py")
        sys.exit(1)


# 解析paramDescList判断indexes和base
def parse_param_desc_list(param_desc_list):
    """从paramDescList中提取indexes和base属性"""
    indexes = []
    base = "ATTACK"  # 默认为攻击力

    for i, desc in enumerate(param_desc_list):
        # 检查是否包含{paramX:F1P}或{paramX}
        param_match = re.search(r"\{param(\d+)(?::F1P)?\}", desc)
        if param_match:
            param_index = int(param_match.group(1))
            if param_index not in indexes:
                indexes.append(param_index)

        # 判断base属性
        if "攻击力" in desc:
            base = "ATTACK"
        elif "生命值" in desc:
            base = "HP"
        elif "防御力" in desc:
            base = "DEFENSE"

    return indexes, base


# 解析desc文本判断特殊情况
def parse_desc_special_cases(desc_text, skill_name):
    """从描述文本中提取特殊情况（伤害类型、元素类型等）"""
    special_cases = {
        "attack_bonus_type": None,  # DMG_BONUS_NORMAL/SKILL/OTHER等
        "element_bonus_type": None,  # DMG_BONUS_CRYO/PYRO等
        "can_override": None,  # 是否可以被元素附魔覆盖
        "special_damage_type": None,  # 特殊伤害类型（如月反应）
        "has_healing": "治疗" in desc_text,  # 是否包含治疗
        "has_shield": "护盾" in desc_text,  # 是否包含护盾
        "is_team_buff": False,  # 是否是队伍buff
        "needs_slider": False,  # 是否需要滑块
        "has_conditions": False,  # 是否有条件限制
    }

    desc_lower = desc_text.lower()

    # 判断attackBonusType（攻击类型）- 优先级最高
    if "普通攻击" in desc_text or "相当于普通攻击" in desc_text:
        special_cases["attack_bonus_type"] = "DMG_BONUS_NORMAL"
    elif "元素技能" in desc_text or "相当于元素技能" in desc_text:
        special_cases["attack_bonus_type"] = "DMG_BONUS_SKILL"
    elif "元素爆发" in desc_text or "相当于元素爆发" in desc_text:
        special_cases["attack_bonus_type"] = "DMG_BONUS_ELEMENTAL_BURST"
    elif "重击" in desc_text:
        special_cases["attack_bonus_type"] = "DMG_BONUS_CHARGED"
    elif "下落" in desc_text:
        special_cases["attack_bonus_type"] = "DMG_BONUS_PLUNGING"

    # 判断elementBonusType（元素类型）
    for element_name, element_key in ELEMENT_MAP.items():
        element_text = element_name.lower() if element_name != "Grass" else "草"
        if f"{element_text}元素" in desc_lower or f"{element_text}伤害" in desc_lower:
            special_cases["element_bonus_type"] = f"DMG_BONUS_{element_key}"
            break

    if "物理" in desc_text:
        special_cases["element_bonus_type"] = "DMG_BONUS_PHYSICAL"

    # 判断canOverride
    if "普通" in skill_name.lower() or "普通攻击" in skill_name.lower():
        # 普通攻击默认可以被元素附魔覆盖（除了法器）
        special_cases["can_override"] = True

    # 判断是否是队伍buff
    if "队伍" in desc_text or "全队" in desc_text or "队友" in desc_text:
        special_cases["is_team_buff"] = True

    # 判断是否需要滑块（基于层数）
    if "层" in desc_text and ("每" in desc_text or "最多" in desc_text):
        special_cases["needs_slider"] = True

    # 判断特殊伤害类型（月反应）
    if "月感电" in desc_text or "月绽放" in desc_text:
        special_cases["special_damage_type"] = (
            "moon-electro-charged" if "月感电" in desc_text else "moon-rupture"
        )

    return special_cases


# 生成技能配置
def generate_skill_config(skill_name, skill_data, processed_chara, skill_type="other"):
    """生成单个技能的配置"""
    config = []

    param_list = skill_data.get("paramList", [])
    param_desc_list = skill_data.get("paramDescList", [])
    desc = skill_data.get("desc", "")

    # 根据paramDescList判断indexes和base（核心依据）
    indexes, base = parse_param_desc_list(param_desc_list)

    # 如果paramDescList为空，使用所有参数
    if not indexes:
        indexes = list(range(len(param_list)))

    # 解析desc中的特殊情况
    special_cases = parse_desc_special_cases(desc, skill_name)

    # 确定elementBonusType（元素类型）
    element_bonus = special_cases["element_bonus_type"]
    if not element_bonus:
        # 根据武器类型和技能类型判断默认元素
        weapon_type = processed_chara.get("weaponType", "")
        if weapon_type == "WEAPON_CATALYST" and skill_type in [
            "normal",
            "charged",
            "plunging",
        ]:
            # 法器角色的普通/重击/下落攻击默认为角色元素
            # 需要从tags中获取角色元素
            tags = processed_chara.get("tags", [])
            element = get_character_element(tags)
            if element:
                element_bonus = f"DMG_BONUS_{element}"
        elif skill_type in ["normal", "charged", "plunging"]:
            # 其他武器的普通/重击/下落攻击默认为物理
            element_bonus = "DMG_BONUS_PHYSICAL"
        elif skill_type == "skill":
            # 元素技能默认为角色元素
            tags = processed_chara.get("tags", [])
            element = get_character_element(tags)
            if element:
                element_bonus = f"DMG_BONUS_{element}"
        elif skill_type == "elementalBurst":
            # 元素爆发默认为角色元素
            tags = processed_chara.get("tags", [])
            element = get_character_element(tags)
            if element:
                element_bonus = f"DMG_BONUS_{element}"

    # 确定attackBonusType（攻击类型）
    attack_bonus = special_cases["attack_bonus_type"]
    if not attack_bonus:
        # 根据技能类型判断
        attack_bonus = SKILL_TYPE_MAP.get(skill_type, "DMG_BONUS_OTHER")

    # 确定canOverride
    can_override = special_cases["can_override"]
    if can_override is None:
        # 根据武器类型和技能类型判断
        weapon_type = processed_chara.get("weaponType", "")
        if weapon_type == "WEAPON_CATALYST":
            can_override = False
        elif weapon_type == "WEAPON_BOW" and skill_type == "charged":
            # 弓箭满蓄力重击
            can_override = False
        elif skill_type in ["skill", "elementalBurst"]:
            can_override = False
        else:
            can_override = True

    # 生成基础damage配置
    damage_config = {
        "indexes": indexes,
        "base": base,
        "canOverride": can_override,
        "elementBonusType": element_bonus,
        "attackBonusType": attack_bonus,
    }

    # 特殊伤害类型（如月反应）
    if special_cases["special_damage_type"]:
        damage_config["specialDamageType"] = special_cases["special_damage_type"]

    config.append({"damage": damage_config})

    # 如果包含治疗，生成healing配置
    if special_cases["has_healing"]:
        config.append(generate_healing_config(skill_data, skill_type))

    # 如果包含护盾，生成shield配置
    if special_cases["has_shield"]:
        config.append(generate_shield_config(skill_data, skill_type, processed_chara))

    return config


def get_character_element(tags):
    """从tags中获取角色元素"""
    for tag in tags:
        if tag in ["Fire", "Water", "Wind", "Electric", "Ice", "Rock", "Grass"]:
            return ELEMENT_MAP.get(tag, None)
    return None


def generate_healing_config(skill_data, skill_type):
    """生成治疗配置"""
    param_list = skill_data.get("paramList", [])
    param_desc_list = skill_data.get("paramDescList", [])

    # 从paramDescList判断healing的index和base
    indexes, base = parse_param_desc_list(param_desc_list)

    if not indexes:
        index = 0
    else:
        index = indexes[0]

    # 确定healingBonusType
    healing_bonus_type = "HEALING_BONUS_OTHER"
    if skill_type == "normal":
        healing_bonus_type = "HEALING_BONUS_NORMAL"
    elif skill_type == "skill":
        healing_bonus_type = "HEALING_BONUS_SKILL"
    elif skill_type == "elementalBurst":
        healing_bonus_type = "HEALING_BONUS_ELEMENTAL_BURST"

    healing_config = {
        "healing": {
            "index": index,
            "base": base,
            "healingBonusType": healing_bonus_type,
        }
    }

    return healing_config


def generate_shield_config(skill_data, skill_type, processed_chara):
    """生成护盾配置"""
    param_list = skill_data.get("paramList", [])
    param_desc_list = skill_data.get("paramDescList", [])
    desc = skill_data.get("desc", "")

    # 从paramDescList判断shield的index和base
    indexes, base = parse_param_desc_list(param_desc_list)

    if not indexes:
        index = 0
    else:
        index = indexes[0]

    # 确定shieldBonusType
    shield_bonus_type = "SHIELD_BONUS_OTHER"
    if skill_type == "normal":
        shield_bonus_type = "SHIELD_BONUS_NORMAL"
    elif skill_type == "skill":
        shield_bonus_type = "SHIELD_BONUS_SKILL"
    elif skill_type == "elementalBurst":
        shield_bonus_type = "SHIELD_BONUS_ELEMENTAL_BURST"

    # 确定shieldElementType（从desc或角色元素推断）
    shield_element = "PHYSICAL"

    # 从desc中判断护盾元素
    for element_name, element_key in ELEMENT_MAP.items():
        element_text = element_name.lower() if element_name != "Grass" else "草"
        if (
            f"{element_text}元素护盾" in desc.lower()
            or f"{element_text}护盾" in desc.lower()
        ):
            shield_element = element_key
            break

    # 如果desc中没有明确说明，根据角色元素推断
    if shield_element == "PHYSICAL" and (
        skill_type == "skill" or skill_type == "elementalBurst"
    ):
        tags = processed_chara.get("tags", [])
        element = get_character_element(tags)
        if element:
            shield_element = element

    shield_config = {
        "shield": {
            "index": index,
            "base": base,
            "shieldBonusType": shield_bonus_type,
            "shieldElementType": shield_element,
        }
    }

    return shield_config


# 生成角色完整配置
def generate_character_config(chara_id, processed_chara):
    """生成单个角色的完整配置"""
    chara_config = {
        "skills": {
            "normal": [],
            "skill": [],
            "other": [],
            "elementalBurst": [],
            "proudSkills": [],
            "talents": [],
        },
        "constellation": {"0": [], "1": [], "2": [], "3": [], "4": [], "5": []},
    }

    skills = processed_chara.get("skills", {})

    # 处理普通攻击
    if "normal" in skills:
        normal_skills = skills["normal"]
        for skill in normal_skills[:3]:  # 通常前3个是普通攻击配置
            chara_config["skills"]["normal"].extend(
                generate_skill_config("普通攻击", skill, processed_chara, "normal")
            )

    # 处理元素技能
    if "skill" in skills:
        for skill in skills["skill"]:
            chara_config["skills"]["skill"].extend(
                generate_skill_config("元素技能", skill, processed_chara, "skill")
            )

    # 处理元素爆发
    if "elementalBurst" in skills:
        for skill in skills["elementalBurst"]:
            chara_config["skills"]["elementalBurst"].extend(
                generate_skill_config(
                    "元素爆发", skill, processed_chara, "elementalBurst"
                )
            )

    # 处理天赋（proudSkills）
    if "proudSkills" in skills:
        for i, skill in enumerate(skills["proudSkills"]):
            if i < 6:  # 天赋通常6个
                buffs = generate_proud_skill_config(skill, processed_chara)
                if buffs:
                    chara_config["skills"]["proudSkills"].append([{"buffs": buffs}])
                else:
                    chara_config["skills"]["proudSkills"].append([])
            else:
                chara_config["skills"]["proudSkills"].append([])

    # 处理命座
    if "constellation" in skills:
        constellations = skills["constellation"]
        for i in range(6):
            constellation_key = str(i)
            if constellation_key in constellations:
                for skill in constellations[constellation_key]:
                    chara_config["constellation"][constellation_key].extend(
                        generate_skill_config(
                            f"命座{i + 1}", skill, processed_chara, "other"
                        )
                    )

    return chara_config


def generate_proud_skill_config(skill_data, processed_chara):
    """生成天赋技能配置（通常有buff）"""
    buffs = []
    param_list = skill_data.get("paramList", [])
    param_desc_list = skill_data.get("paramDescList", [])
    desc = skill_data.get("desc", "")

    # 解析desc中的特殊情况
    special_cases = parse_desc_special_cases(desc, "天赋")

    # 判断是否包含伤害
    has_damage = any(
        keyword in desc for keyword in ["伤害", "造成", "攻击", "击", "打击"]
    )

    # 判断是否包含buff关键词
    buff_keywords = ["提升", "增加", "加成", "提高", "获得"]
    has_buff = any(keyword in desc for keyword in buff_keywords)

    # 从paramDescList判断indexes和base
    indexes, base = parse_param_desc_list(param_desc_list)

    if not indexes and param_list:
        indexes = [0]

    # 如果有伤害，生成damage配置
    if has_damage and indexes:
        # 获取角色元素
        tags = processed_chara.get("tags", [])
        element = get_character_element(tags)
        element_bonus = f"DMG_BONUS_{element}" if element else "DMG_BONUS_PHYSICAL"

        damage_config = {
            "indexes": indexes,
            "base": base,
            "canOverride": False,
            "elementBonusType": element_bonus,
            "attackBonusType": "DMG_BONUS_OTHER",
        }
        return [{"damage": damage_config}]

    # 如果有buff，生成buff配置
    if has_buff and param_list:
        # 判断buff类型
        target = []
        if "攻击力" in desc:
            target.append("ATTACK_UP")
        elif "生命值" in desc:
            target.append("HP_UP")
        elif "防御力" in desc:
            target.append("DEFENSE_UP")
        elif "伤害" in desc and "提升" in desc:
            target.append("DMG_BONUS_ALL")
        elif "治疗" in desc:
            target.append("HEALING_BONUS_ALL")
        elif "护盾" in desc:
            target.append("SHIELD_BONUS_ALL")

        if not target:
            target = ["ATTACK_UP"]  # 默认

        buff_config = {
            "index": indexes[0] if indexes else 0,
            "target": target,
            "settingType": "switch",
            "defaultEnable": False,
        }

        # 如果是队伍buff，添加isAllTeam标记
        if special_cases["is_team_buff"]:
            buff_config["isAllTeam"] = True

        # 如果需要滑块，添加slider配置
        if special_cases["needs_slider"]:
            buff_config["settingType"] = "slider"
            buff_config["sliderInitialValue"] = 0
            buff_config["sliderStep"] = 1
            # 尝试从desc中提取最大层数
            max_match = re.search(r"最多(\d+)层", desc)
            if max_match:
                buff_config["sliderMax"] = int(max_match.group(1)) - 1
            else:
                buff_config["sliderMax"] = 4

        buffs.append(buff_config)

    return buffs


def generate_weapon_config(weapon_id, processed_weapon):
    """生成单个武器的配置"""
    weapon_config = {"weapon": {}}

    skill_affix_map = processed_weapon.get("skillAffixMap", {})
    weapon_type = processed_weapon.get("weaponType", "")
    name = processed_weapon.get("name", {})
    rank_level = processed_weapon.get("rankLevel", "")

    weapon_config["weapon"] = {
        "id": weapon_id,
        "name": name,
        "rankLevel": rank_level,
        "weaponType": weapon_type,
    }

    # 处理skillAffix
    if skill_affix_map:
        weapon_config["weapon"]["skillAffix"] = {}
        for affix_id, affix_data in skill_affix_map.items():
            weapon_config["weapon"]["skillAffix"][affix_id] = (
                generate_weapon_affix_config(affix_data, weapon_type)
            )

    return weapon_config


def generate_weapon_affix_config(affix_data, weapon_type):
    """生成武器精炼效果配置"""
    affix_config = {
        "id": affix_data.get("id"),
        "name": affix_data.get("name"),
        "desc": affix_data.get("desc"),
    }

    param_list = affix_data.get("paramList", [])
    param_valid_indexes = affix_data.get("paramValidIndexes", [])
    add_props = affix_data.get("addProps", [])

    # 如果有paramValidIndexes，使用它；否则使用所有参数
    if param_valid_indexes:
        affix_config["indexes"] = param_valid_indexes
    elif param_list:
        affix_config["indexes"] = list(range(len(param_list)))

    # 解析desc判断是否有buff
    desc = affix_data.get("desc", "")
    buff_keywords = ["提升", "增加", "加成", "提高", "获得"]
    has_buff = any(keyword in desc for keyword in buff_keywords)

    if has_buff:
        # 判断buff类型
        target = []
        if "攻击力" in desc:
            target.append("ATTACK_UP")
        elif "生命值" in desc:
            target.append("HP_UP")
        elif "防御力" in desc:
            target.append("DEFENSE_UP")
        elif "伤害" in desc:
            target.append("DMG_BONUS_ALL")

        if target:
            affix_config["buff"] = {
                "index": 0,  # 默认使用第一个参数
                "target": target,
                "settingType": "switch",
                "defaultEnable": True,  # 武器效果默认开启
            }

    # 处理addProps（基础属性加成）
    if add_props:
        affix_config["addProps"] = add_props

    return affix_config


def generate_artifact_config(set_id, processed_artifact):
    """生成单个圣遗物套装的配置"""
    artifact_config = {"artifact": {}}

    set_name = processed_artifact.get("setName", {})
    set_affixes = processed_artifact.get("setAffixes", [])

    artifact_config["artifact"] = {
        "id": set_id,
        "setName": set_name,
    }

    # 处理setAffixes（2件套和4件套）
    if set_affixes:
        artifact_config["artifact"]["setAffixes"] = []
        for i, affix_data in enumerate(set_affixes):
            artifact_config["artifact"]["setAffixes"].append(
                generate_artifact_affix_config(affix_data, i)
            )

    return artifact_config


def generate_artifact_affix_config(affix_data, index):
    """生成圣遗物套装效果配置"""
    affix_config = {
        "id": affix_data.get("id"),
        "name": affix_data.get("name"),
        "desc": affix_data.get("desc"),
    }

    param_list = affix_data.get("paramList", [])
    param_valid_indexes = affix_data.get("paramValidIndexes", [])
    add_props = affix_data.get("addProps", [])

    # 2件套/4件套标记
    affix_config["type"] = "2件套" if index == 0 else "4件套"

    # 如果有paramValidIndexes，使用它；否则使用所有参数
    if param_valid_indexes:
        affix_config["indexes"] = param_valid_indexes
    elif param_list:
        affix_config["indexes"] = list(range(len(param_list)))

    # 解析desc判断是否有buff
    desc = affix_data.get("desc", "")
    buff_keywords = ["提升", "增加", "加成", "提高", "获得"]
    has_buff = any(keyword in desc for keyword in buff_keywords)

    if has_buff:
        # 判断buff类型
        target = []
        if "攻击力" in desc:
            target.append("ATTACK_UP")
        elif "生命值" in desc:
            target.append("HP_UP")
        elif "防御力" in desc:
            target.append("DEFENSE_UP")
        elif "伤害" in desc:
            # 判断元素伤害类型
            for element_name, element_key in ELEMENT_MAP.items():
                element_text = element_name.lower() if element_name != "Grass" else "草"
                if (
                    f"{element_text}元素" in desc.lower()
                    or f"{element_text}伤害" in desc.lower()
                ):
                    target.append(f"DMG_BONUS_{element_key}")
                    break
            if not target:
                target.append("DMG_BONUS_ALL")
        elif "元素精通" in desc:
            target.append("ELEMENT_MASTERY_UP")

        if target:
            affix_config["buff"] = {
                "index": 0,  # 默认使用第一个参数
                "target": target,
                "settingType": "switch",
                "defaultEnable": True,  # 套装效果默认开启
            }

    # 处理addProps（基础属性加成）
    if add_props:
        affix_config["addProps"] = add_props

    return affix_config


def main():
    parser = argparse.ArgumentParser(description="生成原神配置")
    parser.add_argument("--character", type=str, help="生成指定角色的配置")
    parser.add_argument("--weapon", type=str, help="生成指定武器的配置")
    parser.add_argument("--artifact", type=str, help="生成指定圣遗物套装的配置")
    parser.add_argument("--all", action="store_true", help="生成所有配置")
    parser.add_argument(
        "--type",
        type=str,
        choices=["character", "weapon", "artifact"],
        default="character",
        help="数据类型",
    )
    args = parser.parse_args()

    print("加载处理后的数据...")
    processed_data = load_processed_data()

    if args.type == "character":
        if args.character:
            chara_id = args.character
            if chara_id in processed_data["characters"]:
                chara_config = generate_character_config(
                    chara_id, processed_data["characters"][chara_id]
                )
                print(f"生成角色 {chara_id} 的配置")
                print(json.dumps(chara_config, ensure_ascii=False, indent=2))
            else:
                print(f"错误: 未找到角色 {chara_id}")
        elif args.all:
            print("生成所有角色配置...")
            all_config = {"characters": {}}
            for chara_id in processed_data["characters"]:
                all_config["characters"][chara_id] = generate_character_config(
                    chara_id, processed_data["characters"][chara_id]
                )

            # 输出完整配置
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump(all_config, f, ensure_ascii=False, indent=2)
            print(f"配置已生成到 {OUTPUT_FILE}")

    elif args.type == "weapon":
        if args.weapon:
            weapon_id = args.weapon
            if weapon_id in processed_data["weapons"]:
                weapon_config = generate_weapon_config(
                    weapon_id, processed_data["weapons"][weapon_id]
                )
                print(f"生成武器 {weapon_id} 的配置")
                print(json.dumps(weapon_config, ensure_ascii=False, indent=2))
            else:
                print(f"错误: 未找到武器 {weapon_id}")
        elif args.all:
            print("生成所有武器配置...")
            all_config = {"weapons": {}}
            for weapon_id in processed_data["weapons"]:
                all_config["weapons"][weapon_id] = generate_weapon_config(
                    weapon_id, processed_data["weapons"][weapon_id]
                )

            # 输出完整配置
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump(all_config, f, ensure_ascii=False, indent=2)
            print(f"配置已生成到 {OUTPUT_FILE}")

    elif args.type == "artifact":
        if args.artifact:
            set_id = args.artifact
            if set_id in processed_data["artifacts"]:
                artifact_config = generate_artifact_config(
                    set_id, processed_data["artifacts"][set_id]
                )
                print(f"生成圣遗物套装 {set_id} 的配置")
                print(json.dumps(artifact_config, ensure_ascii=False, indent=2))
            else:
                print(f"错误: 未找到圣遗物套装 {set_id}")
        elif args.all:
            print("生成所有圣遗物套装配置...")
            all_config = {"artifact": {}}
            for set_id in processed_data["artifacts"]:
                all_config["artifact"][set_id] = generate_artifact_config(
                    set_id, processed_data["artifacts"][set_id]
                )

            # 输出完整配置
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump(all_config, f, ensure_ascii=False, indent=2)
            print(f"配置已生成到 {OUTPUT_FILE}")

    print("\n使用提示：")
    print("1. 生成的配置需要手动检查和调整")
    print("2. 特殊机制可能需要手动添加（特殊标签、计算队列等）")
    print("3. 参考 game-mechanics.md 理解游戏机制")
    print("4. 根据paramDescList判断indexes和base是核心依据")


if __name__ == "__main__":
    main()
