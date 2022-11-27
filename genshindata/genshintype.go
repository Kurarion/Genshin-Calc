package genshindata

//************************
//         共通
//************************

type GenshinGrowCurvesListData []GenshinGrowCurvesData

//人物/武器 基础升级提升
type GenshinGrowCurvesData struct {
	Level      int            `json:"level"`
	CurveInfos []GenshinCurve `json:"curveInfos"`
}

//成长类型
type GenshinCurve struct {
	Type  string  `json:"type"`
	Value float64 `json:"value"`
}

type GenshinPromoteListData []GenshinPromoteData

//人物/武器 突破提升值
type GenshinPromoteData struct {
	AvatarPromoteId     uint64           `json:"avatarPromoteId"`
	WeaponPromoteId     uint64           `json:"weaponPromoteId"`
	PromoteLevel        int              `json:"promoteLevel"`
	AddProps            []GenshinPropAdd `json:"addProps"`
	RequiredPlayerLevel int              `json:"requiredPlayerLevel"`
	UnlockMaxLevel      int              `json:"unlockMaxLevel"`
}

// func (this GenshinPromoteListData) Len() int {
// 	return len(this)
// }
// func (this GenshinPromoteListData) Swap(i, j int) {
// 	this[i], this[j] = this[j], this[i]
// }
// func (this GenshinPromoteListData) Less(i, j int) bool {
// 	return this[i].AvatarPromoteId < this[j].AvatarPromoteId
// }

//属性增量
type GenshinPropAdd struct {
	PropType string  `json:"propType"`
	Value    float64 `json:"value"`
}

//************************
//         人物
//************************

type GenshinAvatarBaseListData []GenshinAvatarBaseData

//人物定义
type GenshinAvatarBaseData struct {
	Id                uint64           `json:"id"`
	NameTextMapHash   uint64           `json:"nameTextMapHash"`
	DescTextMapHash   uint64           `json:"descTextMapHash"`
	IconName          string           `json:"iconName"`
	WeaponType        string           `json:"weaponType"`
	HpBase            float64          `json:"hpBase"`
	AttackBase        float64          `json:"attackBase"`
	DefenseBase       float64          `json:"defenseBase"`
	Critical          float64          `json:"critical"`
	CriticalHurt      float64          `json:"criticalHurt"`
	ChargeEfficiency  float64          `json:"chargeEfficiency"`
	PropGrowCurves    []propGrowCurves `json:"propGrowCurves"`
	AvatarPromoteId   uint64           `json:"avatarPromoteId"`
	SkillDepotId      uint64           `json:"skillDepotId"`
	CandSkillDepotIds []uint64         `json:"candSkillDepotIds"`
	QualityType       string           `json:"qualityType"`
	SideIconName      string           `json:"sideIconName"`
}

//成长参数
type propGrowCurves struct {
	Type  string `json:"type"`
	Value string `json:"growCurve"`
}

//************************
//         武器
//************************

type GenshinWeaponBaseListData []GenshinWeaponBaseData

//武器定义
type GenshinWeaponBaseData struct {
	Id              uint64                        `json:"id"`
	RankLevel       int                           `json:"rankLevel"`
	NameTextMapHash uint64                        `json:"nameTextMapHash"`
	DescTextMapHash uint64                        `json:"descTextMapHash"`
	IconName        string                        `json:"icon"`
	WeaponType      string                        `json:"weaponType"`
	PropGrowCurves  []GenshinWeaponPropGrowCurves `json:"weaponProp"`
	WeaponPromoteId uint64                        `json:"weaponPromoteId"`
	SkillAffix      []uint64                      `json:"skillAffix"`
}

//武器成长参数
type GenshinWeaponPropGrowCurves struct {
	PropType  string  `json:"propType"`
	InitValue float64 `json:"initValue"`
	Type      string  `json:"type"`
}

type GenshinSkillAffixListData []GenshinSkillAffixData

