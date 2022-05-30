package genshindata

//************************
//         通用
//************************
type PROPERTY struct {
	Level                 int     `json:"level"`
	PromoteLevel          float64 `json:"promoteLevel"`
	Hp                    float64 `json:"hp"`
	Attack                float64 `json:"attack"`
	Defense               float64 `json:"defense"`
	Hp_up                 float64 `json:"hp_up"`
	Attack_up             float64 `json:"attack_up"`
	Defense_up            float64 `json:"defense_up"`
	Crit_rate             float64 `json:"crit_rate"`
	Crit_dmg              float64 `json:"crit_dmg"`
	Energy_rechage        float64 `json:"energy_rechage"`
	Healing_bonus         float64 `json:"healing_bonus"`
	Reverse_healing_bonus float64 `json:"reverse_healing_bonus"`
	Elemental_mastery     float64 `json:"elemental_mastery"`
	DMG_BONUS
}

type DMG_BONUS struct {
	Dmg_bonus_cryo            float64 `json:"dmg_bonus_cryo"`
	Dmg_bonus_anemo           float64 `json:"dmg_bonus_anemo"`
	Dmg_bonus_physical        float64 `json:"dmg_bonus_physical"`
	Dmg_bonus_electro         float64 `json:"dmg_bonus_electro"`
	Dmg_bonus_geo             float64 `json:"dmg_bonus_geo"`
	Dmg_bonus_pyro            float64 `json:"dmg_bonus_pyro"`
	Dmg_bonus_hydro           float64 `json:"dmg_bonus_hydro"`
	Dmg_bonus_dendro          float64 `json:"dmg_bonus_dendro"`
	Dmg_bonus_all             float64 `json:"dmg_bonus_all"`
	Dmg_bonus_normal          float64 `json:"dmg_bonus_normal"`
	Dmg_bonus_charged         float64 `json:"dmg_bonus_charged"`
	Dmg_bonus_plunging        float64 `json:"dmg_bonus_plunging"`
	Dmg_bonus_skill           float64 `json:"dmg_bonus_skill"`
	Dmg_bonus_elemental_burst float64 `json:"dmg_bonus_elemental_burst"`
}

type DMG_ANTI struct {
	Dmg_anti_cryo     float64 `json:"dmg_anti_cryo"`
	Dmg_anti_anemo    float64 `json:"dmg_anti_anemo"`
	Dmg_anti_physical float64 `json:"dmg_anti_physical"`
	Dmg_anti_electro  float64 `json:"dmg_anti_electro"`
	Dmg_anti_geo      float64 `json:"dmg_anti_geo"`
	Dmg_anti_pyro     float64 `json:"dmg_anti_pyro"`
	Dmg_anti_hydro    float64 `json:"dmg_anti_hydro"`
	Dmg_anti_dendro   float64 `json:"dmg_anti_dendro"`
}

//************************
//         人物
//************************
type AVATAR struct {
	Id              uint64               `json:"id"`
	QualityType     string               `json:"qualityType"`
	Name            map[string]string    `json:"name"`
	NameTextMapHash uint64               `json:"nameTextMapHash"`
	Desc            map[string]string    `json:"desc"`
	DescTextMapHash uint64               `json:"descTextMapHash"`
	IconName        string               `json:"iconName"`
	SideIconName    string               `json:"sideIconName"`
	WeaponType      string               `json:"weaponType"`
	LevelMap        map[string]*PROPERTY `json:"levelMap"`
	SkillDepotId    uint64               `json:"skillDepotId"`
	Skills          AVATARSKILLS         `json:"skills"`
}

//人物技能集
type AVATARSKILLS struct {
	Id              uint64            `json:"id"`
	Normal          AVATARSKILLINFO   `json:"normal"`
	Skill           AVATARSKILLINFO   `json:"skill"`
	Other           AVATARSKILLINFO   `json:"other"`
	Elemental_burst AVATARSKILLINFO   `json:"elemental_burst"`
	ProudSkills     []AVATARSKILLINFO `json:"proudSkills"`
	Talents         []AVATARSKILLINFO `json:"talents"`
}

