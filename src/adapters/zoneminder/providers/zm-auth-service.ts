/*
  ZONEMINDER wrapper for Auth services. 

*/

import { Injectable } from '@angular/core';
import { Http , URLSearchParams, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {constants} from '../../../constants/constants';
import {AuthServiceProvider} from '../../../providers/auth-service/auth-service';
import {CommonUtilsProvider} from '../../../providers/common-utils/common-utils';
import {ServerProfile} from '../../../providers/server-profile/server-profile';


/**
 * 
 * 
 * @export
 * @class ZmAuthServiceProvider
 * @extends {AuthServiceProvider}
 */

 
@Injectable()
export class ZmAuthServiceProvider extends AuthServiceProvider {

  authKey:string='';

  _isLoggedIn:boolean = false;

  constructor(public http: Http, public utils:CommonUtilsProvider) {
    super(http);
    console.log('Hello ZMAuthServiceProvider Provider');
   
  }


   /**
    * 
    * 
    * @param {any} credentials 
    * @returns {Promise <string>} 
    * @memberof ZmAuthServiceProvider
    */
   getVersion(sp:ServerProfile): Promise <string> {
    return new Promise ((resolve, reject) => {
      this.http.get (sp.apiUrl+'/api/host/getVersion.json', {withCredentials:true})
      .map (res => res.json())
      .toPromise()
      .then (resp => resolve(resp.version) )
      .catch (err => reject (JSON.stringify(err)))
    })  
  }


  /**
   * 
   * 
   * @returns {Boolean} 
   * @memberof ZmAuthServiceProvider
   */
  isLoggedIn(): boolean {
    return this._isLoggedIn;
  }


  /**
   * 
   * 
   * @param {any} credentials 
   * @returns {Promise <any>} 
   * @memberof ZmAuthServiceProvider
   */
  logout(sp:ServerProfile): Promise <any> {
    this._isLoggedIn = false;
    let url = sp.portalUrl;
    this.utils.info("Logging out of "+url+'/index.php?view=logout');
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let options = new RequestOptions( {headers:headers, withCredentials: true });
    let data = new URLSearchParams();
    data.append ('action', 'logout');
    data.append('view', 'login');
    return this.http.post (url+'/index.php',data, options)
    .toPromise()
  }


  getAuthKey () {
    
    return this.authKey;
  }

  isAuthEnabled(sp:ServerProfile): Promise <boolean> {
    return new Promise ( (resolve,reject) => {
      let url = sp.apiUrl;
      this.http.get (url+'/configs/viewByName/ZM_OPT_USE_AUTH.json', {withCredentials:true})
      .map (res => res.json())
      .toPromise()
      .then (results => {
        if (results.config && results.config.Value) {
          if (results.config.Value == "0") this.authKey = "";
          resolve(results.config.Value == "1" ? true: false);
        }
        else {
          this.utils.debug ("isAuth:unknown");
          resolve (true);
        }
     
      })
      .catch( err => { 
        if (err.status == 401) {
          resolve(true) ;
        } 
        else {
          this.utils.debug ("Odd error, not 401:"+ JSON.stringify(err));
          resolve (true);

        }
      })
    })
  }

  login (sp:ServerProfile): Promise <any> {
    return this.logout (sp) // first logout
    .then (_ => {
      return this.isAuthEnabled(sp) // is auth enabled?
      .then (succ => {
        this.utils.debug ("isAuthEnabled:"+succ);
        if (succ) {
          return this._login(sp) // if yes, re-login
          .then (succ=> {this.utils.debug (`Logged in with: ${succ}`); this._isLoggedIn = true;})

        }
        else this._isLoggedIn = true; // if no auth, always set this on
      })
    })
  }
  
  _login(sp:ServerProfile): Promise <any> {
    return new Promise ((resolve, reject) => {
      const loginString = "var currentView = 'console'";
      let data = new URLSearchParams();
      data.append('action', 'login');
      data.append('view', 'console');
      data.append('username', sp.username);
      data.append('password', sp.password);
      let url = sp.portalUrl;
      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        //'Cookie': 'zmSkin=classic; zmCSS=classic; ZMSESSID=flkk4s44ksddbn5r5ei0p1ha14'
    });

      let options = new RequestOptions( {headers:headers, withCredentials: true });
      
      this.utils.debug ("posting to "+ data.toString()+ " with "+sp.portalUrl) 
      this.http.post (sp.portalUrl+'/index.php',data, options)
      .toPromise()
      .then (results => {
        let body = results.text();
        // console.log (body);
        if (body.indexOf(loginString) == -1 ) {
          reject (constants.LOGIN_BAD_CREDENTIALS)
        }
        else {
          // get a valid monitor
          try {
            let re = constants.LOGIN_STRING_MATCH;
            let mid = Number(body.match(re)[1]);
            this.http.get (sp.portalUrl+'/?view=watch&mid='+mid, {withCredentials:true})
            .toPromise()
            .then (results => {
              //console.log ("AUTH PARSE=" + results.text())
              let body = results.text();
              let auth = body.match(constants.AUTH_KEY_MATCH)[1]
              this.utils.debug ("AUTH="+auth)
              this.authKey = "&auth="+auth;
              resolve (auth);
            })
            // coming here means login was ok, but no auth key
            // possibilties = no auth or user=&pass=
            .catch (e => {
              this.authKey = `&user=${sp.username}&pass=${sp.password}`
              resolve (this.authKey)
              //reject (constants.PARSE_ERROR)
            })

          }
          catch(e) {reject (constants.LOGIN_NO_MONITORS)}
          
        }
      })
      .catch (err => {reject (JSON.stringify(err))}) 
    })
   
  
  }

}
