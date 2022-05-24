import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';

import { SharedModule, ExtraDataService } from 'src/app/shared/shared.module';

import { AppComponent } from './app.component';
import { MainComponent } from './root/main/main.component';
import { MenuComponent } from './root/menu/menu.component';
import { HeadComponent } from './root/head/head.component';
import { FooterComponent } from './root/footer/footer.component';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/i18n/`);
}

function initializeAppFactory(httpClient: HttpClient): () => Observable<any> {
  return () => httpClient.get("assets/init/data.json")
    .pipe(
      tap(data => {
        ExtraDataService.initData(data);
      })
    );
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
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
