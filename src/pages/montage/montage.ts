import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonUtilsProvider } from '../../providers/common-utils/common-utils';
import { TranslateService } from '@ngx-translate/core';
import { CameraServiceProvider , Camera} from '../../providers/camera-service/camera-service';
import { DatabaseProvider } from '../../providers/database/database';
import { DomSanitizer } from '@angular/platform-browser';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers, ResponseContentType } from '@angular/http';
import { HolderjsDirective } from '../../directives/holderjs.directive';


declare var Packery, imagesLoaded: any;

interface MontageCamera extends Camera {
  isVisible:boolean,
  isPaused:boolean,
  size:number,
  placeholder:string,

}

@IonicPage()
@Component({
  selector: 'page-montage',
  templateUrl: 'montage.html',

})

export class MontagePage {
  montageCameras:MontageCamera[] = []; 
  isDrag: boolean = false;
  useSnapshot: boolean = true;
  headerColor: string = "";
  image: any;
  packery: any;
  size:number = 20;
  credentials:any;
  
  showArrow: boolean = true;
  duration: number = 3000;
 
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

    if (this.isDrag) {
      this.utils.info ("Can't use while in edit mode");
      return;
    }

    camera.isPaused = true;
    this.camera.killStream (camera, this.credentials)
    .then (succ => console.log ("OK:"+JSON.stringify(succ)))
    .catch (err => console.log ("ERR:"+JSON.stringify(err)))
  }

  startStream (camera) {
    if (this.isDrag) {
      this.utils.info ("Can't use while in edit mode");
      return;
    }

    camera.isPaused = false;
    console.log ("Camera connkey was "+camera.connkey)
    this.utils.info ("Starting stream");
    this.camera.startStream (camera, this.credentials);
    console.log ("Camera connkey is "+camera.connkey)
    // we also need to toggle the DOM
    //this.useSnapshot = true;


    /*setTimeout ( () => {
      this.useSnapshot = false;
    },20)*/
  }

  toggleDrag() {
    this.isDrag = !this.isDrag;
    console.log("ISDRAG=" + this.isDrag);
    this.headerColor = this.isDrag ? 'danger' : '';
    this.useSnapshot = this.isDrag;
    // if we are getting out of edit, create new connkeys
    if (!this.isDrag)
      this.camera.refreshCameraUrls(this.montageCameras);
  }

  forceRefreshCameras(): Promise<any> {
    this.montageCameras.length = 0;

    return this.db.get('credentials')
      .then(succ => { this.credentials = succ; return this.camera.getCameras(this.credentials) })
      .then(_cameras => {
        this.utils.info(`retrieved ${_cameras.length} cameras`);
        this.montageCameras = _cameras.map( 
          (c) => ({
                   ...c, 
                   isVisible:true, 
                   isPaused:false, 
                   size:20, 
                   isSelected:false,
                   placeholder:`holder.js/${c.width}x${c.height}?auto=yes&theme=sky&text=\?`,
                   //placeholder:`holder.js/${c.width}x${c.height}?auto=yes&font=FontAwesome&text=&#xf067;&size=50`,
                  
          }));
        });
  }

  getCameras(): Promise<any> {
    return new Promise((resolve,reject) => {
      if (this.montageCameras.length) {
        this.utils.debug ("returning cached cameras");
        resolve (this.montageCameras)
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
          instance.useSnapshot = false;
  
        }) 
      });

    }, 200);
  }
 
  ionViewCanEnter() {
    let auth = this.navParams.get('auth');

    this.utils.debug("Are we logged in? " + auth)
    if (auth && !this.auth.isLoggedIn())
      this.utils.presentToast(this.translate.instant('NOT_LOGGED_IN'), "error")
    return auth;
  }

  ionViewWillEnter() {
    
  }

  ionViewDidEnter() {
    this.utils.verbose("Inside Montage Enter");
    this.getCameras() // return cached cameras || api 
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
