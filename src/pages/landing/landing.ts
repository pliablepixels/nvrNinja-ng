import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, NavParams, Platform, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { DatabaseProvider } from '../../providers/database/database';
import {CommonUtilsProvider} from '../../providers/common-utils/common-utils';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor( public navCtrl:NavController, public navParams: NavParams, public auth: AuthServiceProvider, public platform: Platform, public db: DatabaseProvider, public utils:CommonUtilsProvider, public translate:TranslateService, public app:App) {
   

    this.platform.ready().then(() => {

   

      this.db.get('credentials')
        .then(credentials => {
          
          this.utils.verbose("**** DB GOT " + JSON.stringify(credentials));
          if (credentials == null) {
           this.utils.verbose("Going to settings");
            this.navCtrl.setRoot("SettingsPage", { auth: false })
          }
          else {
            this.utils.verbose("credentials retrieved="+JSON.stringify(credentials));
            this.attemptLoginAndContinue(credentials)
          }

        })
        .catch(err => console.log("DB Error:" + JSON.stringify(err)));
    })

  }

  attemptLoginAndContinue(credentials) {
   this.utils.verbose("Inside Attempt login...")
    this.auth.login (credentials)
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
