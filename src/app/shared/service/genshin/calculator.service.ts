import { Injectable } from '@angular/core';
import { CharacterService, character, weapon, CharStatus, EnemyService, ExtraDataService, WeaponService, WeaponStatus, ExtraCharacterData, ExtraSkillBuff, ExtraStatus, CharSkill, ExtraSkillInfo, WeaponSkillAffix } from 'src/app/shared/shared.module';

export interface CalResult{
  characterData?: character;
  weaponData?: weapon;
}

export interface SpecialBuff {
  base?: string;
  multiValue?: number;
  maxVal?: number;
  priority?: number;
  specialMaxVal?: SpecialBuffMaxVal;
}

export interface SpecialBuffMaxVal {
  base?: string;
  multiValue?: number;
}

interface SkillParamInf {
  paramMap?: Record<string, number[]>;
  paramList?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  //データマップ
  dataMap: Record<string, CalResult> = {};

  constructor(
    private characterService: CharacterService,
    private weaponService: WeaponService,
    private extraDataService: ExtraDataService,
    private enemyService: EnemyService,
  ) { }

  //初期化（キャラ）
  initCharacterData(index: string | number) {
    let indexStr = index.toString();
    if(!(indexStr in this.dataMap)){
      this.dataMap[indexStr] = {};
    }
    this.dataMap[indexStr].characterData = this.characterService.get(indexStr);
  }

  //初期化（武器）
  initWeaponData(index: string | number, weaponIndex: string | number) {
    let indexStr = index.toString();
    let weaponIndexStr = weaponIndex.toString();
    if(!(indexStr in this.dataMap)){
      this.dataMap[indexStr] = {};
    }
    this.dataMap[indexStr].weaponData = this.weaponService.get(weaponIndexStr);
  }

  setProperty(index: string, prop: string, value: any) {

  }

  getProperty(index: string, prop: string) {
    let result = 0;
    result += this.getCharacterData(index)[prop as keyof CharStatus] ?? 0;
    result += this.getWeaponData(index)[prop as keyof WeaponStatus] ?? 0;
    // result += this.getExtraCharacterData(index)?[prop] ?? 0;
    // result += this.getExtraWeaponData(index)?[prop] ?? 0;
    // result += this.getReliquaryData(index)?[prop] ?? 0;
    return result;
  }

  getCharacterData(index: string | number): CharStatus{
    return this.dataMap[index]!.characterData!.levelMap[this.characterService.getLevel(index.toString())!];
  }

  getWeaponData(index: string | number): WeaponStatus{
    return this.dataMap[index]!.weaponData!.levelMap[this.weaponService.getLevel(index.toString())!];
  }

  getExtraCharacterData(index: string | number){
    let characterData = this.dataMap[index]!.characterData!;
    let characterStorageData = this.characterService.getStorageInfo(index);
    let extraCharacterData = this.extraDataService.getCharacter(index);
    let setting = this.characterService.getExtraData(index)!;
    let result: Record<string, number> = {};
    let specialResult: Record<string, SpecialBuff> = {};

    if("skills" in setting && setting.skills){
      if("skill" in setting.skills){
        this.setBuffDataToResult(
          characterData.skills?.skill, 
          characterStorageData.skillLevel!, 
          extraCharacterData.skills!.skill,
          setting.skills.skill!,
          result,
          specialResult,
        );
      }
      if("elemental_burst" in setting.skills){
        this.setBuffDataToResult(
          characterData.skills?.elemental_burst, 
          characterStorageData.elementalBurstLevel!, 
          extraCharacterData.skills!.elemental_burst,
          setting.skills.elemental_burst!,
          result,
          specialResult,
        );
      }
      if("proudSkills" in setting.skills){
        for(let index = 0; index < setting.skills.proudSkills!.length; ++index){
          let obj = setting.skills.proudSkills![index];
          if(Object.keys(obj).length === 0){
            continue;
          }
          this.setBuffDataToResult(
            characterData.skills?.proudSkills[index], 
            "01", 
            extraCharacterData.skills!.proudSkills![index],
            obj,
            result,
            specialResult);
        }
      }
    }

    if("constellation" in setting && setting.constellation){
      for(let index of ["0", "1", "2", "3", "4", "5"]){
        if(index in setting.constellation){
          this.setBuffDataToResult(
            characterData.skills.talents[parseInt(index)], 
            "01", 
            extraCharacterData.constellation![index],
            setting.constellation![index],
            result,
            specialResult,
          );
        }
      }
    }

    return [result, specialResult];
  }

  getExtraWeaponData(index: string | number){
    let weaponData = this.dataMap[index]!.weaponData!;
    let weaponStorageData = this.weaponService.getStorageInfo(index);
    let extraWeaponData = this.extraDataService.getWeapon(weaponData.id);
    let setting = this.weaponService.getExtraData(index)!;
    let result: Record<string, number> = {};
    let specialResult: Record<string, SpecialBuff> = {};

    if("effect" in setting && setting.effect){
      this.setBuffDataToResult(
        weaponData.skillAffixMap[weaponStorageData.smeltingLevel!], 
        weaponStorageData.smeltingLevel!, 
        extraWeaponData.effect!,
        setting.effect!,
        result,
        specialResult,
      );
    }

    return [result, specialResult];
  }

  getReliquaryData(index: string){

  }

  getEnemyData(index: string){

  }

  calculate(){
    // let temp1 = 
  }

