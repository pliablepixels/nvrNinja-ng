import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DatabaseProvider} from '../../providers/database/database'
import {CommonUtilsProvider} from '../../providers/common-utils/common-utils'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  
})
export class SettingsPage {

  readonly:boolean = true;

   credentials = {
      url: '/zm',
      username: '',
      password: '',
    }

  constructor(public navCtrl: NavController, public navParams: NavParams, public db:DatabaseProvider, public auth:AuthServiceProvider, public utils:CommonUtilsProvider, public translate:TranslateService) {
  }



  clear() {
    this.credentials = {
      url: '',
      username: '',
      password: '',

    }

  }

  save() { //
    this.utils.debug ("saving credentials...");
    this.db.set('credentials',this.credentials);
    this.auth.login(this.credentials)
    .then (_ => {
      this.utils.presentToast(this.translate.instant("SUCCESS_LOGIN"));
    })
    .catch (err=> {
      this.utils.error ("re-login error "+JSON.stringify(err));
      this.utils.presentToast(this.translate.instant("ERROR_LOGIN"),"error");
    })
  }

  ionViewWillEnter() {
    this.readonly = true;
    this.db.get('credentials')
    .then (succ => {
      this.readonly = false;
      if (succ != null)
        this.credentials = succ;
    })
  }

  ionViewDidLoad() {
  }

}
