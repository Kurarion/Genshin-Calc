package genshindata

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	// gocc "github.com/liuzl/gocc"
)

const (
	languageCHS = "cn_sim"
	languageCHT = "cn_tra"
	languageEN  = "en"
	languageJP  = "jp"
)

//图片资源Host
const (
	imgHostAvatarFormat        = "https://upload-bbs.mihoyo.com/game_record/genshin/character_icon/%s.png"
	imgHostEquipFormat         = "https://upload-bbs.mihoyo.com/game_record/genshin/equip/%s.png"
	imgHostConstellationFormat = "https://upload-bbs.mihoyo.com/game_record/genshin/constellation_icon/%s.png"
	imgHostMonsterFormat       = "https://res.cloudinary.com/genshin/image/upload/sprites/%s.png"
	imgHostOhterFormat         = "https://enka.network/ui/%s.png"

	imgAwakenSuffix    = "_Awaken"
	imgRelicIconPrefix = "UI_RelicIcon_"
	imgRelicIconSuffix = "_4" //flower
)

//数据相关
const (
	assocTypePrefix = "ASSOC_TYPE_"
)

var (
	elementTypeMap = map[string]int{
		"无": 1,
		"火": 2,
		"水": 3,
		"风": 4,
		"冰": 5,
		"岩": 6,
		"雷": 7,
		"草": 8,
	}

	elementMap = map[int](*map[string]string){
		2: &map[string]string{
			"cn_sim": "火",
			"cn_tra": "火",
			"en":     "Pyro",
			"jp":     "炎",
		},
		3: &map[string]string{
			"cn_sim": "水",
			"cn_tra": "水",
			"en":     "Hydro",
			"jp":     "水",
		},
		4: &map[string]string{
			"cn_sim": "风",
			"cn_tra": "風",
			"en":     "Anemo",
			"jp":     "風",
		},
		5: &map[string]string{
			"cn_sim": "岩",
			"cn_tra": "岩",
			"en":     "Geo",
			"jp":     "岩",
		},
		6: &map[string]string{
			"cn_sim": "雷",
			"cn_tra": "雷",
			"en":     "Electro",
			"jp":     "雷",
		},
		7: &map[string]string{
			"cn_sim": "冰",
			"cn_tra": "冰",
			"en":     "Cryo",
			"jp":     "氷",
		},
		8: &map[string]string{
			"cn_sim": "草",
			"cn_tra": "草",
			"en":     "Dendro",
			"jp":     "草",
		},
	}
)

var (
	sysLanguage = []string{languageCHS, languageCHT, languageEN, languageJP}
	// t2s         *gocc.OpenCC
)

var (
	//资源URL
	dataJSONURLMap map[string]string
	//文件
	dataFileMap map[string]FILEINFO

	//角色
	dataAvatarMap map[uint64]*AVATAR
	//人物技能集
	dataAvatarSkillsMap map[uint64]*AVATARSKILLS
	//武器
	dataWeaponMap map[uint64]*WEAPON
	//怪物
	dataMonsterMap map[uint64]*MONSTER

	//圣遗物套装
	dataReliquarySetMap map[uint64]*RELIQUARY
	//圣遗物词条刻度
	dataReliquaryAffixMap map[string][]float64
	//圣遗物主词条值
	dataReliquaryMainMap map[string]float64

	//序列化列表
	dataSaveObjMap map[string]interface{}
)

//设置
const (
	configAvatarLevelFormat      = "%02d"
	configWeaponLevelFormat      = "%02d"
	configMonsterLevelFormat     = "%03d"
	configSkillLevelFormat       = "%02d"
	configWeaponAffixLevelFormat = "%01d"
)

// var (
// 	configUnlistMonsterType = map[string]interface{}{
// 		MONSTER_ENV_ANIMAL: nil,
// 		MONSTER_FISH:       nil,
// 	}
// )

//保存路径
const (
	fileAvatar         = "avatar_map.json"
	fileAvatarSkills   = "avatar_skills_map.json"
	fileWeapon         = "weapon_map.json"
	fileMonster        = "monster_map.json"
	fileReliquaryAffix = "reliquary_affix_map.json"
	fileReliquaryMain  = "reliquary_main_map.json"
	fileReliquarySet   = "reliquary_set_map.json"

	fileLocalCharacterExtra = "character.json"
)

//文件完整路径
const (
	// pathDir   = "./src/assets/genshin"
	pathSlash = "/"

	// pathAvatarFile         = pathDir + pathSlash + fileAvatar
	// pathWeaponFile         = pathDir + pathSlash + fileWeapon
	// pathReliquaryAffixFile = pathDir + pathSlash + fileReliquaryAffix
	// pathReliquaryMainFile  = pathDir + pathSlash + fileReliquaryMain
	// pathReliquarySetFile   = pathDir + pathSlash + fileReliquarySet
	// pathAvatarSkillsFile   = pathDir + pathSlash + fileAvatarSkills
	// pathMonsterFile        = pathDir + pathSlash + fileMonster

	pathLocalDir = "./genshindata/extra"

	pathLocalCharacterExtra = pathLocalDir + pathSlash + fileLocalCharacterExtra
)

//索引
const (
	indexAvatarExcelConfig              = "AvatarExcelConfigData"
	indexAvatarCurveExcelConfig         = "AvatarCurveExcelConfigData"
	indexAvatarPromoteExcelConfig       = "AvatarPromoteExcelConfigData"
	indexWeaponExcelConfig              = "WeaponExcelConfigData"
	indexWeaponCurveExcelConfig         = "WeaponCurveExcelConfigData"
	indexWeaponPromoteExcelConfig       = "WeaponPromoteExcelConfigData"
	indexEquipAffixExcelConfig          = "EquipAffixExcelConfigData"
	indexReliquaryExcelConfigData       = "ReliquaryExcelConfigData"
	indexReliquaryAffixExcelConfig      = "ReliquaryAffixExcelConfigData"
	indexReliquaryLevelExcelConfig      = "ReliquaryLevelExcelConfigData"
	indexReliquarySetExcelConfig        = "ReliquarySetExcelConfigData"
	indexReliquaryCodexExcelConfig      = "ReliquaryCodexExcelConfigData"
	indexMonsterExcelConfig             = "MonsterExcelConfigData"
	indexMonsterDescribeExcelConfigData = "MonsterDescribeExcelConfigData"
	indexMonsterTitleExcelConfigData    = "MonsterTitleExcelConfigData"
	indexMonsterCurveExcelConfig        = "MonsterCurveExcelConfigData"
	indexAvatarSkillDepotExcelConfig    = "AvatarSkillDepotExcelConfigData"
	indexAvatarSkillExcelConfig         = "AvatarSkillExcelConfigData"
	indexProudSkillExcelConfig          = "ProudSkillExcelConfigData"
	indexAvatarTalentExcelConfig        = "AvatarTalentExcelConfigData"
	indexFetterInfoExcelConfigData      = "FetterInfoExcelConfigData"
	indexTextMapCHSFile                 = "TextMapDataCHS"
	indexTextMapCHTFile                 = "TextMapDataCHT"
	indexTextMapENFile                  = "TextMapDataEN"
	indexTextMapJPFile                  = "TextMapDataJP"

	indexFileSaveDir        = "map_dir"
	indexAvatarPath         = "avatar_map"
	indexWeaponPath         = "weapon_map"
	indexReliquarySetPath   = "reliquary_set_map"
	indexReliquaryAffixPath = "reliquary_affix_map"
	indexReliquaryMainPath  = "reliquary_main_map"
	indexMonsterPath        = "monster_map"
	indexAvatarSkillPath    = "avatar_skills_map"
)

