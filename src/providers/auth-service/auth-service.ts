import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import {constants} from '../../constants/constants';



@Injectable()
export  class AuthServiceProvider {
  

  constructor(public http: Http) {
    console.log('Base class AuthServiceProvider Provider');
   
  }


  getVersion(credentials?): Promise <string> {
    throw constants.NOT_IMPLEMENTED;
  }

  login (credentials): Promise <string> {
    throw constants.NOT_IMPLEMENTED;
  }

  isAuthEnabled(credentials): Promise <boolean> {
    throw constants.NOT_IMPLEMENTED;
  }

  logout(urcredentialsl): Promise <any> {
    throw constants.NOT_IMPLEMENTED;
  }

  isLoggedIn(): Boolean {
    throw constants.NOT_IMPLEMENTED;
  }

  getAuthKey(): String {
    throw constants.NOT_IMPLEMENTED;
  }


}
