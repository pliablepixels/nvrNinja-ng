import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonUtilsProvider } from '../../providers/common-utils/common-utils';
import { TranslateService } from '@ngx-translate/core';
import { CameraServiceProvider , Camera} from '../../providers/camera-service/camera-service';
import { ServerProfileProvider, ServerProfile } from '../../providers/server-profile/server-profile';
import { DomSanitizer } from '@angular/platform-browser';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers, ResponseContentType } from '@angular/http';
import { HolderjsDirective } from '../../directives/holderjs.directive';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';


declare var Packery, imagesLoaded, Draggabilly: any;

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
  isEdit: boolean = false;
  useSnapshot: boolean = true;
  headerColor: string = "";
  image: any;
  packery: any;
  draggies = [];
  currentServerProfile:ServerProfile;
  
  showArrow: boolean = true;
  duration: number = 3000;

  private _profileSub: (data:any) => void;

  constructor(public navCtrl: NavController,  public navParams: NavParams, public auth: AuthServiceProvider, public translate: TranslateService, public utils: CommonUtilsProvider, public camera: CameraServiceProvider,public serverProfile:ServerProfileProvider, public http: Http, public sanitizer: DomSanitizer, public events:Events) {

    console.log('Hello MontagePage with montageCameras length='+this.montageCameras.length);

    this.utils.debug ("subscribing to events");
    this._profileSub = (data) => {this.serverProfileChanged(data)};
    this.events.subscribe('serverProfile:changed', this._profileSub); 
  }

  triggerEvent(data) {
    this.serverProfile.dummy();
  }

  serverProfileChanged(data) {
    console.log ("MONTAGE SERVER PROFILE CHANGED:" + JSON.stringify(data));
    //console.log (JSON.stringify(this.montageCameras));

    let killStreams = [];
    for (let i=0; i <this.montageCameras.length; i++) {
      if (this.montageCameras[i].isVisible &&
          !this.montageCameras[i].isPaused) {
            killStreams.push(this.killStream(this.montageCameras[i]));

          }
    }

    Observable.forkJoin(killStreams)
    .subscribe (results => {

      setTimeout ( () => {
        this.destroyPackery();
        this.forceRefreshCameras()
        .then (_ => {
          this.utils.verbose("calling initPackery");
          this.initializePackery();
        })
        .catch(err => {
          this.utils.presentToast(this.translate.instant('MONTAGE_MONITOR_ERROR'), "error");
          this.utils.error("error received retrieving cameras: " + JSON.stringify(err));
    
        });
  
      }, 5000)

    })

    
  }


  errorStream (camera, event) {
    camera.isPaused = true;
    console.log ("ERROR RECEIVED");
  }

  killStream (camera) : Promise <any> {
    if (this.isEdit) {
      this.utils.info ("Can't use while in edit mode");
      return  Promise.resolve(true);
    }

    camera.isPaused = true;
   return this.camera.killStream (camera, this.currentServerProfile)
    .then (succ => console.log ("OK:"+JSON.stringify(succ)))
    .catch (err => console.log ("ERR:"+JSON.stringify(err)))
  }

  startStream (camera) {
    if (this.isEdit) {
      this.utils.info ("Can't use while in edit mode");
      return;
    }
    camera.isPaused = false;
    console.log ("Camera connkey was "+camera.connkey)
    this.utils.info ("Starting stream");
    this.camera.startStream (camera, this.currentServerProfile);
    console.log ("Camera connkey is "+camera.connkey)
  }

  toggleDrag() {
    this.isEdit = !this.isEdit;
    console.log("isEdit=" + this.isEdit);
    this.headerColor = this.isEdit ? 'danger' : '';
    this.useSnapshot = this.isEdit;
    // if we are getting out of edit, create new connections
    if (!this.isEdit) // not in edit mode
    {
      for (let i = 0; i < this.draggies.length; i++)
      {
          this.draggies[i].disable();
         this.draggies[i].unbindHandles();
      }
      this.camera.refreshCameraUrls(this.montageCameras);
    }
    else { // we are in edit mode
      for (let i = 0; i < this.draggies.length; i++)
      {
          this.draggies[i].enable();
         this.draggies[i].bindHandles();
      }

    }

    

      
  }

  forceRefreshCameras(): Promise<any> {
    this.montageCameras.length = 0;
      return this.camera.getCameras(this.currentServerProfile)
      .then(_cameras => {
        this.utils.info(`retrieved ${_cameras.length} cameras`);
        this.montageCameras = _cameras.map( 
          (c) => ({
                   ...c, 
                   isVisible:true, 
                   isPaused:false, 
                   size:40, 
                   isSelected:false,
                   placeholder:`holder.js/${c.width}x${c.height}?auto=yes&theme=sky&text=...`,
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

  changeAllItemSize(direction:number) {
   for (let camera of this.montageCameras) {
    camera.size = camera.size + (direction * 5);
    if (camera.size < 5) camera.size = 5;
    if (camera.size > 100) camera.size = 100; 
   }
   setTimeout ( () => {
    this.packery.layout();
  },20)
   
  }

  resetAllItemSize() {
    for (let camera of this.montageCameras) {
     camera.size = 40;
    }
    setTimeout ( () => {
     this.packery.layout();
   },20)
    
   }


  changeItemSize(camera, direction:number) {
    camera.size = camera.size + (direction * 5);
    if (camera.size < 5) camera.size = 5;
    if (camera.size > 100) camera.size = 100;
    let instance = this;
    setTimeout ( () => {
      this.packery.layout();
    },20)
  }

  resetItemSize (camera) {
    camera.size = 40;
    setTimeout ( () => {
      this.packery.layout();
    },20)

  }
  destroyPackery() {

    for (let i = 0; i < this.draggies.length; i++)
    {
        this.draggies[i].destroy();
    }
    this.packery.destroy();

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

        instance.packery.getItemElements().forEach ( (item) => {
          let draggie = new Draggabilly(item);
          instance.packery.bindDraggabillyEvents(draggie);
          instance.draggies.push(draggie);
          draggie.disable();
          draggie.unbindHandles();
        })

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
    this.currentServerProfile = this.serverProfile.getCurrentServer();
    if (!this.currentServerProfile) {
      this.utils.error (">>> Bad Error: there is no current server. How are we inside Montage?")
    }
    
  }

  ionViewWillLeave() {
    this.utils.debug ("unsubscribing from events");
    this.events.unsubscribe('serverProfile:changed', this._profileSub);this._profileSub = undefined;
    this.utils.debug ("destroying packery");
    this.destroyPackery();
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
