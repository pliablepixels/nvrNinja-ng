/*
  ZONEMINDER wrapper for Auth services. 

*/


import { Injectable } from '@angular/core';
import { Http , URLSearchParams, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {constants} from '../../../constants/constants';
import {CameraServiceProvider, CameraList} from '../../../providers/camera-service/camera-service';
import {CommonUtilsProvider} from '../../../providers/common-utils/common-utils';
import {AuthServiceProvider} from '../../../providers/auth-service/auth-service';


@Injectable()
export class ZmCameraServiceProvider extends CameraServiceProvider {

  
  constructor(public http: Http, public utils:CommonUtilsProvider, public auth:AuthServiceProvider) {
    super(http);
    console.log('Hello ZMCameraServiceProvider Provider');
   
  }

  getCameras(credentials): Promise <CameraList[]> {

    return new Promise((resolve,reject) => {

      let cameras:CameraList[] = [];
      let url = credentials.url;
      this.http.get (url+'/api/monitors.json', {withCredentials:true})
      .map (res => res.json())
      .toPromise()
      .then ( succ => {
        succ.monitors.forEach (item => {
          let connkey = this.utils.getRandomVal(10000,60000);
          let basepath = credentials.url+"/cgi-bin/nph-zms?maxfps=3"+this.auth.getAuthKey();
          let streamingUrl=`${basepath}&mode=jpeg&monitor=${item.Monitor.Id}&connkey=${connkey}&scale=50`;
          let snaptshotUrl=`${basepath}&mode=single&monitor=${item.Monitor.Id}&connkey=${connkey}&scale=50`;

          let tempItem:CameraList = {
            name:item.Monitor.Name,
            streamingURL: streamingUrl,
            snapshotURL: snaptshotUrl,
          }
          console.log ("PUSHING "+JSON.stringify(tempItem));
          cameras.push (tempItem);

        }) //forEach
        resolve (cameras)
      }) //then

    });

    
  }

   

}
