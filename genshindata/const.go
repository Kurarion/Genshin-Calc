package genshindata

//突破属性类型
//基础
const (
	HP_BASE      = "FIGHT_PROP_BASE_HP"
	ATTACK_BASE  = "FIGHT_PROP_BASE_ATTACK"
	DEFENSE_BASE = "FIGHT_PROP_BASE_DEFENSE"
)

//额外
const (
	HP                    = "FIGHT_PROP_HP"
	ATTACK                = "FIGHT_PROP_ATTACK"
	DEFENSE               = "FIGHT_PROP_DEFENSE"
	HP_UP                 = "FIGHT_PROP_HP_PERCENT"
	ATTACK_UP             = "FIGHT_PROP_ATTACK_PERCENT"
	DEFENSE_UP            = "FIGHT_PROP_DEFENSE_PERCENT"
	CRIT_RATE             = "FIGHT_PROP_CRITICAL"
	CRIT_DMG              = "FIGHT_PROP_CRITICAL_HURT"
	DMG_BONUS_CRYO        = "FIGHT_PROP_ICE_ADD_HURT"
	DMG_BONUS_ANEMO       = "FIGHT_PROP_WIND_ADD_HURT"
	DMG_BONUS_PHYSICAL    = "FIGHT_PROP_PHYSICAL_ADD_HURT"
	DMG_BONUS_ELECTRO     = "FIGHT_PROP_ELEC_ADD_HURT"
	DMG_BONUS_GEO         = "FIGHT_PROP_ROCK_ADD_HURT"
	DMG_BONUS_PYRO        = "FIGHT_PROP_FIRE_ADD_HURT"
	DMG_BONUS_HYDRO       = "FIGHT_PROP_WATER_ADD_HURT"
	DMG_BONUS_DENDRO      = "FIGHT_PROP_GRASS_ADD_HURT"
	ENERGY_RECHARGE       = "FIGHT_PROP_CHARGE_EFFICIENCY"
	ELEMENTAL_MASTERY     = "FIGHT_PROP_ELEMENT_MASTERY"
	HEALING_BONUS         = "FIGHT_PROP_HEAL_ADD"
	REVERSE_HEALING_BONUS = "FIGHT_PROP_HEALED_ADD"
)

//额外
const (
	DMG_ANTI_CRYO     = "FIGHT_PROP_ICE_SUB_HURT"
	DMG_ANTI_ANEMO    = "FIGHT_PROP_WIND_SUB_HURT"
	DMG_ANTI_PHYSICAL = "FIGHT_PROP_PHYSICAL_SUB_HURT"
	DMG_ANTI_ELECTRO  = "FIGHT_PROP_ELEC_SUB_HURT"
	DMG_ANTI_GEO      = "FIGHT_PROP_ROCK_SUB_HURT"
	DMG_ANTI_PYRO     = "FIGHT_PROP_FIRE_SUB_HURT"
	DMG_ANTI_HYDRO    = "FIGHT_PROP_WATER_SUB_HURT"
	DMG_ANTI_DENDRO   = "FIGHT_PROP_GRASS_SUB_HURT"
)

//人物成长曲线类型
const (
	C_HP5      = "GROW_CURVE_HP_S5"
	C_HP4      = "GROW_CURVE_HP_S4"
	C_ATTACK5  = "GROW_CURVE_ATTACK_S5"
	C_ATTACK4  = "GROW_CURVE_ATTACK_S4"
	C_DEFENSE5 = "GROW_CURVE_HP_S5"
	C_DEFENSE4 = "GROW_CURVE_HP_S4"
)

//武器成长曲线类型
const (
	C_W_ATTACK101   = "GROW_CURVE_ATTACK_101"
	C_W_ATTACK102   = "GROW_CURVE_ATTACK_102"
	C_W_ATTACK103   = "GROW_CURVE_ATTACK_103"
	C_W_ATTACK104   = "GROW_CURVE_ATTACK_104"
	C_W_ATTACK105   = "GROW_CURVE_ATTACK_105"
	C_W_CRITICAL101 = "GROW_CURVE_CRITICAL_101"
	C_W_ATTACK201   = "GROW_CURVE_ATTACK_201"
	C_W_ATTACK202   = "GROW_CURVE_ATTACK_202"
	C_W_ATTACK203   = "GROW_CURVE_ATTACK_203"
	C_W_ATTACK204   = "GROW_CURVE_ATTACK_204"
	C_W_ATTACK205   = "GROW_CURVE_ATTACK_205"
	C_W_CRITICAL201 = "GROW_CURVE_CRITICAL_201"
	C_W_ATTACK301   = "GROW_CURVE_ATTACK_301"
	C_W_ATTACK302   = "GROW_CURVE_ATTACK_302"
	C_W_ATTACK303   = "GROW_CURVE_ATTACK_303"
	C_W_ATTACK304   = "GROW_CURVE_ATTACK_304"
	C_W_ATTACK305   = "GROW_CURVE_ATTACK_305"
	C_W_CRITICAL301 = "GROW_CURVE_CRITICAL_301"
)

