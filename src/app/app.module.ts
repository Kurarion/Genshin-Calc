import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';

import { SharedModule, GenshinDataService } from 'src/app/shared/shared.module';

import { AppComponent } from './app.component';
import { MainComponent } from './root/main/main.component';
import { MenuComponent } from './root/menu/menu.component';
import { HeadComponent } from './root/head/head.component';
import { FooterComponent } from './root/footer/footer.component';
import { environment } from '../environments/environment';
import { lastValueFrom, tap } from 'rxjs';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/i18n/`);
}

function initializeAppFactory(httpClient: HttpClient): () => Promise<any> {
  let promiseList: Promise<any>[] = [];
  promiseList.push(
    //スペシャル
    lastValueFrom(httpClient.get("assets/init/data.json")
      .pipe(
        tap(data => {
          GenshinDataService.initExtraData(data);
        })
      )
    ),
    //原神キャラデータ
    lastValueFrom(httpClient.get("assets/genshin/avatar_map.json")
      .pipe(
        tap(data => {
          GenshinDataService.initCharacterData(data);
        })
      )
    ),
    //原神武器データ
    lastValueFrom(httpClient.get("assets/genshin/weapon_map.json")
      .pipe(
        tap(data => {
          GenshinDataService.initWeaponData(data);
        })
      )
    ),
    //原神敵データ
    lastValueFrom(httpClient.get("assets/genshin/monster_map.json")
      .pipe(
        tap(data => {
          GenshinDataService.initMonsterData(data);
        })
      )
    ),
    //原神聖遺物セットデータ
    lastValueFrom(httpClient.get("assets/genshin/reliquary_set_map.json")
      .pipe(
        tap(data => {
          GenshinDataService.initReliquarySetData(data);
        })
      )
    ),
    //原神聖遺物メインデータ
    lastValueFrom(httpClient.get("assets/genshin/reliquary_main_map.json")
      .pipe(
        tap(data => {
          GenshinDataService.initReliquaryMainData(data);
        })
      )
    ),
    //原神聖遺物サブデータ
    lastValueFrom(httpClient.get("assets/genshin/reliquary_affix_map.json")
      .pipe(
        tap(data => {
          GenshinDataService.initReliquaryAffixData(data);
          GenshinDataService.initOptimalReliquaryAffixStep(data);
        })
      )
    ),
    //チップデータ
    lastValueFrom(httpClient.get("assets/init/chip.json")
      .pipe(
        tap(data => {
          GenshinDataService.initChipData(data);
        })
      )
    ),
  )
  return () => Promise.all(promiseList);
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      defaultLanguage: environment.defaultLang,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
  ],
  declarations: [
    AppComponent,
    MainComponent,
    MenuComponent,
    HeadComponent,
    FooterComponent,
  ],
  providers: [Title, CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [HttpClient],
      multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }
