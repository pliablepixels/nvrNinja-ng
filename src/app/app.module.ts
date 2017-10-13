import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { DatabaseProvider } from '../providers/database/database';
import { IonicStorageModule } from '@ionic/storage';
import { CommonUtilsProvider } from '../providers/common-utils/common-utils';
import { AppVersion } from '@ionic-native/app-version';
import { CameraServiceProvider } from '../providers/camera-service/camera-service';
import { customHttpServiceProvider } from '../providers/http-service/http-service';

//import { Logger } from "angular2-logger/core"; 

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { TooltipsModule } from 'ionic-tooltips';
import { ServerProfileProvider } from '../providers/server-profile/server-profile';


export function exportTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
} 

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,

    BrowserAnimationsModule,
    TooltipsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name:'nvrdb',
      driverOrder: ['sqlite','indexeddb', 'websql']
    }),
    TranslateModule.forRoot({
      loader: {
           provide: TranslateLoader,
           useFactory: (exportTranslateLoader),
           deps: [Http]
         }
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    DatabaseProvider,
    CommonUtilsProvider,
    AppVersion,
    CameraServiceProvider,
    customHttpServiceProvider,
    ServerProfileProvider,
    //Logger,


  ]
})
export class AppModule {}