//武器特效
type GenshinSkillAffixData struct {
	Id              uint64    `json:"id"`
	AffixId         uint64    `json:"affixId"`
	Level           int       `json:"level"`
	NameTextMapHash uint64    `json:"nameTextMapHash"`
	DescTextMapHash uint64    `json:"descTextMapHash"`
	ParamList       []float64 `json:"paramList"`
}

//************************
//        圣遗物
//************************

type GenshinReliquaryAffixListData []GenshinReliquaryAffix

//圣遗物小词条刻度
type GenshinReliquaryAffix struct {
	Id        uint64  `json:"id"`
	DepotId   int     `json:"depotId"`
	PropType  string  `json:"propType"`
	PropValue float64 `json:"propValue"`
	Weight    int     `json:"weight"`
}

type GenshinReliquaryMainListData []GenshinReliquaryMain

//圣遗物主词条
type GenshinReliquaryMain struct {
	Rank     int              `json:"rank"`
	Level    int              `json:"level"`
	AddProps []GenshinPropAdd `json:"addProps"`
}

type GenshinReliquaryListData []GenshinReliquaryData

//圣遗物定义
type GenshinReliquaryData struct {
	SetId     uint64 `json:"setId"`
	RankLevel int    `json:"rankLevel"`
}

type GenshinReliquarySetListData []GenshinReliquarySetData

//圣遗物套装定义
type GenshinReliquarySetData struct {
	SetId        uint64 `json:"setId"`
	EquipAffixId uint64 `json:"equipAffixId"`
}

type GenshinReliquarySetAffixListData []GenshinReliquarySetAffixData

//圣遗物套装效果定义
type GenshinReliquarySetAffixData struct {
	Id              uint64        `json:"id"`
	NameTextMapHash uint64        `json:"nameTextMapHash"`
	DescTextMapHash uint64        `json:"descTextMapHash"`
	Level           int           `json:"level"`
	AddProps        []interface{} `json:"addProps"`
	ParamList       []float64     `json:"paramList"`
}

type GenshinReliquaryCodexListData []GenshinReliquaryCodexData

//圣遗物星级定义
type GenshinReliquaryCodexData struct {
	Id     uint64 `json:"Id"`
	SuitId uint64 `json:"suitId"`
	Level  int    `json:"level"`
}

//************************
//         怪物
//************************

type GenshinMonsterBaseListData []GenshinMonsterBaseData
type GenshinMonsterDescribeListData []GenshinMonsterDescribeData
type GenshinMonsterTitleListData []GenshinMonsterTitleData

//怪物定义
type GenshinMonsterBaseData struct {
	Id                uint64           `json:"id"`
	MonsterName       string           `json:"monsterName"`
	Type              string           `json:"type"`
	NameTextMapHash   uint64           `json:"nameTextMapHash"`
	VisionLevel       string           `json:"visionLevel"`
	IsInvisibleReset  bool             `json:"isInvisibleReset"`
	FeatureTagGroupID uint64           `json:"featureTagGroupID"`
	DescribeId        uint64           `json:"describeId"`
	Affix             []uint64         `json:"affix"`
	HpBase            float64          `json:"hpBase"`
	AttackBase        float64          `json:"attackBase"`
	DefenseBase       float64          `json:"defenseBase"`
	PropGrowCurves    []propGrowCurves `json:"propGrowCurves"`
	GenshinSubHurtData
}

//怪物描述
type GenshinMonsterDescribeData struct {
	Id               uint64 `json:"id"`
	NameTextMapHash  uint64 `json:"nameTextMapHash"`
	TitleID          uint64 `json:"titleID"`
	SpecialNameLabID uint64 `json:"specialNameLabID"`
	Icon             string `json:"icon"`
}

//怪物标题
type GenshinMonsterTitleData struct {
	TitleID              uint64 `json:"titleID"`
	TitleNameTextMapHash uint64 `json:"titleNameTextMapHash"`
}

