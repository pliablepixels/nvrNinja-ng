import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonUtilsProvider } from '../../providers/common-utils/common-utils';
import { TranslateService } from '@ngx-translate/core';
import { CameraServiceProvider } from '../../providers/camera-service/camera-service';
import { DatabaseProvider } from '../../providers/database/database';
import { DomSanitizer } from '@angular/platform-browser';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers, ResponseContentType } from '@angular/http';

declare var Packery, imagesLoaded: any;

@IonicPage()
@Component({
  selector: 'page-montage',
  templateUrl: 'montage.html'
})

export class MontagePage {
  cameras = []; 
  isDrag: boolean = false;
  useSnapshot: boolean = true;
  headerColor: string = "";
  image: any;
  packery: any;
  size:number = 20;
  credentials:any;
 
  myDragulaOptions: any = {
    moves: (el, container, handle, siblings) => {
      return this.isDrag;
    }

  }

  constructor(public navCtrl: NavController, public dragulaService: DragulaService, public navParams: NavParams, public auth: AuthServiceProvider, public translate: TranslateService, public utils: CommonUtilsProvider, public camera: CameraServiceProvider, public db: DatabaseProvider, public http: Http, public sanitizer: DomSanitizer) {

    /*this.forceRefreshCameras()
      .then(_ => {
      })
      .catch(err => {
        this.utils.presentToast(this.translate.instant('MONTAGE_MONITOR_ERROR'), "error");
        this.utils.error("error received retrieving cameras: " + JSON.stringify(err));

      })*/
  }


  killStream (camera) {
    this.camera.killStream (camera, this.credentials)
    .then (succ => console.log ("OK:"+JSON.stringify(succ)))
    .catch (err => console.log ("ERR:"+JSON.stringify(err)))
  }

  toggleDrag() {
    this.isDrag = !this.isDrag;
    console.log("ISDRAG=" + this.isDrag);
    this.headerColor = this.isDrag ? 'danger' : '';
    this.useSnapshot = this.isDrag;
    this.camera.refreshCameraUrls(this.cameras);
  }

  forceRefreshCameras(): Promise<any> {
    this.cameras.length = 0;
    
    return this.db.get('credentials')
      .then(succ => { this.credentials = succ; return this.camera.getCameras(this.credentials) })
      .then(_cameras => {
        this.utils.info(`retrieved ${_cameras.length} cameras`);
       
        this.cameras = _cameras;

      });
  }

  getCameras(): Promise<any> {
    return new Promise((resolve,reject) => {
      if (this.cameras.length) {
        this.utils.debug ("returning cached cameras");
        resolve (this.cameras)
      }
      else {
        this.utils.debug ("reloading cameras using APIs");
        resolve (this.forceRefreshCameras());
        
      }

    });
  }

  changeSize(num:number) {
    this.size = this.size + (num * 5);
    if (this.size < 5) this.size = 5;
    if (this.size > 100) this.size = 100;
    let instance = this;
    setTimeout ( () => {
      this.packery.layout();
    },20)
   
  }

  initializePackery() {
    // switch to snapshot mode
    this.useSnapshot = true;
    let instance = this;
    setTimeout(() => {
      var elem = document.querySelector('.grid');
      instance.utils.debug("waiting for imagesloaded");
     
      imagesLoaded(elem, function () {
       // all images loaded
        instance.utils.debug("images loaded done, instantiating packery");
        instance.packery = new Packery(elem, {
          // options
          itemSelector: '.grid-item',
          percentPosition: true,
   
        });
        // trigger a layout after instantiating
        instance.utils.debug("packery instantiated, forcing layout");
        instance.packery.layout();
       
        instance.packery.once ( 'layoutComplete',function () {
          instance.utils.debug("packery layout done, switching to live");
          console.log (">>>>>>>>>>>>>>>>>>>>> SNAPSHOT IS FALSE");
          instance.useSnapshot = false;
  
        }) 
      });

    }, 100);
  }
 
  ionViewCanEnter() {
    let auth = this.navParams.get('auth');

    this.utils.debug("Are we logged in? " + auth)
    if (auth && !this.auth.isLoggedIn())
      this.utils.presentToast(this.translate.instant('NOT_LOGGED_IN'), "error")
    return auth;
  }

  ionViewDidEnter() {
    this.utils.verbose("Inside Montage Enter");
    this.getCameras()
    .then (_ => {
      this.utils.verbose("calling initPackery");
      this.initializePackery();
    })
    .catch(err => {
      this.utils.presentToast(this.translate.instant('MONTAGE_MONITOR_ERROR'), "error");
      this.utils.error("error received retrieving cameras: " + JSON.stringify(err));

    });

    
  }

  ionViewWillUnload() {

  }


}
