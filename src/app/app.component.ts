import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';




import {AuthServiceProvider} from '../providers/auth-service/auth-service'
import {CameraServiceProvider} from '../providers/camera-service/camera-service'
import { TranslateService } from '@ngx-translate/core';
import {CommonUtilsProvider} from '../providers/common-utils/common-utils';
import {customHttpServiceProvider} from '../providers/http-service/http-service';



import {constants} from '../constants/constants';
import {Http} from '@angular/http';


/***** START: ADAPTER SPECIFIC CODE - MODIFY FOR NEW ADAPTERS */
// Classes for adapters in use
import {ZmAuthServiceProvider} from '../adapters/zoneminder/providers/zm-auth-service';
import {ZmCameraServiceProvider} from '../adapters/zoneminder/providers/zm-camera-service';


// Modify this to associate new adapter classes
@Component({
  templateUrl: 'app.html',
  providers: [
    
    {provide: AuthServiceProvider, useClass: ZmAuthServiceProvider},
    {provide: CameraServiceProvider, useClass: ZmCameraServiceProvider},
    {provide: Http, useClass: customHttpServiceProvider}

  ]
})

/***** END: ADAPTER SPECIFIC CODE*/

export class MyApp {
  @ViewChild(Nav) nav: Nav;

 public rootPage: any = "LandingPage";

  pages: Array<{title: string, component: any, auth:boolean}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public translate: TranslateService, public utils:CommonUtilsProvider) {
    
   
    this.translate.setDefaultLang('en');
    this.translate.use('en')
    .subscribe ( _ => {
      console.log ("Language file loaded");
      this.initializeApp();
    },
    err => {
      console.log ("Language file load error:"+JSON.stringify(err));
    }
  )




    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Montage', component: 'MontagePage', auth:true },
      { title: 'List', component: 'ListPage', auth:false },
      { title: 'Settings', component: 'SettingsPage', auth:false },
    ];

  }

  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#444444');
      this.splashScreen.hide();


    });

  }

  openPage(page) {
    console.log ("GOING TO "+page.component);
  
    this.nav.setRoot(page.component, {auth:page.auth});

  }
}