const (
	//圣遗物词条depotID
	genshinArtiDepotId = 501
	//圣遗物等级
	genshinArtiLeveL = 21
	//武器最低星级
	genshinMinWeaponRankLevel = 3

	genshinCharacterLevelMin     = 1
	genshinCharacterLevelMax     = 90
	genshinCharacterPromotedMark = "+"
	genshinMonsterLevelMin       = 1
	genshinMonsterLevelMax       = 100

	genshinMaxEmptySkillDesc = 2
)

func Generate(targetDir string, localResPath string, resURL string) {
	//文件完整路径
	var (
		pathDir = targetDir

		pathAvatarFile         = pathDir + pathSlash + fileAvatar
		pathWeaponFile         = pathDir + pathSlash + fileWeapon
		pathReliquaryAffixFile = pathDir + pathSlash + fileReliquaryAffix
		pathReliquaryMainFile  = pathDir + pathSlash + fileReliquaryMain
		pathReliquarySetFile   = pathDir + pathSlash + fileReliquarySet
		pathAvatarSkillsFile   = pathDir + pathSlash + fileAvatarSkills
		pathMonsterFile        = pathDir + pathSlash + fileMonster
	)
	//下载URL初始化
	dataJSONURLMap = map[string]string{
		indexAvatarExcelConfig:              resURL + AvatarExcelConfigData,
		indexAvatarCurveExcelConfig:         resURL + AvatarCurveExcelConfigData,
		indexAvatarPromoteExcelConfig:       resURL + AvatarPromoteExcelConfigData,
		indexWeaponExcelConfig:              resURL + WeaponExcelConfigData,
		indexWeaponCurveExcelConfig:         resURL + WeaponCurveExcelConfigData,
		indexWeaponPromoteExcelConfig:       resURL + WeaponPromoteExcelConfigData,
		indexEquipAffixExcelConfig:          resURL + EquipAffixExcelConfigData,
		indexReliquaryExcelConfigData:       resURL + ReliquaryExcelConfigData,
		indexReliquaryAffixExcelConfig:      resURL + ReliquaryAffixExcelConfigData,
		indexReliquaryLevelExcelConfig:      resURL + ReliquaryLevelExcelConfigData,
		indexReliquarySetExcelConfig:        resURL + ReliquarySetExcelConfigData,
		indexReliquaryCodexExcelConfig:      resURL + ReliquaryCodexExcelConfigData,
		indexMonsterExcelConfig:             resURL + MonsterExcelConfigData,
		indexMonsterDescribeExcelConfigData: resURL + MonsterDescribeExcelConfigData,
		indexMonsterTitleExcelConfigData:    resURL + MonsterTitleExcelConfigData,
		indexMonsterCurveExcelConfig:        resURL + MonsterCurveExcelConfigData,
		indexAvatarSkillDepotExcelConfig:    resURL + AvatarSkillDepotExcelConfigData,
		indexAvatarSkillExcelConfig:         resURL + AvatarSkillExcelConfigData,
		indexProudSkillExcelConfig:          resURL + ProudSkillExcelConfigData,
		indexAvatarTalentExcelConfig:        resURL + AvatarTalentExcelConfigData,
		indexFetterInfoExcelConfigData:      resURL + FetterInfoExcelConfigData,
		indexTextMapCHSFile:                 resURL + TextMapDataCHS,
		indexTextMapCHTFile:                 resURL + TextMapDataCHT,
		indexTextMapENFile:                  resURL + TextMapDataEN,
		indexTextMapJPFile:                  resURL + TextMapDataJP,
	}
	//文件列表初始化
	dataFileMap = map[string]FILEINFO{
		indexFileSaveDir:             {path: pathDir, class: typeDir, save: false},
		indexAvatarPath:              {path: pathAvatarFile, class: typeJs, save: true},
		indexAvatarSkillPath:         {path: pathAvatarSkillsFile, class: typeJs, save: false},
		indexWeaponPath:              {path: pathWeaponFile, class: typeJs, save: true},
		indexMonsterPath:             {path: pathMonsterFile, class: typeJs, save: true},
		indexReliquarySetExcelConfig: {path: pathReliquarySetFile, class: typeJs, save: true},
		indexReliquaryAffixPath:      {path: pathReliquaryAffixFile, class: typeJs, save: true},
		indexReliquaryMainPath:       {path: pathReliquaryMainFile, class: typeJs, save: true},
	}
	//序列化列表
	dataSaveObjMap = map[string]interface{}{
		pathAvatarFile:         &dataAvatarMap,
		pathAvatarSkillsFile:   &dataAvatarSkillsMap,
		pathWeaponFile:         &dataWeaponMap,
		pathMonsterFile:        &dataMonsterMap,
		pathReliquarySetFile:   &dataReliquarySetMap,
		pathReliquaryAffixFile: &dataReliquaryAffixMap,
		pathReliquaryMainFile:  &dataReliquaryMainMap,
	}
	//角色对应初始化
	dataAvatarMap = make(map[uint64]*AVATAR)
	//人物技能对应初始化
	dataAvatarSkillsMap = make(map[uint64]*AVATARSKILLS)
	//武器对应初始化
	dataWeaponMap = make(map[uint64]*WEAPON)
	//怪物对应初始化
	dataMonsterMap = make(map[uint64]*MONSTER)
	//圣遗物套装
	dataReliquarySetMap = make(map[uint64]*RELIQUARY)
	//圣遗物词条刻度
	dataReliquaryAffixMap = make(map[string][]float64)
	//圣遗物主词条值
	dataReliquaryMainMap = make(map[string]float64)

	//初始化
	err := initialize(localResPath, resURL)
	if err != nil {
		fmt.Println(err)
	}
}

func initialize(localResPath string, resURL string) (err error) {
	//检查目录是否存在
	for _, v := range dataFileMap {
		if v.class == typeDir {
			_, er := os.Stat(v.path)
			if er != nil {
				if os.IsNotExist(er) {
					os.MkdirAll(v.path, 0777)
					continue
				}
			}
		}
	}
	// //繁简转换初始化
	// t2s, err = gocc.New("t2s")
	// if err != nil {
	// 	return err
	// }

	return getDataFromRepository(localResPath, resURL)
}

