import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {constants} from '../../constants/constants';
import 'rxjs/add/operator/map';
import {ServerProfileProvider, ServerProfile} from '../../providers/server-profile/server-profile';


export interface Camera {
  name:string,
  id?:string,
  streamingURL:string,
  snapshotURL?:string,
  mode:string,
  width?:string,
  height?:string,
  controllable?:boolean,
  connkey?:string,
  others?:any,

}

@Injectable()
export  class CameraServiceProvider {
  constructor(public http: Http) {
    console.log('Hello Base CameraServiceProvider Provider');
  }

  getCameras(sp?:ServerProfile): Promise <Camera[]> {
    throw constants.NOT_IMPLEMENTED;
  }

  refreshCameraUrls (cameras) {
    return;
  }

  killStream (camera:any, sp?:ServerProfile): Promise <any> {
    throw constants.NOT_IMPLEMENTED;
  }

  startStream (camera:any, sp?:ServerProfile)  {
    throw constants.NOT_IMPLEMENTED;
  }

  sendCommand(cmd:any, camera:Camera, sp?:ServerProfile ): Promise <any> {
    throw constants.NOT_IMPLEMENTED;

  }

}