//武器种类
const (
	WEAPON_SWORD_ONE_HAND = "WEAPON_SWORD_ONE_HAND"
	WEAPON_CLAYMORE       = "WEAPON_CLAYMORE"
	WEAPON_POLE           = "WEAPON_POLE"
	WEAPON_CATALYST       = "WEAPON_CATALYST"
	WEAPON_BOW            = "WEAPON_BOW"
)

//怪物种类
const (
	MONSTER_ORDINARY   = "MONSTER_ORDINARY"
	MONSTER_BOSS       = "MONSTER_BOSS"
	MONSTER_ENV_ANIMAL = "MONSTER_ENV_ANIMAL"
	MONSTER_FISH       = "MONSTER_FISH"
)

//文件信息
const (
	RepositoryURL = `https://raw.githubusercontent.com/Dimbreath/GenshinData/master`
	//人物定义
	AvatarExcelConfigData = "/ExcelBinOutput/AvatarExcelConfigData.json"
	//人物基础升级提升值(对应)
	AvatarCurveExcelConfigData = "/ExcelBinOutput/AvatarCurveExcelConfigData.json"
	//人物突破提升值(对应)
	AvatarPromoteExcelConfigData = "/ExcelBinOutput/AvatarPromoteExcelConfigData.json"
	//文字代码对应表(CHS)
	TextMapDataCHS = "/TextMap/TextMapCHS.json"
	//文字代码对应表(CHT)
	TextMapDataCHT = "/TextMap/TextMapCHT.json"
	//文字代码对应表(EN)
	TextMapDataEN = "/TextMap/TextMapEN.json"
	//文字代码对应表(JP)
	TextMapDataJP = "/TextMap/TextMapJP.json"
	//武器定义
	WeaponExcelConfigData = "/ExcelBinOutput/WeaponExcelConfigData.json"
	//武器基础升级提升值(对应)
	WeaponCurveExcelConfigData = "/ExcelBinOutput/WeaponCurveExcelConfigData.json"
	//武器突破提升值(对应)
	WeaponPromoteExcelConfigData = "/ExcelBinOutput/WeaponPromoteExcelConfigData.json"
	//武器特效
	EquipAffixExcelConfigData = "/ExcelBinOutput/EquipAffixExcelConfigData.json"
	//圣遗物定义
	ReliquaryExcelConfigData = "/ExcelBinOutput/ReliquaryExcelConfigData.json"
	//圣遗物词条提升值
	ReliquaryAffixExcelConfigData = "/ExcelBinOutput/ReliquaryAffixExcelConfigData.json"
	//圣遗物主词条值
	ReliquaryLevelExcelConfigData = "/ExcelBinOutput/ReliquaryLevelExcelConfigData.json"
	//圣遗物套装信息
	ReliquarySetExcelConfigData = "/ExcelBinOutput/ReliquarySetExcelConfigData.json"
	//圣遗物星级信息
	ReliquaryCodexExcelConfigData = "/ExcelBinOutput/ReliquaryCodexExcelConfigData.json"
	//怪物定义
	MonsterExcelConfigData = "/ExcelBinOutput/MonsterExcelConfigData.json"
	//怪物基础升级提升值(对应)
	MonsterCurveExcelConfigData = "/ExcelBinOutput/MonsterCurveExcelConfigData.json"
	//人物全技能列表
	AvatarSkillDepotExcelConfigData = "/ExcelBinOutput/AvatarSkillDepotExcelConfigData.json"
	//人物EQ技能
	AvatarSkillExcelConfigData = "/ExcelBinOutput/AvatarSkillExcelConfigData.json"
	//人物天赋
	ProudSkillExcelConfigData = "/ExcelBinOutput/ProudSkillExcelConfigData.json"
	//人物命座
	AvatarTalentExcelConfigData = "/ExcelBinOutput/AvatarTalentExcelConfigData.json"
)