//抗性定义
type GenshinSubHurtData struct {
	FireSubHurt     float64 `json:"fireSubHurt"`
	GrassSubHurt    float64 `json:"grassSubHurt"`
	WaterSubHurt    float64 `json:"waterSubHurt"`
	ElecSubHurt     float64 `json:"elecSubHurt"`
	WindSubHurt     float64 `json:"windSubHurt"`
	IceSubHurt      float64 `json:"iceSubHurt"`
	RockSubHurt     float64 `json:"rockSubHurt"`
	PhysicalSubHurt float64 `json:"physicalSubHurt"`
}

type GenshinAvatarSkillsListData []GenshinAvatarSkillsData

//************************
//       人物技能
//************************

//人物全技能列表
type GenshinAvatarSkillsData struct {
	Id                      uint64                            `json:"id"`
	EnergySkill             uint64                            `json:"energySkill"`
	Skills                  []uint64                          `json:"skills"`
	InherentProudSkillOpens []GenshinAvatarInherentProudSkill `json:"inherentProudSkillOpens"`
	Talents                 []uint64                          `json:"talents"`
	TalentStarName          string                            `json:"talentStarName"`
}

//人物天赋子结构
type GenshinAvatarInherentProudSkill struct {
	ProudSkillGroupId      uint64 `json:"proudSkillGroupId"`
	NeedAvatarPromoteLevel int    `json:"needAvatarPromoteLevel"`
}

type GenshinAvatarSkillListData []GenshinAvatarSkillData

//人物EQ技能
type GenshinAvatarSkillData struct {
	Id                uint64  `json:"id"`
	NameTextMapHash   uint64  `json:"nameTextMapHash"`
	DescTextMapHash   uint64  `json:"descTextMapHash"`
	CdTime            float64 `json:"cdTime"`
	SkillIcon         string  `json:"skillIcon"`
	ProudSkillGroupId uint64  `json:"proudSkillGroupId"`
}

type GenshinAvatarProudSkillListData []GenshinAvatarProudSkillData

//人物技能详细
type GenshinAvatarProudSkillData struct {
	ProudSkillId      uint64    `json:"proudSkillId"`
	ProudSkillGroupId uint64    `json:"proudSkillGroupId"`
	Level             int       `json:"level"`
	ProudSkillType    int       `json:"proudSkillType"`
	NameTextMapHash   uint64    `json:"nameTextMapHash"`
	DescTextMapHash   uint64    `json:"descTextMapHash"`
	Icon              string    `json:"icon"`
	BreakLevel        int       `json:"breakLevel"`
	ParamDescList     []uint64  `json:"paramDescList"`
	ParamList         []float64 `json:"paramList"`
}

type GenshinAvatarTalentListData []GenshinAvatarTalentData

//人物命座
type GenshinAvatarTalentData struct {
	TalentId        uint64    `json:"talentId"`
	NameTextMapHash uint64    `json:"nameTextMapHash"`
	DescTextMapHash uint64    `json:"descTextMapHash"`
	Icon            string    `json:"icon"`
	ParamList       []float64 `json:"paramList"`
}

//************************
//       额外数据
//************************

type GenshinExtraAvatarMapData map[string]GenshinExtraAvatarData

//补充
type GenshinExtraAvatarData struct {
	BackgroundUrl string `json:"backgroundUrl"`
}

type GenshinFetterInfoDataList []GenshinFetterInfoData

//其他信息
type GenshinFetterInfoData struct {
	InfoBirthMonth                      int    `json:"infoBirthMonth"`
	InfoBirthDay                        int    `json:"infoBirthDay"`
	AvatarNativeTextMapHash             uint64 `json:"avatarNativeTextMapHash"`
	AvatarVisionBeforTextMapHash        uint64 `json:"avatarVisionBeforTextMapHash"`
	AvatarConstellationBeforTextMapHash uint64 `json:"avatarConstellationBeforTextMapHash"`
	AvatarTitleTextMapHash              uint64 `json:"avatarTitleTextMapHash"`
	AvatarDetailTextMapHash             uint64 `json:"avatarDetailTextMapHash"`
	AvatarAssocType                     string `json:"avatarAssocType"`
	FetterId                            uint64 `json:"fetterId"`
	AvatarId                            uint64 `json:"avatarId"`
}
