/*
  ZONEMINDER wrapper for Auth services. 

*/


import { Injectable } from '@angular/core';
import { Http , URLSearchParams, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {constants} from '../../../constants/constants';
import {CameraServiceProvider} from '../../../providers/camera-service/camera-service';


@Injectable()
export class ZmCameraServiceProvider extends CameraServiceProvider {

  
  constructor(public http: Http) {
    super(http);
    console.log('Hello ZMCameraServiceProvider Provider');
   
  }

  getCameras(credentials): Promise <any> {
    let url = credentials.url;
    return this.http.get (url+'/api/monitors.json', {withCredentials:true})
    .map (res => res.json())
    .toPromise()
  }

   

}
