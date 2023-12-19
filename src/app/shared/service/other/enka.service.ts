import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ArtifactService, ArtifactStorageInfo, ArtifactStoragePartData, CharacterService, Const, EnemyService, EnkaAvatar, EnkaEquip, EnkaInfos, EnkaPlayer, ExtraDataService, GenshinDataService, GlobalProgressService, HttpService, OtherService, StorageService, WeaponService } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

export interface EnkaStorageData {
  uid?: string;
  name?: string;
  avatars?: string[];
}

const API_URL = "https://enka.network/api/uid/";
const USE_ORIGIN_ENKA = environment.useOriginApi;
const API_PROXY_URL = environment.apiProxyServer;
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
  //プログレス値
  private enkaUpdate: Subject<void> = new Subject<void>();
  private enkaUpdate$ = this.enkaUpdate.asObservable();
  private enkaUIDUpdate: Subject<string> = new Subject<string>();
  private enkaUIDUpdate$ = this.enkaUIDUpdate.asObservable();

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
    this.characterService.saveData();
    this.weaponService.saveData();
    this.artifactService.saveData();
  }

  //データ取得
  getData(){
    return this.data;
  }

  //キャラリスト取得
  getAvatarList(){
    return this.data.avatars;
  }

  //enka状態取得
  getEnkaUpdate(){
    return this.enkaUpdate$;
  }

  //enka uid状態取得
  getEnkaUIDUpdate(){
    return this.enkaUIDUpdate$;
  }

  //enka uid状態更新
  updateEnkaUID(uid: string){
    this.enkaUIDUpdate.next(uid);
  }

  //-----------------------------------------
  //-----------------------------------------
  //               データ処理
  //-----------------------------------------
  //-----------------------------------------
  //ユーザー情報取得
  getUIDInfos(uidStr: string): Promise<EnkaInfos|null>{
    const url = API_URL + uidStr;
    const proxy_url = API_PROXY_URL + url
    if (USE_ORIGIN_ENKA) {
      return this.httpService.get<EnkaInfos>(url).then((data: EnkaInfos|null) => {
        if (!data) {
          return this.httpService.get<EnkaInfos>(proxy_url)
        }
        return data
      })
    } else {
      return this.httpService.get<EnkaInfos>(proxy_url)
    }
  }

  //データセット
  async initEnkaData(uid: number|string){
    return new Promise<number>(async (resolve, reject) => {
      let uidStr = uid.toString();
      //ID保存
      this.data.uid = uidStr;
      this.data.name = "";
      this.data.avatars = [];
      //API送信
      this.globalProgressService.setMode("buffer");
      let enka = await this.getUIDInfos(uidStr).finally(()=>{
        this.globalProgressService.setMode("determinate");
        this.globalProgressService.setValue(100)
      });
      //データ処理
      if(enka){
        let addedNum = 0;
        this.initPlayer(enka.playerInfo);
        //プログレス更新
        this.globalProgressService.setValue(0);
        if(enka.avatarInfoList != undefined){
          let length = enka.avatarInfoList.length;
          for(let [i,info] of enka.avatarInfoList.entries()){
            let addedId = this.initAvatar(info, 100/length * i, 100/length * (i + 1));
            if(addedId){
              this.data.avatars.push(addedId);
            }
            ++addedNum
          }
        }
        //ストレージに保存
        this.saveData();
        //状態更新
        this.enkaUpdate.next();
        //終了する
        resolve(addedNum)
        window.umami?.track(`Enka: Success`)
      } else {
        //サーバーダウン
        reject()
        window.umami?.track(`Enka: Failure`)
      }
    })
  }

  //プレイヤーセット
  initPlayer(player: EnkaPlayer | undefined){
    //データ保存
    this.data.name = player?.nickname ?? "";
  }

  //キャラセット
  initAvatar(avatar: EnkaAvatar | undefined, minProgress: number, maxProgress: number): string{
    if(avatar == undefined){
      //プログレス更新
      setTimeout(()=>{
        this.globalProgressService.setValue(maxProgress);
      })
      return "";
    }
    //プログレス差
    let progressDiff = maxProgress - minProgress;
    //キー
    let avatarId = avatar.avatarId.toString();
    let avatarData = this.genshinDataService.getCharacter(avatarId);
    //旅人さん
    if(!avatarData){
      avatarId = avatar.avatarId.toString() + avatar.skillDepotId.toString();
      avatarData = this.genshinDataService.getCharacter(avatarId);
    }
    //キャラ基本属性
    let level: string;
    let normalLevelNumber: number;
    let skillLevelNumber: number;
    let elementalBurstLevelNumber: number;

    let tempLevel = parseInt(avatar.propMap[enkaPropTypeMap.level].val);
    let tempPromoteLevel = parseInt(avatar.propMap[enkaPropTypeMap.promoteLevel].val);
    if(characterAscendLevels.includes(tempLevel) && tempPromoteLevel != characterAscendLevels.indexOf(tempLevel)){
      //突破済み
      level = avatar.propMap[enkaPropTypeMap.level].val + "+";
    }else{
      //未突破
      level = avatar.propMap[enkaPropTypeMap.level].val;
    }
    normalLevelNumber = avatar.skillLevelMap![avatarData.skills.normal.id];
    skillLevelNumber = avatar.skillLevelMap![avatarData.skills.skill.id];
    elementalBurstLevelNumber = avatar.skillLevelMap![avatarData.skills.elementalBurst.id];
    //星座追加
    if(avatar.proudSkillExtraLevelMap != undefined){
      let map = avatar.proudSkillExtraLevelMap;
      if(avatarData.skills.normal.proudSkillGroupId in map){
        normalLevelNumber += map[avatarData.skills.normal.proudSkillGroupId];
      }
      if(avatarData.skills.skill.proudSkillGroupId in map){
        skillLevelNumber += map[avatarData.skills.skill.proudSkillGroupId];
      }
      if(avatarData.skills.elementalBurst.proudSkillGroupId in map){
        elementalBurstLevelNumber += map[avatarData.skills.elementalBurst.proudSkillGroupId];
      }
    }

    this.characterService.setLevel(avatarId, level.padStart(2,"0"));
    this.characterService.setNormalLevel(avatarId, normalLevelNumber.toString().padStart(2,"0"));
    this.characterService.setSkillLevel(avatarId, skillLevelNumber.toString().padStart(2,"0"));
    this.characterService.setElementalBurstLevel(avatarId, elementalBurstLevelNumber.toString().padStart(2,"0"));
    if(this.characterService.getExtraData(avatarId) == undefined){
      this.characterService.setDefaultExtraData(avatarId, true);
    }

    //プログレス更新
    setTimeout(()=>{
      this.globalProgressService.setValue(minProgress + progressDiff * 1/6);
    })

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
    setTimeout(()=>{
      this.globalProgressService.setValue(minProgress + progressDiff * 1/3);
    })
    this.initReliquary(avatarId, reliquaries);

    //プログレス更新
    setTimeout(()=>{
      this.globalProgressService.setValue(maxProgress);
    })

    return avatarId;
  }

  initReliquary(avatarId: string, reliquaries: EnkaEquip[]){
    let info: ArtifactStorageInfo = {};
    let setIndexes: string[] = ['',''];
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
      let mainProp = Const.MAP_ARTIFACE_PROP[reliquary.flat.reliquaryMainstat!.mainPropId];
      tempData['main'] ={
        name: mainProp,
        value: this.genshinDataService.getReliquaryMain(mainProp),
      }
      //サブ
      for(let i = 0; i < 4; ++ i){
        let key = "sub" + (i + 1);
        let subProp = Const.MAP_ARTIFACE_PROP[reliquary.flat.reliquarySubstats![i].appendPropId];
        let value = reliquary.flat.reliquarySubstats![i].statValue;
        if(Const.PROPS_CHARA_WEAPON_PERCENT.includes(subProp)){
          value = reliquary.flat.reliquarySubstats![i].statValue / 100;
        }
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
      for(let i = 0; i < Math.floor(setIndexMap[key]/2); ++i){
        for(let j = 0; j < setIndexes.length; ++j){
          if(setIndexes[j] == ''){
            setIndexes[j] = key;
            break;
          }
        }
      }
    }

    let lastIndex = this.artifactService.pushStorageInfo(avatarId, info);
    this.artifactService.setStorageSetIndexesAll(avatarId, setIndexes, undefined, lastIndex);
  }

  initWeapon(avatarId: string, weapon: EnkaEquip ){
    let weaponId: string;
    let level: string;
    let smeltingLevel: string;

    weaponId = weapon.itemId.toString();
    let weaponData = this.genshinDataService.getWeapon(weaponId);
    if(weaponData == undefined){
      return;
    }
    level = weapon.weapon!.level.toString();
    let tempLevel = weapon.weapon!.level;
    let tempPromoteLevel = weapon.weapon!.promoteLevel;
    if(weaponAscendLevels.includes(tempLevel) && tempPromoteLevel != weaponAscendLevels.indexOf(tempLevel)){
      //突破済み
      level = tempLevel.toString() + "+";
    }else{
      //未突破
      level = tempLevel.toString();
    }
    smeltingLevel = "1";
    if(weaponData.skillAffixMap[smeltingLevel].id in weapon.weapon!.affixMap){
      smeltingLevel = (1 + weapon.weapon!.affixMap[weaponData.skillAffixMap[smeltingLevel].id]).toString();
    }

    if(this.weaponService.getIndex(avatarId) != weaponId){
      this.weaponService.setDefaultExtraData(avatarId, weaponId, true);
    }
    this.weaponService.setIndex(avatarId, weaponId);
    this.weaponService.setLevel(avatarId, level);
    this.weaponService.setSmeltingLevel(avatarId, smeltingLevel);
  }
}
