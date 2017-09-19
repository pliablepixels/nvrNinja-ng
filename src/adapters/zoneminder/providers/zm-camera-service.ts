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

  
  refreshCameraUrls(cameras) {
    let re = /&connkey=([0-9]*)&/;
    
    cameras.forEach (item => {
      let new_connkey_val= this.utils.getRandomTimeVal();
      let new_connkey = "&connkey="+new_connkey_val+"&";
      let tstr = item.streamingURL.replace(re,new_connkey);
      item.streamingURL = tstr;
    })
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
          //let connkey = this.utils.getRandomVal(10000,50000);
          let connkey = this.utils.getRandomTimeVal();
          let basepath = credentials.url+"/cgi-bin/nph-zms?maxfps=3"+this.auth.getAuthKey();
          let streamingUrl=`${basepath}&mode=jpeg&monitor=${item.Monitor.Id}&connkey=${connkey}&scale=50`;
          connkey = this.utils.getRandomTimeVal();
          let snapshotUrl=`${basepath}&mode=single&monitor=${item.Monitor.Id}&connkey=${connkey}&scale=50`;

          let tempItem:CameraList = {
            name:item.Monitor.Name,
            id:item.Monitor.Id,
            streamingURL: streamingUrl,
            snapshotURL: snapshotUrl,
            function: item.Monitor.Function,
            controllable: item.Monitor.Controllable == '1' ? true:false,


          }
          this.utils.debug("PUSHING "+JSON.stringify(tempItem));
          cameras.push (tempItem);

        }) //forEach
        resolve (cameras)
      }) //then

    });

    
  }

   

}
