import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonUtilsProvider } from '../../providers/common-utils/common-utils'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { TranslateService } from '@ngx-translate/core';
import { ServerProfileProvider, ServerProfile, ServerProfileList, AuthType } from '../../providers/server-profile/server-profile';
import { AlertController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',

})
export class SettingsPage {

  readonly: boolean = true;

  serverProfileList: ServerProfileList = { currentName: "", profiles: [] };
  currentServerProfile: ServerProfile = {
    name: '',
    apiUrl: '/zm/api',
    portalUrl: '/zm',
    type: AuthType.userpass,
    username: '',
    password: '',
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider, public utils: CommonUtilsProvider, public translate: TranslateService, public serverProfile: ServerProfileProvider, public alertCtrl: AlertController) {

    console.log('Hello SettingsPage');
    let spl = this.serverProfile.getServerProfileList();
    if (spl) {
      this.serverProfileList = spl;
      this.currentServerProfile = this.serverProfile.getCurrentServer();

    }

  }

  switchProfile() {
    if (!this.serverProfileList.profiles.length) {
      this.utils.presentToast ("No saved profiles", "error");
      return;
    }


    let alert = this.alertCtrl.create();
    alert.setTitle('Choose profile');

    for (let i=0; i < this.serverProfileList.profiles.length; i++)  {
      alert.addInput({
        type: 'radio',
        label: this.serverProfileList.profiles[i].name,
        value: this.serverProfileList.profiles[i].name,
        checked: false
      });

    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.currentServerProfile = this.serverProfile.getServerProfileForName(data);
        
      }
    });
    alert.present();
  }

  


  clear() {
    this.currentServerProfile = {
      name: '',
      apiUrl: '/zm/api',
      portalUrl: '/zm',
      type: AuthType.userpass,
      username: '',
      password: '',


    }

  }

  save() {

    this.utils.debug("saving profile...");
    if (!this.currentServerProfile.name || !this.currentServerProfile.apiUrl!) {
      this.utils.presentToast(this.translate.instant("SETTINGS_MISSING_DATA"), "error");
      return;

    }

    // remove trailing slash if any
    this.currentServerProfile.apiUrl = this.currentServerProfile.apiUrl.replace(/\/+$/, "");
    this.currentServerProfile.portalUrl = this.currentServerProfile.portalUrl.replace(/\/+$/, "");

    console.log ("LIST BEFORE EDIT " + JSON.stringify (this.serverProfileList));
    let found = false;
    let i=0;
    for (;i < this.serverProfileList.profiles.length ; i++) {
      if (this.serverProfileList.profiles[i].name.toLowerCase() == this.currentServerProfile.name.toLowerCase()) {

        found = true;
        break;
       
      }
    }
    if (found) {// overwrite
      this.serverProfileList.profiles[i] = Object.assign({},this.currentServerProfile);
      console.log ("Ovewriting profile...")
    }
    else {
      console.log ("New profile...");
      this.serverProfileList.profiles.push(Object.assign({},this.currentServerProfile));
    }
    this.serverProfileList.currentName = this.currentServerProfile.name;

    console.log("SAVING " + JSON.stringify(this.serverProfileList));

   

    this.serverProfile.saveServerProfileList(this.serverProfileList)
      .then(_ => { return this.auth.login(this.currentServerProfile) })
      .then(_ => {
        this.utils.presentToast(this.translate.instant("SUCCESS_LOGIN"));
      })
      .catch(err => {
        this.utils.error("re-login error " + JSON.stringify(err));
        this.utils.presentToast(this.translate.instant("ERROR_LOGIN"), "error");
      })
  }


  ionViewWillEnter() {
    this.readonly = false;
    let sp = this.serverProfile.getCurrentServer();
    if (sp) this.currentServerProfile = sp;
  }



  ionViewDidLoad() {
  }

}