//更新
func update(localResPath string, resURL string) error {
	//仓库JSON文件缓存
	repositoryJSON := make(map[string]*bytes.Buffer)
	for i, v := range dataJSONURLMap {
		var temp *bytes.Buffer
		var err error
		if len(localResPath) > 0 {
			temp, err = getLocalJSON(strings.Replace(v, resURL, localResPath, -1))
		} else {
			temp, err = getJSON(v)
		}
		if err != nil {
			return err
		}
		repositoryJSON[i] = temp
	}
	//人物
	avatarBaseDataList := make(GenshinAvatarBaseListData, 0)
	avatarGrowCurvesDataList := make(GenshinGrowCurvesListData, 0)
	avatarPromoteDataList := make(GenshinPromoteListData, 0)
	//人物技能
	avatarSkillsDataList := make(GenshinAvatarSkillsListData, 0)
	avatarSkillDataList := make(GenshinAvatarSkillListData, 0)
	avatarProudSkillDataList := make(GenshinAvatarProudSkillListData, 0)
	avatarTalentDataList := make(GenshinAvatarTalentListData, 0)
	fetterInfoDataList := make(GenshinFetterInfoDataList, 0)
	//武器
	weaponBaseDataList := make(GenshinWeaponBaseListData, 0)
	weaponGrowCurvesDataList := make(GenshinGrowCurvesListData, 0)
	weaponPromoteDataList := make(GenshinPromoteListData, 0)
	weaponSkillAffixDataList := make(GenshinSkillAffixListData, 0)
	//怪物
	monsterBaseDataList := make(GenshinMonsterBaseListData, 0)
	monsterDescribeDataList := make(GenshinMonsterDescribeListData, 0)
	monsterTitleDataList := make(GenshinMonsterTitleListData, 0)
	monsterGrowCurvesDataList := make(GenshinGrowCurvesListData, 0)
	//圣遗物
	reliquaryDataList := make(GenshinReliquaryListData, 0)
	reliquarySetDataList := make(GenshinReliquarySetListData, 0)
	reliquarySetAffixDataList := make(GenshinReliquarySetAffixListData, 0)
	reliquaryAffixDataList := make(GenshinReliquaryAffixListData, 0)
	reliquaryMainDataList := make(GenshinReliquaryMainListData, 0)
	reliquaryCodexDataList := make(GenshinReliquaryCodexListData, 0)
	//文字对应
	textMapCHS := make(map[uint64]string)
	textMapCHT := make(map[uint64]string)
	textMapEN := make(map[uint64]string)
	textMapJP := make(map[uint64]string)
	//文字合集
	textMap := make(map[string]map[uint64]string)
	for _, v := range sysLanguage {
		switch v {
		case languageCHS:
			textMap[v] = textMapCHS
		case languageCHT:
			textMap[v] = textMapCHT
		case languageEN:
			textMap[v] = textMapEN
		case languageJP:
			textMap[v] = textMapJP
		}
	}
	//额外
	extraCharacterMap := make(GenshinExtraAvatarMapData)
	err := readMapFormLocal(pathLocalCharacterExtra, &extraCharacterMap)
	if err != nil {
		return err
	}

	for i, v := range repositoryJSON {
		switch i {
		case indexAvatarExcelConfig:
			json.Unmarshal(v.Bytes(), &avatarBaseDataList)
		case indexAvatarCurveExcelConfig:
			json.Unmarshal(v.Bytes(), &avatarGrowCurvesDataList)
		case indexAvatarPromoteExcelConfig:
			json.Unmarshal(v.Bytes(), &avatarPromoteDataList)
		case indexWeaponExcelConfig:
			json.Unmarshal(v.Bytes(), &weaponBaseDataList)
		case indexWeaponCurveExcelConfig:
			json.Unmarshal(v.Bytes(), &weaponGrowCurvesDataList)
		case indexWeaponPromoteExcelConfig:
			json.Unmarshal(v.Bytes(), &weaponPromoteDataList)
		case indexEquipAffixExcelConfig:
			json.Unmarshal(v.Bytes(), &weaponSkillAffixDataList)
			json.Unmarshal(v.Bytes(), &reliquarySetAffixDataList)
		case indexReliquaryExcelConfigData:
			json.Unmarshal(v.Bytes(), &reliquaryDataList)
		case indexReliquarySetExcelConfig:
			json.Unmarshal(v.Bytes(), &reliquarySetDataList)
		case indexReliquaryAffixExcelConfig:
			json.Unmarshal(v.Bytes(), &reliquaryAffixDataList)
		case indexReliquaryLevelExcelConfig:
			json.Unmarshal(v.Bytes(), &reliquaryMainDataList)
		case indexReliquaryCodexExcelConfig:
			json.Unmarshal(v.Bytes(), &reliquaryCodexDataList)
		case indexMonsterExcelConfig:
			json.Unmarshal(v.Bytes(), &monsterBaseDataList)
		case indexMonsterDescribeExcelConfigData:
			json.Unmarshal(v.Bytes(), &monsterDescribeDataList)
		case indexMonsterTitleExcelConfigData:
			json.Unmarshal(v.Bytes(), &monsterTitleDataList)
		case indexMonsterCurveExcelConfig:
			json.Unmarshal(v.Bytes(), &monsterGrowCurvesDataList)
		case indexAvatarSkillDepotExcelConfig:
			json.Unmarshal(v.Bytes(), &avatarSkillsDataList)
		case indexAvatarSkillExcelConfig:
			json.Unmarshal(v.Bytes(), &avatarSkillDataList)
		case indexProudSkillExcelConfig:
			json.Unmarshal(v.Bytes(), &avatarProudSkillDataList)
		case indexAvatarTalentExcelConfig:
			json.Unmarshal(v.Bytes(), &avatarTalentDataList)
		case indexFetterInfoExcelConfigData:
			json.Unmarshal(v.Bytes(), &fetterInfoDataList)
		case indexTextMapCHSFile:
			json.Unmarshal(v.Bytes(), &textMapCHS)
		case indexTextMapCHTFile:
			json.Unmarshal(v.Bytes(), &textMapCHT)
		case indexTextMapENFile:
			json.Unmarshal(v.Bytes(), &textMapEN)
		case indexTextMapJPFile:
			json.Unmarshal(v.Bytes(), &textMapJP)
		}
	}
	//数据处理
	textMapCHS[0] = ""
	textMapCHT[0] = ""
	textMapEN[0] = ""
	textMapJP[0] = ""
	//人物
	avatarGrowCurvesDataMap := make(map[int]*GenshinGrowCurvesData)
	avatarPromoteDataMap := make(map[uint64][]*GenshinPromoteData)
	avatarCurvesIndexMap := make(map[string]int)
	for i := range avatarGrowCurvesDataList {
		avatarGrowCurvesDataMap[avatarGrowCurvesDataList[i].Level] = &avatarGrowCurvesDataList[i]
	}
	for i, v := range avatarGrowCurvesDataMap[1].CurveInfos {
		avatarCurvesIndexMap[v.Type] = i
	}
	for i := range avatarPromoteDataList {
		temp, ok := avatarPromoteDataMap[avatarPromoteDataList[i].AvatarPromoteId]
		if !ok {
			temp = make([]*GenshinPromoteData, 0)
		}
		avatarPromoteDataMap[avatarPromoteDataList[i].AvatarPromoteId] = append(temp, &avatarPromoteDataList[i])
	}
	//武器
	weaponGrowCurvesDataMap := make(map[int]*GenshinGrowCurvesData)
	weaponPromoteDataMap := make(map[uint64][]*GenshinPromoteData)
	weaponCurvesIndexMap := make(map[string]int)
	for i := range weaponGrowCurvesDataList {
		weaponGrowCurvesDataMap[weaponGrowCurvesDataList[i].Level] = &weaponGrowCurvesDataList[i]
	}
	for i, v := range weaponGrowCurvesDataMap[1].CurveInfos {
		weaponCurvesIndexMap[v.Type] = i
	}
	for i := range weaponPromoteDataList {
		temp, ok := weaponPromoteDataMap[weaponPromoteDataList[i].WeaponPromoteId]
		if !ok {
			temp = make([]*GenshinPromoteData, 0)
		}
		weaponPromoteDataMap[weaponPromoteDataList[i].WeaponPromoteId] = append(temp, &weaponPromoteDataList[i])
	}
	//武器特效
	weaponSkillAffixDataMap := make(map[uint64]map[string]SKILLAFFIX)
	for i := range weaponSkillAffixDataList {
		_, ok := weaponSkillAffixDataMap[weaponSkillAffixDataList[i].Id]
		if !ok {
			weaponSkillAffixDataMap[weaponSkillAffixDataList[i].Id] = make(map[string]SKILLAFFIX)
		}
		weaponSkillAffixDataMap[weaponSkillAffixDataList[i].Id][fmt.Sprintf(configWeaponAffixLevelFormat, weaponSkillAffixDataList[i].Level+1)] =
			SKILLAFFIX{
				GenshinSkillAffixData: weaponSkillAffixDataList[i],
				Name:                  getTextFromHash(weaponSkillAffixDataList[i].NameTextMapHash, textMap, false),
				Desc:                  getRegxTextFromHash(weaponSkillAffixDataList[i].DescTextMapHash, textMap, false),
				ParamValidIndexs:      calWeaponNoLevelValidParamIndexs(weaponSkillAffixDataList[i].ParamList),
			}
	}
	//圣遗物
	for i := range reliquaryAffixDataList {
		if reliquaryAffixDataList[i].DepotId != genshinArtiDepotId {
			continue
		}
		temp, have := dataReliquaryAffixMap[reliquaryAffixDataList[i].PropType]
		if !have {
			temp = make([]float64, 0)
		}
		dataReliquaryAffixMap[reliquaryAffixDataList[i].PropType] = append(temp, reliquaryAffixDataList[i].PropValue)
	}
	for i := len(reliquaryMainDataList) - 1; i >= 0; i-- {
		if reliquaryMainDataList[i].Level == genshinArtiLeveL {
			for ii := range reliquaryMainDataList[i].AddProps {
				dataReliquaryMainMap[reliquaryMainDataList[i].AddProps[ii].PropType] = reliquaryMainDataList[i].AddProps[ii].Value
			}
			break
		}
	}
	reliquarySetDataMap := make(map[uint64]*GenshinReliquarySetData)
	reliquarySetAffixMap := make(map[uint64][]*RELIQUARYAFFIX)
	for i := range reliquarySetDataList {
		reliquarySetDataMap[reliquarySetDataList[i].SetId] = &reliquarySetDataList[i]
	}
	for i := range reliquarySetAffixDataList {
		_, ok := reliquarySetAffixMap[reliquarySetAffixDataList[i].Id]
		if !ok {
			reliquarySetAffixMap[reliquarySetAffixDataList[i].Id] = make([]*RELIQUARYAFFIX, 0)
		}
		reliquarySetAffixMap[reliquarySetAffixDataList[i].Id] = append(reliquarySetAffixMap[reliquarySetAffixDataList[i].Id], &RELIQUARYAFFIX{
			Name:             getTextFromHash(reliquarySetAffixDataList[i].NameTextMapHash, textMap, false),
			Desc:             getRegxTextFromHash(reliquarySetAffixDataList[i].DescTextMapHash, textMap, false),
			NameTextMapHash:  reliquarySetAffixDataList[i].NameTextMapHash,
			DescTextMapHash:  reliquarySetAffixDataList[i].DescTextMapHash,
			Level:            reliquarySetAffixDataList[i].Level + 1,
			AddProps:         reliquarySetAffixDataList[i].AddProps,
			ParamList:        reliquarySetAffixDataList[i].ParamList,
			ParamValidIndexs: calWeaponNoLevelValidParamIndexs(reliquarySetAffixDataList[i].ParamList),
		})
	}
	reliquaryCodexDataMap := make(map[uint64][]*GenshinReliquaryCodexData)
	for i := range reliquaryCodexDataList {
		_, exit := reliquaryCodexDataMap[reliquaryCodexDataList[i].SuitId]
		if !exit {
			reliquaryCodexDataMap[reliquaryCodexDataList[i].SuitId] = make([]*GenshinReliquaryCodexData, 0)
		}
		reliquaryCodexDataMap[reliquaryCodexDataList[i].SuitId] = append(reliquaryCodexDataMap[reliquaryCodexDataList[i].SuitId], &reliquaryCodexDataList[i])
	}
	for i := range reliquaryDataList {
		setId := reliquaryDataList[i].SetId
		//仅5星
		if reliquaryDataList[i].RankLevel != 5 {
			continue
		}
		equipAffixId := reliquarySetDataMap[setId].EquipAffixId
		list, ok := reliquaryCodexDataMap[setId]
		if !ok {
			continue
		}
		hasFive := false
		for i := range list {
			if list[i].Level == 5 {
				hasFive = true
				break
			}
		}
		if !hasFive {
			continue
		}
		if equipAffixId == 0 {
			continue
		}
		_, ok = dataReliquarySetMap[setId]
		if ok {
			continue
		}

		dataReliquarySetMap[setId] = &RELIQUARY{
			SetId:           setId,
			RankLevel:       reliquaryDataList[i].RankLevel,
			EquipAffixId:    equipAffixId,
			NameTextMapHash: reliquarySetAffixMap[equipAffixId][0].NameTextMapHash,
			SetName:         reliquarySetAffixMap[equipAffixId][0].Name,
			SetAffixs:       reliquarySetAffixMap[equipAffixId],
			Images: RELIQUARYIMAGES{
				Icon: fmt.Sprintf(imgHostEquipFormat, imgRelicIconPrefix+strconv.FormatUint(setId, 10)+imgRelicIconSuffix),
			},
		}
	}
	//怪物
	monsterGrowCurvesDataMap := make(map[int]*GenshinGrowCurvesData)
	for i := range monsterGrowCurvesDataList {
		monsterGrowCurvesDataMap[monsterGrowCurvesDataList[i].Level] = &monsterGrowCurvesDataList[i]
	}
	monsterCurvesIndexMap := make(map[string]int)
	for i, v := range monsterGrowCurvesDataMap[1].CurveInfos {
		monsterCurvesIndexMap[v.Type] = i
	}
	monsterBaseDataMap := make(map[uint64]*GenshinMonsterBaseData)
	for i, v := range monsterBaseDataList {
		monsterBaseDataMap[v.Id] = &monsterBaseDataList[i]
	}
	monsterDescribeDataMap := make(map[uint64]*GenshinMonsterDescribeData)
	for i, v := range monsterDescribeDataList {
		monsterDescribeDataMap[v.Id] = &monsterDescribeDataList[i]
	}
	monsterTitleDataMap := make(map[uint64]*GenshinMonsterTitleData)
	for i, v := range monsterTitleDataList {
		monsterTitleDataMap[v.TitleID] = &monsterTitleDataList[i]
	}
	//人物技能
	avatarSkillsDataMap := make(map[uint64]*GenshinAvatarSkillsData)
	avatarSkillDataMap := make(map[uint64]*GenshinAvatarSkillData)
	avatarProudSkillDataMap := make(map[uint64][]*GenshinAvatarProudSkillData)
	avatarTalentDataMap := make(map[uint64]*GenshinAvatarTalentData)
	fetterInfoDataMap := make(map[uint64]*GenshinFetterInfoData)
	//处理用
	avatarProudSkillParamDataMap := make(map[uint64]map[string][]float64)
	//数据处理
	avatarProudSkillDataMap[0] = []*GenshinAvatarProudSkillData{
		{
			ParamList:     make([]float64, 0),
			ParamDescList: make([]uint64, 0),
		},
	}
	for i := range avatarSkillsDataList {
		avatarSkillsDataMap[avatarSkillsDataList[i].Id] = &avatarSkillsDataList[i]
	}
	for i := range avatarSkillDataList {
		avatarSkillDataMap[avatarSkillDataList[i].Id] = &avatarSkillDataList[i]
	}
	for i := range avatarProudSkillDataList {
		_, exit := avatarProudSkillDataMap[avatarProudSkillDataList[i].ProudSkillGroupId]
		if !exit {
			avatarProudSkillParamDataMap[avatarProudSkillDataList[i].ProudSkillGroupId] = make(map[string][]float64, 0)
			avatarProudSkillDataMap[avatarProudSkillDataList[i].ProudSkillGroupId] = make([]*GenshinAvatarProudSkillData, 0)
		}
		avatarProudSkillDataMap[avatarProudSkillDataList[i].ProudSkillGroupId] = append(avatarProudSkillDataMap[avatarProudSkillDataList[i].ProudSkillGroupId], &avatarProudSkillDataList[i])
		avatarProudSkillParamDataMap[avatarProudSkillDataList[i].ProudSkillGroupId][fmt.Sprintf(configSkillLevelFormat, avatarProudSkillDataList[i].Level)] = avatarProudSkillDataList[i].ParamList
	}
	for i := range avatarTalentDataList {
		avatarTalentDataMap[avatarTalentDataList[i].TalentId] = &avatarTalentDataList[i]
	}
	for i := range avatarSkillsDataMap {
		temp := avatarSkillsDataMap[i]
		if temp.Skills[1] == uint64(0) || temp.EnergySkill == uint64(0) {
			continue
		}
		normalParamDescList := getRegxTextsFromHash(avatarProudSkillDataMap[avatarSkillDataMap[temp.Skills[0]].ProudSkillGroupId][0].ParamDescList, textMap, false)
		skillParamDescList := getRegxTextsFromHash(avatarProudSkillDataMap[avatarSkillDataMap[temp.Skills[1]].ProudSkillGroupId][0].ParamDescList, textMap, false)
		burstParamDescList := getRegxTextsFromHash(avatarProudSkillDataMap[avatarSkillDataMap[temp.EnergySkill].ProudSkillGroupId][0].ParamDescList, textMap, false)
		dataAvatarSkillsMap[temp.Id] = &AVATARSKILLS{
			Id: temp.Id,
			Normal: AVATARSKILLINFO{
				Id:                   avatarSkillDataMap[temp.Skills[0]].Id,
				Name:                 getTextFromHash(avatarSkillDataMap[temp.Skills[0]].NameTextMapHash, textMap, false),
				Desc:                 getRegxTextFromHash(avatarSkillDataMap[temp.Skills[0]].DescTextMapHash, textMap, false),
				Icon:                 avatarSkillDataMap[temp.Skills[0]].SkillIcon,
				ParamDescList:        normalParamDescList,
				ParamMap:             avatarProudSkillParamDataMap[avatarSkillDataMap[temp.Skills[0]].ProudSkillGroupId],
				ParamDescSplitedList: calParamDesc(normalParamDescList),
				ProudSkillGroupId:    avatarSkillDataMap[temp.Skills[0]].ProudSkillGroupId,
				Images: SKILLIMAGES{
					Icon: fmt.Sprintf(imgHostOhterFormat, avatarSkillDataMap[temp.Skills[0]].SkillIcon),
				},
			},
			Skill: AVATARSKILLINFO{
				Id:                   avatarSkillDataMap[temp.Skills[1]].Id,
				Name:                 getTextFromHash(avatarSkillDataMap[temp.Skills[1]].NameTextMapHash, textMap, false),
				Desc:                 getRegxTextFromHash(avatarSkillDataMap[temp.Skills[1]].DescTextMapHash, textMap, false),
				Icon:                 avatarSkillDataMap[temp.Skills[1]].SkillIcon,
				ParamDescList:        skillParamDescList,
				ParamMap:             avatarProudSkillParamDataMap[avatarSkillDataMap[temp.Skills[1]].ProudSkillGroupId],
				ParamDescSplitedList: calParamDesc(skillParamDescList),
				ProudSkillGroupId:    avatarSkillDataMap[temp.Skills[1]].ProudSkillGroupId,
				Images: SKILLIMAGES{
					Icon: fmt.Sprintf(imgHostOhterFormat, avatarSkillDataMap[temp.Skills[1]].SkillIcon),
				},
			},
			ElementalBurst: AVATARSKILLINFO{
				Id:                   avatarSkillDataMap[temp.EnergySkill].Id,
				Name:                 getTextFromHash(avatarSkillDataMap[temp.EnergySkill].NameTextMapHash, textMap, false),
				Desc:                 getRegxTextFromHash(avatarSkillDataMap[temp.EnergySkill].DescTextMapHash, textMap, false),
				Icon:                 avatarSkillDataMap[temp.EnergySkill].SkillIcon,
				ParamDescList:        burstParamDescList,
				ParamMap:             avatarProudSkillParamDataMap[avatarSkillDataMap[temp.EnergySkill].ProudSkillGroupId],
				ParamDescSplitedList: calParamDesc(burstParamDescList),
				ProudSkillGroupId:    avatarSkillDataMap[temp.EnergySkill].ProudSkillGroupId,
				Images: SKILLIMAGES{
					Icon: fmt.Sprintf(imgHostOhterFormat, avatarSkillDataMap[temp.EnergySkill].SkillIcon),
				},
			},
		}
		if temp.Skills[2] != 0 {
			paramDescList := getRegxTextsFromHash(avatarProudSkillDataMap[avatarSkillDataMap[temp.Skills[2]].ProudSkillGroupId][0].ParamDescList, textMap, false)
			dataAvatarSkillsMap[temp.Id].Other = AVATARSKILLINFO{
				Name:                 getTextFromHash(avatarSkillDataMap[temp.Skills[2]].NameTextMapHash, textMap, false),
				Desc:                 getRegxTextFromHash(avatarSkillDataMap[temp.Skills[2]].DescTextMapHash, textMap, false),
				Icon:                 avatarSkillDataMap[temp.Skills[2]].SkillIcon,
				ParamDescList:        paramDescList,
				ParamMap:             avatarProudSkillParamDataMap[avatarSkillDataMap[temp.Skills[2]].ProudSkillGroupId],
				ParamDescSplitedList: calParamDesc(paramDescList),
				Images: SKILLIMAGES{
					Icon: fmt.Sprintf(imgHostOhterFormat, avatarSkillDataMap[temp.Skills[2]].SkillIcon),
				},
			}
		}
		for ii := range temp.InherentProudSkillOpens {
			temp2 := temp.InherentProudSkillOpens[ii]
			if temp2.ProudSkillGroupId == 0 {
				continue
			}
			dataAvatarSkillsMap[temp.Id].ProudSkills = append(dataAvatarSkillsMap[temp.Id].ProudSkills, AVATARSKILLINFO{
				Name:             getTextFromHash(avatarProudSkillDataMap[temp2.ProudSkillGroupId][0].NameTextMapHash, textMap, false),
				Desc:             getRegxTextFromHash(avatarProudSkillDataMap[temp2.ProudSkillGroupId][0].DescTextMapHash, textMap, false),
				Icon:             avatarProudSkillDataMap[temp2.ProudSkillGroupId][0].Icon,
				ParamMap:         avatarProudSkillParamDataMap[temp2.ProudSkillGroupId],
				ParamValidIndexs: calCharacterNoLevelValidParamIndexs(avatarProudSkillParamDataMap[temp2.ProudSkillGroupId]),
				Images: SKILLIMAGES{
					Icon: fmt.Sprintf(imgHostOhterFormat, avatarProudSkillDataMap[temp2.ProudSkillGroupId][0].Icon),
				},
			})
		}
		for ii := range temp.Talents {
			temp2 := temp.Talents[ii]
			if temp2 == 0 {
				continue
			}
			tempParamMap := map[string][]float64{
				fmt.Sprintf(configSkillLevelFormat, 1): avatarTalentDataMap[temp2].ParamList,
			}
			dataAvatarSkillsMap[temp.Id].Talents = append(dataAvatarSkillsMap[temp.Id].Talents, AVATARSKILLINFO{
				Name:             getTextFromHash(avatarTalentDataMap[temp2].NameTextMapHash, textMap, false),
				Desc:             getRegxTextFromHash(avatarTalentDataMap[temp2].DescTextMapHash, textMap, false),
				Icon:             avatarTalentDataMap[temp2].Icon,
				ParamMap:         tempParamMap,
				ParamValidIndexs: calCharacterNoLevelValidParamIndexs(tempParamMap),
				Images: SKILLIMAGES{
					Icon: fmt.Sprintf(imgHostOhterFormat, avatarTalentDataMap[temp2].Icon),
				},
			})
		}
	}
	for i := range fetterInfoDataList {
		fetterInfoDataMap[fetterInfoDataList[i].AvatarId] = &fetterInfoDataList[i]
	}
	//计算
	//人物
	for i := range avatarBaseDataList {
		currentAvatarData := &avatarBaseDataList[i]
		//过滤
		nameText := getTextFromHash(currentAvatarData.NameTextMapHash, textMap, false)
		descText := getRegxTextFromHash(currentAvatarData.DescTextMapHash, textMap, false)
		if descText[languageCHS] == "" {
			continue
		}
		currentFetterInfo := fetterInfoDataMap[currentAvatarData.Id]
		elementTypeTexts := getTextFromHash(currentFetterInfo.AvatarVisionBeforTextMapHash, textMap, false)
		elementType := elementTypeMap[elementTypeTexts[languageCHS]]
		fetterInfo := FETTERINFO{
			BirthMonth:        currentFetterInfo.InfoBirthMonth,
			BirthDay:          currentFetterInfo.InfoBirthDay,
			BackgroundText:    getTextFromHash(currentFetterInfo.AvatarNativeTextMapHash, textMap, false),
			ConstellationName: getTextFromHash(currentFetterInfo.AvatarConstellationBeforTextMapHash, textMap, false),
			TiltleName:        getTextFromHash(currentFetterInfo.AvatarTitleTextMapHash, textMap, false),
			DetailText:        getTextFromHash(currentFetterInfo.AvatarDetailTextMapHash, textMap, false),
			Assoc:             strings.TrimPrefix(currentFetterInfo.AvatarAssocType, assocTypePrefix),
			ElementText:       elementTypeTexts,
			ElementType:       elementType,
		}
		//创建
		dataAvatarMap[currentAvatarData.Id] = &AVATAR{
			Id:              currentAvatarData.Id,
			Name:            nameText,
			NameTextMapHash: currentAvatarData.NameTextMapHash,
			Desc:            descText,
			DescTextMapHash: currentAvatarData.DescTextMapHash,
			IconName:        currentAvatarData.IconName,
			WeaponType:      currentAvatarData.WeaponType,
			Images: AVATARIMAGES{
				Icon:       fmt.Sprintf(imgHostAvatarFormat, currentAvatarData.IconName),
				Background: extraCharacterMap[nameText[languageCHS]].BackgroundUrl,
			},
			LevelMap:     make(map[string]*PROPERTY),
			SkillDepotId: currentAvatarData.SkillDepotId,
			QualityType:  currentAvatarData.QualityType,
			SideIconName: currentAvatarData.SideIconName,
			Info:         fetterInfo,
		}
		//技能
		if _, exit := dataAvatarSkillsMap[currentAvatarData.SkillDepotId]; exit {
			dataAvatarMap[currentAvatarData.Id].Skills = *dataAvatarSkillsMap[currentAvatarData.SkillDepotId]
		}
		//级别曲线参数
		var hpTypeIndex int
		var attackTypeIndex int
		var defenseTypeIndex int
		for _, vv := range currentAvatarData.PropGrowCurves {
			switch vv.Type {
			case HP_BASE:
				hpTypeIndex = avatarCurvesIndexMap[vv.Value]
			case ATTACK_BASE:
				attackTypeIndex = avatarCurvesIndexMap[vv.Value]
			case DEFENSE_BASE:
				defenseTypeIndex = avatarCurvesIndexMap[vv.Value]
			}
		}
		for ii := genshinCharacterLevelMin; ii <= genshinCharacterLevelMax; ii++ {
			currentProperty := &PROPERTY{
				Hp:              currentAvatarData.HpBase,
				Attack:          currentAvatarData.AttackBase,
				Defense:         currentAvatarData.DefenseBase,
				Crit_rate:       currentAvatarData.Critical,
				Crit_dmg:        currentAvatarData.CriticalHurt,
				Energy_recharge: currentAvatarData.ChargeEfficiency,
			}
			currentProperty.Level = ii
			//此等级数值
			currentProperty.Hp *= avatarGrowCurvesDataMap[ii].CurveInfos[hpTypeIndex].Value
			currentProperty.Attack *= avatarGrowCurvesDataMap[ii].CurveInfos[attackTypeIndex].Value
			currentProperty.Defense *= avatarGrowCurvesDataMap[ii].CurveInfos[defenseTypeIndex].Value

			dataAvatarMap[currentAvatarData.Id].LevelMap[fmt.Sprintf(configAvatarLevelFormat, ii)] = currentProperty
		}
		//突破参数
		list := avatarPromoteDataMap[currentAvatarData.AvatarPromoteId]
		var currentProperty *PROPERTY
		var addPropNames []string = make([]string, 0)
		for _, vv := range list[0].AddProps {
			tempName := GetNameFromTypeCode(vv.PropType)
			addPropNames = append(addPropNames, tempName)
		}

		for ii := len(list) - 1; ii > 0; ii-- {
			currentPromote := list[ii]
			requiredLevel := list[ii-1].UnlockMaxLevel
			unlockMaxLevel := currentPromote.UnlockMaxLevel

			for iii := unlockMaxLevel; iii >= requiredLevel; iii-- {
				currentProperty = dataAvatarMap[currentAvatarData.Id].LevelMap[fmt.Sprintf(configAvatarLevelFormat, iii)]
				//突破界限
				if iii == requiredLevel {
					newCurrentProperty := &PROPERTY{}
					dataAvatarMap[currentAvatarData.Id].LevelMap[fmt.Sprintf(configAvatarLevelFormat, iii)+genshinCharacterPromotedMark] = newCurrentProperty
					copyStruct(newCurrentProperty, currentProperty)
					currentProperty = newCurrentProperty
				}
				currentProperty.PromoteLevel += float64(currentPromote.PromoteLevel)
				temp := reflect.ValueOf(currentProperty).Elem()
				for iiii := range addPropNames {
					temp.FieldByName(addPropNames[iiii]).SetFloat(temp.FieldByName(addPropNames[iiii]).Float() + currentPromote.AddProps[iiii].Value)
				}
			}
		}
		//旅行者
		if len(currentAvatarData.CandSkillDepotIds) > 0 {
			for _, depotId := range currentAvatarData.CandSkillDepotIds {
				if _, exit := dataAvatarSkillsMap[depotId]; !exit {
					continue
				}
				newId, err := strconv.ParseUint(strconv.FormatUint(currentAvatarData.Id, 10)+strconv.FormatUint(depotId, 10), 10, 64)
				if err != nil {
					continue
				}
				currentFetterInfo := fetterInfo
				currentFetterInfo.ElementType = int(depotId) % 100
				currentFetterInfo.ElementText = *elementMap[currentFetterInfo.ElementType]
				dataAvatarMap[newId] = &AVATAR{
					Id:              newId,
					Name:            nameText,
					NameTextMapHash: currentAvatarData.NameTextMapHash,
					Desc:            descText,
					DescTextMapHash: currentAvatarData.DescTextMapHash,
					IconName:        currentAvatarData.IconName,
					WeaponType:      currentAvatarData.WeaponType,
					Images: AVATARIMAGES{
						Icon:       fmt.Sprintf(imgHostAvatarFormat, currentAvatarData.IconName),
						Background: extraCharacterMap[nameText[languageCHS]].BackgroundUrl,
					},
					LevelMap:     make(map[string]*PROPERTY),
					SkillDepotId: depotId,
					QualityType:  currentAvatarData.QualityType,
					SideIconName: currentAvatarData.SideIconName,
					Info:         currentFetterInfo,
				}
				//技能
				dataAvatarMap[newId].Skills = *dataAvatarSkillsMap[depotId]
				//等级
				dataAvatarMap[newId].LevelMap = dataAvatarMap[currentAvatarData.Id].LevelMap
			}
			delete(dataAvatarMap, currentAvatarData.Id)
		}
	}
	//武器
	for i := range weaponBaseDataList {
		currentWeaponData := &weaponBaseDataList[i]
		//过滤
		nameText := getTextFromHash(currentWeaponData.NameTextMapHash, textMap, false)
		descText := getRegxTextFromHash(currentWeaponData.DescTextMapHash, textMap, false)
		if currentWeaponData.RankLevel < genshinMinWeaponRankLevel {
			continue
		}
		if nameText[languageCHS] == "" || nameText[languageEN] == "" {
			continue
		}
		//创建
		dataWeaponMap[currentWeaponData.Id] = &WEAPON{
			Id:              currentWeaponData.Id,
			RankLevel:       currentWeaponData.RankLevel,
			Name:            nameText,
			NameTextMapHash: currentWeaponData.NameTextMapHash,
			Desc:            descText,
			DescTextMapHash: currentWeaponData.DescTextMapHash,
			IconName:        currentWeaponData.IconName,
			WeaponType:      currentWeaponData.WeaponType,
			Images: WEAPONIMAGES{
				Icon:       fmt.Sprintf(imgHostEquipFormat, currentWeaponData.IconName),
				Awakenicon: fmt.Sprintf(imgHostEquipFormat, currentWeaponData.IconName+imgAwakenSuffix),
			},
			SkillAffixMap: weaponSkillAffixDataMap[currentWeaponData.SkillAffix[0]],
			LevelMap:      make(map[string]*PROPERTY),
		}
		//级别曲线参数
		var weaponBaseAtkIndex int
		var weaponSubAffixIndex int
		var weaponSubAffixName string
		for _, vv := range currentWeaponData.PropGrowCurves {
			switch vv.PropType {
			case ATTACK_BASE:
				weaponBaseAtkIndex = weaponCurvesIndexMap[vv.Type]
			default:
				weaponSubAffixName = GetNameFromTypeCode(vv.PropType)
				weaponSubAffixIndex = weaponCurvesIndexMap[vv.Type]
			}
		}

		for ii := genshinCharacterLevelMin; ii <= genshinCharacterLevelMax; ii++ {
			currentProperty := &PROPERTY{
				Attack: currentWeaponData.PropGrowCurves[0].InitValue,
			}
			currentProperty.Level = ii
			//此等级数值
			currentProperty.Attack *= weaponGrowCurvesDataMap[ii].CurveInfos[weaponBaseAtkIndex].Value
			if len(weaponSubAffixName) != 0 {
				temp := reflect.ValueOf(currentProperty).Elem()
				temp.FieldByName(weaponSubAffixName).SetFloat(currentWeaponData.PropGrowCurves[1].InitValue * weaponGrowCurvesDataMap[ii].CurveInfos[weaponSubAffixIndex].Value)
			}

			dataWeaponMap[currentWeaponData.Id].LevelMap[fmt.Sprintf(configWeaponLevelFormat, ii)] = currentProperty
		}
		//突破参数
		list := weaponPromoteDataMap[currentWeaponData.WeaponPromoteId]
		var currentProperty *PROPERTY
		var addPropNames []string = make([]string, 0)
		for _, vv := range list[0].AddProps {
			tempName := GetNameFromTypeCode(vv.PropType)
			addPropNames = append(addPropNames, tempName)
		}

		for ii := len(list) - 1; ii > 0; ii-- {
			currentPromote := list[ii]
			requiredLevel := list[ii-1].UnlockMaxLevel
			unlockMaxLevel := currentPromote.UnlockMaxLevel

			for iii := unlockMaxLevel; iii >= requiredLevel; iii-- {
				currentProperty = dataWeaponMap[currentWeaponData.Id].LevelMap[fmt.Sprintf(configWeaponLevelFormat, iii)]
				//突破界限
				if iii == requiredLevel {
					newCurrentProperty := &PROPERTY{}
					dataWeaponMap[currentWeaponData.Id].LevelMap[fmt.Sprintf(configWeaponLevelFormat, iii)+genshinCharacterPromotedMark] = newCurrentProperty
					copyStruct(newCurrentProperty, currentProperty)
					currentProperty = newCurrentProperty
				}
				currentProperty.PromoteLevel += float64(currentPromote.PromoteLevel)
				temp := reflect.ValueOf(currentProperty).Elem()
				for iiii := range addPropNames {
					temp.FieldByName(addPropNames[iiii]).SetFloat(temp.FieldByName(addPropNames[iiii]).Float() + currentPromote.AddProps[iiii].Value)
				}
			}
		}
	}
	//怪物
	for i := range monsterBaseDataList {
		currentMonsterData := &monsterBaseDataList[i]
		if currentMonsterData.DescribeId == 0 ||
			strings.Contains(currentMonsterData.MonsterName, "Activity") ||
			strings.Contains(currentMonsterData.MonsterName, "Tutorial") ||
			strings.Contains(currentMonsterData.MonsterName, "Multi") ||
			strings.Contains(currentMonsterData.MonsterName, "Enhance") {
			continue
		}
		var monsterText map[string]string
		// var titleText map[string]string
		var currentDescribeObj *GenshinMonsterDescribeData
		var currentDescribeHas bool
		if currentDescribeObj, currentDescribeHas = monsterDescribeDataMap[currentMonsterData.DescribeId]; currentDescribeHas {
			monsterText = getTextFromHash(currentDescribeObj.NameTextMapHash, textMap, false)
			// if vv, hasTitleId := monsterTitleDataMap[v.TitleID]; hasTitleId {
			// 	titleText = getTextFromHash(vv.TitleNameTextMapHash, textMap, false)
			// 	for ii := range monsterText {
			// 		if titleText[ii] != monsterText[ii] {
			// 			monsterText[ii] += " " + titleText[ii]
			// 		}
			// 	}
			// }
			filterName := monsterText[languageCHS]
			if len(filterName) < 1 {
				continue
			}
		} else {
			continue
		}
		//过滤
		monsterTextTofilter := getTextFromHash(currentMonsterData.NameTextMapHash, textMap, true)
		filterName := monsterTextTofilter[languageCHT]
		if strings.Contains(filterName, "（") {
			continue
		}
		if currentMonsterData.Id%100 != 1 {
			var i uint64
			var isDuplicated bool
			for i = 1; i < currentMonsterData.Id%100; i++ {
				tempId := currentMonsterData.Id/100*100 + i
				if tempData, has := monsterBaseDataMap[tempId]; has {
					if currentMonsterData.HpBase == tempData.HpBase &&
						currentMonsterData.AttackBase == tempData.AttackBase &&
						currentMonsterData.DefenseBase == tempData.DefenseBase {
						isDuplicated = true
						break
					}
				}
			}
			if isDuplicated {
				continue
			}
		}
		//创建对象
		dataMonsterMap[currentMonsterData.Id] = &MONSTER{
			Id:              currentMonsterData.Id,
			Name:            monsterText,
			NameTextMapHash: currentMonsterData.NameTextMapHash,
			MonsterName:     currentMonsterData.MonsterName,
			Type:            currentMonsterData.Type,
			Images: MONSTERIMAGES{
				Icon: fmt.Sprintf(imgHostMonsterFormat, currentDescribeObj.Icon),
			},
			LevelMap: make(map[string]*MONSTERPROPERTY),
		}
		//级别曲线参数
		var hpTypeIndex int
		var attackTypeIndex int
		var defenseTypeIndex int
		for _, vv := range currentMonsterData.PropGrowCurves {
			switch vv.Type {
			case HP_BASE:
				hpTypeIndex = monsterCurvesIndexMap[vv.Value]
			case ATTACK_BASE:
				attackTypeIndex = monsterCurvesIndexMap[vv.Value]
			case DEFENSE_BASE:
				defenseTypeIndex = monsterCurvesIndexMap[vv.Value]
			}
		}
		for ii := genshinMonsterLevelMin; ii <= genshinMonsterLevelMax; ii++ {
			currentProperty := &MONSTERPROPERTY{
				Hp:      currentMonsterData.HpBase,
				Attack:  currentMonsterData.AttackBase,
				Defense: currentMonsterData.DefenseBase,
			}
			currentProperty.Level = ii
			//此等级数值
			currentProperty.Hp *= monsterGrowCurvesDataMap[ii].CurveInfos[hpTypeIndex].Value
			currentProperty.Attack *= monsterGrowCurvesDataMap[ii].CurveInfos[attackTypeIndex].Value
			currentProperty.Defense *= monsterGrowCurvesDataMap[ii].CurveInfos[defenseTypeIndex].Value
			//抗性
			currentProperty.Dmg_anti_cryo = currentMonsterData.GenshinSubHurtData.IceSubHurt
			currentProperty.Dmg_anti_anemo = currentMonsterData.GenshinSubHurtData.WindSubHurt
			currentProperty.Dmg_anti_physical = currentMonsterData.GenshinSubHurtData.PhysicalSubHurt
			currentProperty.Dmg_anti_electro = currentMonsterData.GenshinSubHurtData.ElecSubHurt
			currentProperty.Dmg_anti_geo = currentMonsterData.GenshinSubHurtData.RockSubHurt
			currentProperty.Dmg_anti_pyro = currentMonsterData.GenshinSubHurtData.FireSubHurt
			currentProperty.Dmg_anti_hydro = currentMonsterData.GenshinSubHurtData.WaterSubHurt
			currentProperty.Dmg_anti_dendro = currentMonsterData.GenshinSubHurtData.GrassSubHurt

			dataMonsterMap[currentMonsterData.Id].LevelMap[fmt.Sprintf(configMonsterLevelFormat, ii)] = currentProperty
		}
	}
	return nil
}

