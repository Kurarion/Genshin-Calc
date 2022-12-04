import { Injectable } from '@angular/core';
import { Const, StorageService } from 'src/app/shared/shared.module';

export interface TeamStorageInfo {
  member?: TeamSetStorageInfo;
}

export interface TeamSetStorageInfo {
  "1"?: string;
  "2"?: string;
  "3"?: string;
  "4"?: string;
}

export const TEAM_MAX_INDEX=4;
export const TEAM_MIN_INDEX=1;

export declare type MemberIndex = 1|2|3|4|'1'|'2'|'3'|'4';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  //データマップ
  dataMap!: Record<string, TeamStorageInfo>;

  constructor(private storageService: StorageService) {
    let temp = this.storageService.getJSONItem(Const.SAVE_TEAM)
    if(temp){
      this.dataMap = temp;
    }else{
      this.dataMap = {};
    }
  }

  //ストレージに保存
  saveData(){
    this.storageService.setJSONItem(Const.SAVE_TEAM, this.dataMap);
  }

  //チームメンバー退場
  removeTeamMemberStorageInfo(charIndex: string | number, subIndex: MemberIndex){
    this.setTeamMemberStorageInfo(charIndex, subIndex);
  }

  //チームメンバー追加
  addTeamMemberStorageInfo(charIndex: string | number, subIndex: MemberIndex, subCharIndex: string | number | undefined){
    this.setTeamMemberStorageInfo(charIndex, subIndex, subCharIndex);
  }

  //チームメンバー取得
  getOtherMembers(charIndex: string | number){
    let keyStr = charIndex.toString();
    let result: string[] = [];
    if(!this.dataMap.hasOwnProperty(keyStr)){
      this.initDefaultData(keyStr);
    }
    let team = this.dataMap[keyStr].member!;
    for(let i = TEAM_MIN_INDEX + 1; i <= TEAM_MAX_INDEX; ++i){
      if(team[i as MemberIndex] != keyStr){
        if(team[i as MemberIndex] != undefined){
          result.push(team[i as MemberIndex]!);
        }
      }
    }
    
    return result;
  }

  //チームメンバー情報取得
  getTeamStorageInfo(charIndex: string | number){
    let keyStr = charIndex.toString();
    let team = this.dataMap[keyStr].member;
    return team;
  }

  private setTeamMemberStorageInfo(charIndex: string | number, subIndex: MemberIndex, subCharIndex: string | number | undefined = undefined){
    let keyStr = charIndex.toString();
    let toAddMember = subCharIndex?.toString();
    if(!this.dataMap.hasOwnProperty(keyStr)){
      this.initDefaultData(keyStr);
    }
    let team = this.dataMap[keyStr].member!;
    let removedCharIndex = team[subIndex];
    team[subIndex] = toAddMember;

    return removedCharIndex;
  }
  
  private initDefaultData(keyStr: string){
    if(this.dataMap[keyStr] == undefined){
      this.dataMap[keyStr] = {
        member: {
          "1": keyStr,
        },
      };
    }
  }

}