  private setBuffDataToResult(skillData: SkillParamInf, skillLevel: string, buffs: ExtraSkillInfo[], setting: ExtraStatus, result: Record<string, number>, specialResult: Record<string, SpecialBuff>){
    let switchOnSet = setting?.switchOnSet ?? {};
    let sliderNumMap = setting?.sliderNumMap ?? {};

    for(let buffInfo of buffs){
      let buff = buffInfo?.buff;
      let isEnableInSwitch = true;
      let isEnableInSlider = true;
      for(let index of buff?.index ?? buff?.constIndex ?? []){
        if(!(index in switchOnSet)){
          isEnableInSwitch = false;
          break;
        }
      }
      for(let index of buff?.index ?? buff?.constIndex ?? []){
        if(!(index in sliderNumMap)){
          isEnableInSlider = false;
          break;
        }
      }
      if(buff){
        if(isEnableInSwitch){
          let id = 0;
          let indexValue = 0;
          if(buff?.index){
            if(skillData.paramMap){
              indexValue = skillData.paramMap[skillLevel][buff?.index![id]];
            }else if(skillData.paramList){
              indexValue = skillData.paramList[buff?.index![id]];
            }
          }
          let constIndexValue = 0;
          if(buff?.constIndex){
            if(skillData.paramMap){
              constIndexValue = skillData.paramMap[skillLevel][buff?.constIndex![id]];
            }else if(skillData.paramList){
              constIndexValue = skillData.paramList[buff?.constIndex![id]];
            }
          }
          let constCalRelation = buff?.constCalRelation ?? '+';
    
          let base = buff?.base;
          let priority = buff?.priority ?? 0;
    
          let targets = buff?.target;
          let convertElement = buff?.convertElement;
    
          let isGlobal = buff?.isGlobal ?? false;
          let unableSelf = buff?.unableSelf ?? false;
    
          let maxValIndexValue = 0;
          if(buff?.maxValIndex){
            if(skillData.paramMap){
              maxValIndexValue = skillData.paramMap[skillLevel][buff?.maxValIndex![id]];
            }else if(skillData.paramList){
              maxValIndexValue = skillData.paramList[buff?.maxValIndex![id]];
            }
          }
          let maxValBase = buff?.maxValBase;
          let maxValConstIndexValue = 0;
          if(buff?.maxValConstIndex){
            if(skillData.paramMap){
              maxValConstIndexValue = skillData.paramMap[skillLevel][buff?.maxValConstIndex![id]];
            }else if(skillData.paramList){
              maxValConstIndexValue = skillData.paramList[buff?.maxValConstIndex![id]];
            }
          }
    
          if(unableSelf){
            //TODO
            continue;
          }
    
          if(base){
            //特殊バフ
            let temp: SpecialBuff = {};
            temp.base = base;
            temp.multiValue = indexValue;
            temp.priority = priority;
            if(maxValBase){
              //特殊上限
              temp.specialMaxVal = {
                base: maxValBase,
                multiValue: maxValIndexValue,
              }
            }else{
              //一般上限
              temp.maxVal = maxValConstIndexValue;
            }
            for(let tar of targets){
              specialResult[tar] = temp;
            }
          }else{
            //一般バフ
            let value = indexValue;
            switch(constCalRelation){
              case '+':
                value += constIndexValue;
                break;
              case '-':
                value -= constIndexValue;
                break;
              case '*':
                value *= constIndexValue;
                break;
              case '/':
                value /= constIndexValue;
                break;
            }
            for(let tar of targets){
              if(!result[tar]){
                result[tar] = 0;
              }
              result[tar] += value;
            }
          }
        }else if(isEnableInSlider){
          let id = 0;
          let indexValue = 0;
          if(buff?.index){
            if(skillData.paramMap){
              indexValue = skillData.paramMap[skillLevel][buff?.index![id]];
            }else if(skillData.paramList){
              indexValue = skillData.paramList[buff?.index![id]];
            }
          }
          let constIndexValue = 0;
          if(buff?.constIndex){
            if(skillData.paramMap){
              constIndexValue = skillData.paramMap[skillLevel][buff?.constIndex![id]];
            }else if(skillData.paramList){
              constIndexValue = skillData.paramList[buff?.constIndex![id]];
            }
          }
          let constCalRelation = buff?.constCalRelation ?? '+';
    
          let base = buff?.base;
          let priority = buff?.priority ?? 0;
    
          let targets = buff?.target;
          let convertElement = buff?.convertElement;
    
          let isGlobal = buff?.isGlobal ?? false;
          let unableSelf = buff?.unableSelf ?? false;

          let sliderMax = buff?.sliderMax;
          let sliderStep = buff?.sliderStep;
    
          if(unableSelf){
            //TODO
            continue;
          }
          
          if(base){
            //特殊バフ
            let temp: SpecialBuff = {};
            temp.base = base;
            temp.multiValue = indexValue * sliderNumMap[buff?.index![id]];
            temp.priority = priority;

            for(let tar of targets){
              specialResult[tar] = temp;
            }
          }else{
            //一般バフ
            let value = indexValue;
            switch(constCalRelation){
              case '+':
                value += constIndexValue;
                break;
              case '-':
                value -= constIndexValue;
                break;
              case '*':
                value *= constIndexValue;
                break;
              case '/':
                value /= constIndexValue;
                break;
            }
            for(let tar of targets){
              if(!result[tar]){
                result[tar] = 0;
              }
              result[tar] += value * sliderNumMap[buff?.index![id]];
            }
          }
        }
      }
    }

    for(let idStr in switchOnSet){
      //key3が有効になっている


    }
    for(let key3 in sliderNumMap){
      //key3の回数が設定されている


    }
  }

  private resolveBuffData(){

  }
}
