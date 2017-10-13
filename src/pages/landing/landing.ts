import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, NavParams, Platform, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import {CommonUtilsProvider} from '../../providers/common-utils/common-utils';
import {ServerProfileProvider, ServerProfile, ServerProfileList} from '../../providers/server-profile/server-profile';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseProvider } from '../../providers/database/database';


@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  serverProfileList:ServerProfileList;

  constructor( public navCtrl:NavController, public navParams: NavParams, public auth: AuthServiceProvider, public platform: Platform, public utils:CommonUtilsProvider,
  public serverProfile:ServerProfileProvider,
  public translate:TranslateService, public app:App, public db:DatabaseProvider) {
   
    this.utils.setLogLevel("debug");
    this.utils.setConsoleLog(true);

    this.platform.ready()
    .then ( _=> {return this.db.init()})
    .then (_=> {return this.serverProfile.init();})

    .then ( _=> {return this.serverProfile.getCurrentServer()})
    .then ( serverProfile => {
          this.utils.verbose("**** DB GOT " + JSON.stringify(serverProfile));
          if (serverProfile == null) { // first run?
           this.utils.verbose("Going to settings");
            this.navCtrl.setRoot("SettingsPage", { auth: false })
          }
          else {
            this.utils.verbose("credentials retrieved="+JSON.stringify(serverProfile));
            this.attemptLoginAndContinue(serverProfile)
          }

        })
        .catch(err =>this.utils.info(">>> Unexpected Error:" + JSON.stringify(err)));
  }

  attemptLoginAndContinue(serverProfile:ServerProfile) {
   this.utils.verbose("Inside Attempt login...")
    this.auth.login (serverProfile)
    .then (_=>{
      this.utils.presentToast(this.translate.instant('SUCCESS_LOGIN'));
      this.navCtrl.setRoot("MontagePage", { auth: true });
    })
    .catch (err => {
      this.utils.error ("Login Error ="+JSON.stringify(err));
      this.utils.presentToast(this.translate.instant('ERROR_LOGIN'),"error")
      this.navCtrl.setRoot("SettingsPage", { auth: false });
    })  
  }

ionViewDidLoad() {
  
}


}
