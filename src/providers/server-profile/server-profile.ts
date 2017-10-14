import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {constants} from '../../constants/constants';
import {CommonUtilsProvider} from '../../providers/common-utils/common-utils';
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Events } from 'ionic-angular';

export enum AuthType {
  none = 0,
  userpass,
  token
}

export interface ServerProfile {
  name:string,
  apiUrl:string,
  portalUrl?:string,
  type: AuthType,
  username?: string,
  password?:string,

};

export interface ServerProfileList {
  currentName:string;
  profiles:ServerProfile[];
};

@Injectable()
export class ServerProfileProvider {
  serverProfileList:ServerProfileList = null;
  serverObservable: any;


  constructor(public db:DatabaseProvider, public utils:CommonUtilsProvider, public events:Events) {
    console.log('Hello ServerProfileProvider Provider');
    

  }

  init(): Promise <any> {
    this.utils.debug ("ServerProfile init...");
    return this.getServerProfileListFromDB();
  }


  getCurrentServer(): ServerProfile {
    if (!this.serverProfileList) return null;
    return this.getServerProfileForName(this.serverProfileList.currentName);

  }

  
  saveServerProfileList(spl:ServerProfileList): Promise <any> {
    this.serverProfileList = spl;
    this.events.publish("serverProfile:changed",{foo:"A"});
    return this.db.set ("serverProfileList",this.serverProfileList)

  }

  dummy() {
    console.log ("TRIGGERING DUMMY");
    this.events.publish("serverProfile:changed",{foo:"DUMMY"});
  }


  getServerProfileList(): ServerProfileList {
    return this.serverProfileList;
  }

  private setCurrentServerProfile(sp:ServerProfile) {
    this.serverProfileList.currentName = sp.name;

  }


  private setServerProfileForName(name:string) {

  }

   getServerProfileForName(name:string):ServerProfile {
    name = name.toLocaleLowerCase();
    let sp:ServerProfile;
    let found:boolean = false;
    for (let i=0; i < this.serverProfileList.profiles.length; i++) {
        if (this.serverProfileList.profiles[i].name.toLowerCase() == name) {
          found = true;
          sp = this.serverProfileList.profiles[i];
          break;
        }
    }
    return found ? sp: null;
  }



 
  private getServerProfileListFromDB(): Promise <any> {
    return this.db.get ("serverProfileList")
    .then ( data => { 
      // will be null the first time
      this.serverProfileList = data;

    })

  }


}
