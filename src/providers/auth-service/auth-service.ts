import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import {constants} from '../../constants/constants';
import {ServerProfile} from '../../providers/server-profile/server-profile';



@Injectable()
export  class AuthServiceProvider {
  

  constructor(public http: Http) {
    console.log('Base class AuthServiceProvider Provider');
   
  }


  getVersion(sp:ServerProfile): Promise <string> {
    throw constants.NOT_IMPLEMENTED;
  }

  login (sp:ServerProfile): Promise <string> {
    throw constants.NOT_IMPLEMENTED;
  }

  isAuthEnabled(sp:ServerProfile): Promise <boolean> {
    throw constants.NOT_IMPLEMENTED;
  }

  logout(sp:ServerProfile): Promise <any> {
    throw constants.NOT_IMPLEMENTED;
  }

  isLoggedIn(): boolean {
    throw constants.NOT_IMPLEMENTED;
  }

  getAuthKey(): string {
    throw constants.NOT_IMPLEMENTED;
  }


}
