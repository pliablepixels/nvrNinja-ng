import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {CommonUtilsProvider} from '../../providers/common-utils/common-utils';
import { TranslateService } from '@ngx-translate/core';
import {CameraServiceProvider} from '../../providers/camera-service/camera-service';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-montage',
  templateUrl: 'montage.html'
})
export class MontagePage {

  cameras = [];
  isDrag:Boolean = false;
  headerColor:String = "";
  
  myDragulaOptions:any = {
    moves: (el, container, handle, siblings) => {
     
      return this.isDrag;
      //return this.isDrag; 
    }

  }

  constructor(public navCtrl: NavController, public dragulaService: DragulaService, public navParams:NavParams, public auth:AuthServiceProvider, public translate:TranslateService, public utils:CommonUtilsProvider, public camera:CameraServiceProvider, public db:DatabaseProvider) {

    this.refreshCameras()
    .then (_ => {})
    .catch (err => {
      this.utils.presentToast(this.translate.instant('MONTAGE_MONITOR_ERROR'), "error");
      this.utils.error ("error received retrieving cameras: "+ JSON.stringify(err));

    })
  }

  toggleDrag() {
    this.isDrag = !this.isDrag;
    console.log  ("ISDRAG="+this.isDrag);
    this.headerColor = this.isDrag ? 'danger':'';
  }

  refreshCameras(): Promise <any> {
    this.cameras.length = 0;
    let credentials;
    return this.db.get('credentials')
    .then (succ => {credentials = succ; return this.camera.getCameras(credentials)})
    .then (_cameras => {
      this.utils.info (`retrieved ${_cameras.length} cameras`);
      this.cameras = _cameras;

      });
    }
  

  setupDragAndDropHandlers() {
  	
    this.dragulaService.drag.subscribe((value) => {
      this.utils.verbose(`drag: ${value[0]}`);
      
    });
    this.dragulaService.drop.subscribe((value) => {
      this.utils.verbose(`drop: ${JSON.stringify(value)}`);
      
    });
    this.dragulaService.over.subscribe((value) => {
      this.utils.verbose(`over: ${value[0]}`);
     
    });
    this.dragulaService.out.subscribe((value) => {
      this.utils.verbose(`out: ${value[0]}`);
      
    });

  }

  ionViewCanEnter() {
    let auth = this.navParams.get('auth');
    
    this.utils.debug ("Are we logged in? " + auth)
    if (auth && !this.auth.isLoggedIn())
        this.utils.presentToast (this.translate.instant('NOT_LOGGED_IN'), "error")
  	return auth;
  }

  ionViewDidEnter() {
    this.utils.verbose("Inside Montage Enter");
    //this.setupDragAndDrop();
  }

  ionViewWillUnload() {

  }


}
