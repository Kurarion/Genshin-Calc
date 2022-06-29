import { Injectable } from '@angular/core';
import { ArtifactService, ArtifactStorageInfo, ArtifactStoragePartData, CharacterService, Const, EnemyService, EnkaAvatar, EnkaEquip, EnkaInfos, EnkaPlayer, ExtraDataService, GenshinDataService, GlobalProgressService, HttpService, OtherService, StorageService, WeaponService } from 'src/app/shared/shared.module';

export interface EnkaStorageData {
  uid?: string;
  name?: string;
  avatars?: string[];
}

const API_URL = [
  "https://enka.network/u/",
  "/__data.json",
]
const characterAscendLevels = [20, 40, 50, 60, 70, 80, 90];
const weaponAscendLevels = [20, 40, 50, 60, 70, 80, 90];
const enkaPropTypeMap = {
  "promoteLevel": "1002",
  "level": "4001"
}

@Injectable({
  providedIn: 'root'
})
export class EnkaService {

  //データマップ
  data!: EnkaStorageData;

  constructor(
    private globalProgressService: GlobalProgressService,
    private httpService: HttpService,
    private genshinDataService: GenshinDataService,
    private characterService: CharacterService,
    private weaponService: WeaponService,
    private artifactService: ArtifactService,
    private storageService: StorageService,
    ) { 
      let temp = this.storageService.getJSONItem(Const.SAVE_ENKA)
      if(temp){
        this.data = temp;
      }else{
        this.data = {};
      }
    }
  
  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_ENKA, this.data);
  }

  //データ取得
  getData(){
    return this.data;
  }

  //-----------------------------------------
  //-----------------------------------------
  //               データ処理
  //-----------------------------------------
  //-----------------------------------------
  //ユーザー情報取得
  getUIDInfos(uidStr: string): Promise<EnkaInfos|null>{
    let url = API_URL[0] + uidStr + API_URL[1];
    return this.httpService.get<EnkaInfos>(url);
  }

  //データセット
  async initEnkaData(uid: number|string){
    let uidStr = uid.toString();
    //ID保存
    this.data.uid = uidStr;
    this.data.name = "";
    this.data.avatars = [];
    //API送信
    let enka = await this.getUIDInfos(uidStr);
    //データ処理
    if(enka != null){
      this.initPlayer(enka.playerInfo);
      //プログレス更新
      this.globalProgressService.setValue(0);
      if(enka.avatarInfoList != undefined){
        let length = enka.avatarInfoList.length;
        for(let [i,info] of enka.avatarInfoList.entries()){
          this.initAvatar(info, 100/length * i, 100/length * (i + 1));
          this.data.avatars.push(info.avatarId.toString());
        }
      }
    }
    //ストレージに保存
    this.saveData();
  }

  //プレイヤーセット
  initPlayer(player: EnkaPlayer | undefined){
    //データ保存
    this.data.name = player?.nickname ?? "";
  }

  //キャラセット
  initAvatar(avatar: EnkaAvatar | undefined, minProgress: number, maxProgress: number){
    if(avatar == undefined){
      //プログレス更新
      this.globalProgressService.setValue(maxProgress);
      return;
    }
    //プログレス差
    let progressDiff = maxProgress - minProgress;
    //キー
    let avatarId = avatar.avatarId.toString();
    let avatarData = this.genshinDataService.getCharacter(avatarId);
    //キャラ基本属性
    let level: string;
    let normalLevel: string;
    let skillLevel: string;
    let elementalBurstLevel: string;

    let tempLevel = parseInt(avatar.propMap[enkaPropTypeMap.level].val);
    let tempPromoteLevel = parseInt(avatar.propMap[enkaPropTypeMap.promoteLevel].val);
    if(tempPromoteLevel == characterAscendLevels.indexOf(tempLevel)){
      //未突破
      level = avatar.propMap[enkaPropTypeMap.level].val;
    }else{
      //突破済み
      level = avatar.propMap[enkaPropTypeMap.level].val + "+";
    }
    normalLevel = avatar.skillLevelMap![avatarData.skills.normal.id].toString();
    skillLevel = avatar.skillLevelMap![avatarData.skills.skill.id].toString();
    elementalBurstLevel = avatar.skillLevelMap![avatarData.skills.elementalBurst.id].toString();
    //星座追加
    if(avatar.proudSkillExtraLevelMap != undefined){
      let map = avatar.proudSkillExtraLevelMap;
      if(avatarData.skills.normal.proudSkillGroupId in map){
        normalLevel += map[avatarData.skills.normal.proudSkillGroupId];
      }
      if(avatarData.skills.skill.proudSkillGroupId in map){
        skillLevel += map[avatarData.skills.normal.proudSkillGroupId];
      }
      if(avatarData.skills.elementalBurst.proudSkillGroupId in map){
        elementalBurstLevel += map[avatarData.skills.normal.proudSkillGroupId];
      }
    }

    this.characterService.setLevel(avatarId, level);
    this.characterService.setNormalLevel(avatarId, normalLevel);
    this.characterService.setSkillLevel(avatarId, skillLevel);
    this.characterService.setElementalBurstLevel(avatarId, elementalBurstLevel);
    if(this.characterService.getExtraData(avatarId) == undefined){
      this.characterService.setDefaultExtraData(avatarId);
    }

    //プログレス更新
    this.globalProgressService.setValue(minProgress + progressDiff * 1/6);

    //装備
    let reliquaries: EnkaEquip[] = [];
    if(avatar?.equipList){
      for(let equip of avatar?.equipList){
        if(equip.reliquary){
          reliquaries.push(equip);
          continue;
        }
        if(equip.weapon){
          this.initWeapon(avatarId, equip);
          continue;
        }
      }
    }
    //プログレス更新
    this.globalProgressService.setValue(minProgress + progressDiff * 1/3);
    this.initReliquary(avatarId, reliquaries);

    //プログレス更新
    this.globalProgressService.setValue(maxProgress);
  }

  initReliquary(avatarId: string, reliquaries: EnkaEquip[]){
    let info: ArtifactStorageInfo = {};
    let setIndexs: string[] = ['',''];
    let setIndexMap: Record<string, number> = {};

    for(let reliquary of reliquaries){
      if(!(reliquary.reliquary?.level == 21)){
        continue;
      }
      //セット
      let tempData: ArtifactStoragePartData = {};
      let tempSetIndex = reliquary.flat.icon.split("_")[2];
      if(!(tempSetIndex in setIndexMap)){
        setIndexMap[tempSetIndex] = 0;
      }
      setIndexMap[tempSetIndex] += 1;
      //値
      //メイン
      let mainProp = Const.MAP_ARTIFACE_PROP[reliquary.flat.reliquaryMainstat!.appendPropId];
      tempData['main'] ={
        name: mainProp,
        value: this.genshinDataService.getReliquaryMain(mainProp),
      }
      //サブ
      for(let i = 0; i < 4; ++ i){
        let key = "sub" + (i + 1);
        let subProp = Const.MAP_ARTIFACE_PROP[reliquary.flat.reliquarySubstats![i].appendPropId];
        let value = reliquary.flat.reliquarySubstats![i].statValue;
        let finalValue = value;
        let minDiff = value + 1;
        for(let v of this.genshinDataService.getReliquaryAffix(subProp)){
          let tempDiff = Math.abs(value - v);
          if(tempDiff < minDiff){
            minDiff = tempDiff;
            finalValue = v;
          }else{
            break;
          }
        }
        tempData[key] ={
          name: subProp,
          value: finalValue,
        }
      }
      
      switch(reliquary.flat.equipType){
        case "EQUIP_BRACER":
          info.flower = tempData;
          break;
        case "EQUIP_NECKLACE":
          info.plume = tempData;
          break;
        case "EQUIP_SHOES":
          info.sands = tempData;
          break;
        case "EQUIP_RING":
          info.goblet = tempData;
          break;
        case "EQUIP_DRESS":
          info.circlet = tempData;
          break;
      }
    }
    //セット情報
    for(let key in setIndexMap){
      for(let i = 0; i < setIndexMap[key]%2; ++i){
        for(let j = 0; j < setIndexs.length; ++j){
          if(setIndexs[j] == ''){
            setIndexs[j] = key;
          }
        }
      }
    }

    this.artifactService.pushStorageInfo(avatarId, info);
    this.artifactService.setStorageSetIndexsAll(avatarId, setIndexs);
  }

  initWeapon(avatarId: string, weapon: EnkaEquip ){
    let weaponId: string;
    let level: string;
    let smeltingLevel: string;

    weaponId = weapon.itemId.toString();
    let weaponData = this.genshinDataService.getWeapon(weaponId);
    level = weapon.weapon!.level.toString();
    let tempLevel = weapon.weapon!.level;
    let tempPromoteLevel = weapon.weapon!.promoteLevel;
    if(tempPromoteLevel == weaponAscendLevels.indexOf(tempLevel)){
      //未突破
      level = tempLevel.toString();
    }else{
      //突破済み
      level = tempLevel.toString() + "+";
    }
    smeltingLevel = "1";
    for(let key in weaponData.skillAffixMap){
      if(weaponData.skillAffixMap[key].affixId in weapon.weapon!.affixMap){
        smeltingLevel = key;
      }
    }

    if(this.weaponService.getIndex(avatarId) == weaponId){
      this.weaponService.setDefaultExtraData(avatarId, weaponId);
    }
    this.weaponService.setIndex(avatarId, weaponId);
    this.weaponService.setLevel(avatarId, level);
    this.weaponService.setSmeltingLevel(avatarId, smeltingLevel);

  }
}
