import { Component, OnInit } from '@angular/core';
import { HttpService, GenshinDataService, Const } from 'src/app/shared/shared.module';
import { lastValueFrom, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jsonDownloadStatus!: Map<string, number>;
  constructor(private httpService: HttpService, private genshinDataService: GenshinDataService) {
    this.jsonDownloadStatus = genshinDataService.getAllJsonDownloadStatus();
  }

  ngOnInit() {
    this.initializeAppFactory(this.httpService).then(() => {
      this.genshinDataService.update();
    })
  }

  initializeAppFactory(httpService: HttpService): Promise<any> {
    let promiseList: Promise<any>[] = [];
    promiseList.push(
      //スペシャル
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_CONFIG], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_CONFIG)
        .pipe(
          tap(data => {
            GenshinDataService.initExtraData(data);
          })
        )
      ),
      //原神キャラデータ
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_AVATAR], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_GENSHIN_AVATAR)
        .pipe(
          tap(data => {
            GenshinDataService.initCharacterData(data);
          })
        )
      ),
      //原神武器データ
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_WEAPON], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_GENSHIN_WEAPON)
        .pipe(
          tap(data => {
            GenshinDataService.initWeaponData(data);
          })
        )
      ),
      //原神敵データ
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_MONSTER], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_GENSHIN_MONSTER)
        .pipe(
          tap(data => {
            GenshinDataService.initMonsterData(data);
          })
        )
      ),
      //原神聖遺物セットデータ
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_RELIQUARY_SET], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_GENSHIN_RELIQUARY_SET)
        .pipe(
          tap(data => {
            GenshinDataService.initReliquarySetData(data);
          })
        )
      ),
      //原神聖遺物メインデータ
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_RELIQUARY_MAIN], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_GENSHIN_RELIQUARY_MAIN)
        .pipe(
          tap(data => {
            GenshinDataService.initReliquaryMainData(data);
          })
        )
      ),
      //原神聖遺物サブデータ
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_RELIQUARY_SUB], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_GENSHIN_RELIQUARY_SUB)
        .pipe(
          tap(data => {
            GenshinDataService.initReliquaryAffixData(data);
            GenshinDataService.initOptimalReliquaryAffixStep(data);
          })
        )
      ),
      //チップデータ
      lastValueFrom(httpService.getSystemData(Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_CHIP], 'json', this.jsonDownloadStatus, Const.SYS_JSON_DATA_CHIP)
        .pipe(
          tap(data => {
            GenshinDataService.initChipData(data);
          })
        )
      ),
    )
    return Promise.all(promiseList);
  }
}