//结果保存至本地
func saveResult() error {
	for _, v := range dataFileMap {
		if v.save {
			content, err := json.Marshal(dataSaveObjMap[v.path])
			if err != nil {
				return err
			}
			err = writeToFile(v.path, bytes.NewBuffer(content))
			if err != nil {
				return err
			}
		}
	}
	return nil
}

//获取最新数据
func getDataFromRepository(localResPath string, resURL string) error {
	err := update(localResPath, resURL)
	if err != nil {
		return err
	}
	return saveResult()
}

//从本地读取已往结果
func readMapFormLocal(path string, targetObj interface{}) error {
	content := bytes.NewBuffer(make([]byte, 0, defaultBuffSize))
	err := readFromFile(path, content)
	if err != nil {
		return err
	}
	err = json.Unmarshal(content.Bytes(), targetObj)
	if err != nil {
		return err
	}
	return nil
}

//取得文字
func getTextFromHash(hash uint64, textMap map[string]map[uint64]string, useT2s bool) map[string]string {
	result := make(map[string]string)
	for _, v := range sysLanguage {
		if useT2s && v == languageCHS {
			result[v] = tTos(textMap[languageCHT][hash])
			continue
		}
		result[v] = textMap[v][hash]
	}
	return result
}

//取得文字(正规后)
func getRegxTextFromHash(hash uint64, textMap map[string]map[uint64]string, useT2s bool) map[string]string {
	result := make(map[string]string)
	for _, v := range sysLanguage {
		if useT2s && v == languageCHS {
			result[v] = htmlColorTag(tTos(textMap[languageCHT][hash]))
			continue
		}
		result[v] = htmlColorTag(textMap[v][hash])
	}
	return result
}