//人物技能
type AVATARSKILLINFO struct {
	Name          map[string]string    `json:"name"`
	Desc          map[string]string    `json:"desc"`
	Icon          string               `json:"icon"`
	ParamDescList map[string][]string  `json:"paramDescList"`
	ParamMap      map[string][]float64 `json:"paramMap"`
}

//************************
//         武器
//************************
type WEAPON struct {
	Id              uint64                `json:"id"`
	Name            map[string]string     `json:"name"`
	NameTextMapHash uint64                `json:"nameTextMapHash"`
	Desc            map[string]string     `json:"desc"`
	DescTextMapHash uint64                `json:"descTextMapHash"`
	IconName        string                `json:"iconName"`
	WeaponType      string                `json:"weaponType"`
	SkillAffixMap   map[string]SKILLAFFIX `json:"skillAffixMap"`
	LevelMap        map[string]*PROPERTY  `json:"levelMap"`
}

//武器特效
type SKILLAFFIX struct {
	Name map[string]string `json:"name"`
	Desc map[string]string `json:"desc"`
	GenshinSkillAffixData
}

//************************
//         怪物
//************************
type MONSTER struct {
	Id              uint64                      `json:"id"`
	Name            map[string]string           `json:"name"`
	NameTextMapHash uint64                      `json:"nameTextMapHash"`
	MonsterName     string                      `json:"monsterName"`
	Type            string                      `json:"type"`
	LevelMap        map[string]*MONSTERPROPERTY `json:"levelMap"`
}

type MONSTERPROPERTY struct {
	Level   int     `json:"level"`
	Hp      float64 `json:"hp"`
	Attack  float64 `json:"attack"`
	Defense float64 `json:"defense"`
	DMG_ANTI
}

//************************
//        圣遗物
//************************
type RELIQUARY struct {
	SetId           uint64            `json:"setId"`
	RankLevel       int               `json:"rankLevel"`
	EquipAffixId    uint64            `json:"equipAffixId"`
	NameTextMapHash uint64            `json:"nameTextMapHash"`
	SetName         map[string]string `json:"setName"`
	SetAffixs       []*RELIQUARYAFFIX `json:"setAffixs"`
}

type RELIQUARYAFFIX struct {
	Name            map[string]string `json:"name"`
	NameTextMapHash uint64            `json:"nameTextMapHash"`
	Desc            map[string]string `json:"desc"`
	DescTextMapHash uint64            `json:"descTextMapHash"`
	Level           int               `json:"level"`
	AddProps        []interface{}     `json:"addProps"`
	ParamList       []float64         `json:"paramList"`
}

//GetNameFromTypeCode genshindataType名转换属性名
func GetNameFromTypeCode(code string) string {
	name := ""
	switch code {
	case HP_BASE, HP:
		name = "Hp"
	case ATTACK_BASE, ATTACK:
		name = "Attack"
	case DEFENSE_BASE, DEFENSE:
		name = "Defense"
	case HP_UP:
		name = "Hp_up"
	case ATTACK_UP:
		name = "Attack_up"
	case DEFENSE_UP:
		name = "Defense_up"
	case CRIT_RATE:
		name = "Crit_rate"
	case CRIT_DMG:
		name = "Crit_dmg"
	case DMG_BONUS_CRYO:
		name = "Dmg_bonus_cryo"
	case DMG_BONUS_ANEMO:
		name = "Dmg_bonus_anemo"
	case DMG_BONUS_PHYSICAL:
		name = "Dmg_bonus_physical"
	case DMG_BONUS_ELECTRO:
		name = "Dmg_bonus_electro"
	case DMG_BONUS_GEO:
		name = "Dmg_bonus_geo"
	case DMG_BONUS_PYRO:
		name = "Dmg_bonus_pyro"
	case DMG_BONUS_HYDRO:
		name = "Dmg_bonus_hydro"
	case DMG_BONUS_DENDRO:
		name = "Dmg_bonus_dendro"
	case ENERGY_RECHARGE:
		name = "Energy_rechage"
	case ELEMENTAL_MASTERY:
		name = "Elemental_mastery"
	case HEALING_BONUS:
		name = "Healing_bonus"
	}
	return name
}
