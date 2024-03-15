import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule, GenshinDataService } from 'src/app/shared/shared.module';

import { AppComponent } from './app.component';
import { MainComponent } from './root/main/main.component';
import { MenuComponent } from './root/menu/menu.component';
import { HeadComponent } from './root/head/head.component';
import { FooterComponent } from './root/footer/footer.component';
import { environment } from '../environments/environment';
import { lastValueFrom, tap } from 'rxjs';
import { ServiceWorkerModule } from '@angular/service-worker';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/i18n/`);
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
    // FlexLayoutModule,
    TranslateModule.forRoot({
      defaultLanguage: environment.defaultLang,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 15 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:1000'
    }),
  ],
  declarations: [
    AppComponent,
    MainComponent,
    MenuComponent,
    HeadComponent,
    FooterComponent,
  ],
  providers: [Title],
  bootstrap: [AppComponent],
})
export class AppModule { }
