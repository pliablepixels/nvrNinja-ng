import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {constants} from '../../constants/constants';
import 'rxjs/add/operator/map';

/*
  Generated class for the CameraServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/


export interface CameraList {
  name:String,
  id?:String,
  streamingURL:String,
  snapshotURL:String,
  function:String,
  width?:Number,
  height?:Number,
  controllable?:Boolean,
  others?:any

}

@Injectable()


export class CameraServiceProvider {

  
  constructor(public http: Http) {
    console.log('Hello CameraServiceProvider Provider');
  }

  getCameras(credentials?): Promise <CameraList[]> {
    throw constants.NOT_IMPLEMENTED;
  }

  refreshCameraUrls (cameras) {
    return;
  }

}