//取得文字(正规后)
func getRegxTextsFromHash(hashs []uint64, textMap map[string]map[uint64]string, useT2s bool) map[string][]string {
	result := make(map[string][]string)
	for _, v := range sysLanguage {
		result[v] = make([]string, 0)
		currentEmpty := 0
		for _, hash := range hashs {
			if useT2s && v == languageCHS {
				origin, exit := textMap[languageCHT][hash]
				if !exit || origin == "" {
					break
				}
				result[v] = append(result[v], htmlColorTag(tTos(origin)))
				continue
			}
			origin, exit := textMap[v][hash]
			if !exit || origin == "" {
				currentEmpty++
				if currentEmpty < genshinMaxEmptySkillDesc {
					continue
				}
				break
			}
			result[v] = append(result[v], htmlColorTag(origin))
		}
	}
	return result
}

//繁体转换
func tTos(in string) (out string) {
	// out, err := t2s.Convert(in)
	// if err != nil {
	// 	return ""
	// }
	out = in
	return
}

//技能描述解析
func calParamDesc(paramDescList map[string][]string) map[string][]AVATARSKILLSPLITEDDESCINFO {
	results := make(map[string][]AVATARSKILLSPLITEDDESCINFO)
	for i, v := range paramDescList {
		tempList := make([]AVATARSKILLSPLITEDDESCINFO, 0)
		for _, vv := range v {
			items := strings.Split(vv, "|")
			desc := items[0]
			valuePropIndexes := make([]int, 0)
			prefix := ""
			var middles []string
			suffix := ""
			isPercent := make([]bool, 0)

			valuePropIndexesReg := regexp.MustCompile(`param\d+`)
			for _, v := range valuePropIndexesReg.FindAllString(items[1], -1) {
				tempNum, _ := strconv.Atoi(strings.TrimPrefix(v, "param"))
				valuePropIndexes = append(valuePropIndexes, tempNum-1)
			}

			isPercentReg := regexp.MustCompile(`\{param\d+:.*?\}`)
			for _, v := range isPercentReg.FindAllString(items[1], -1) {
				isPercent = append(isPercent, strings.Contains(v, "P"))
			}

			others := isPercentReg.Split(items[1], -1)
			prefix = others[0]
			middles = others[1 : len(others)-1]
			suffix = others[len(others)-1]

			tempList = append(tempList, AVATARSKILLSPLITEDDESCINFO{
				Desc:            desc,
				ValuePropIndexs: valuePropIndexes,
				Prefix:          prefix,
				Middles:         middles,
				Suffix:          suffix,
				IsPercent:       isPercent,
			})
		}
		results[i] = tempList
	}

	return results

}

//无等级技能描述
func calCharacterNoLevelValidParamIndexs(paramMap map[string][]float64) []int {
	results := make([]int, 0)
	paramList := paramMap[fmt.Sprintf(configSkillLevelFormat, 1)]
	for i, v := range paramList {
		if v == 0 {
			if i == 0 {
				continue
			}
			break
		}
		results = append(results, i)
	}

	return results
}

//无等级技能描述
func calWeaponNoLevelValidParamIndexs(paramList []float64) []int {
	results := make([]int, 0)
	for i, v := range paramList {
		if v == 0 {
			if i == 0 {
				continue
			}
			break
		}
		results = append(results, i)
	}

	return results
}
