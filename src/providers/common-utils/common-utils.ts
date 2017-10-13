import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController, LoadingController, AlertController, Platform, } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
//import { Logger } from "angular2-logger/core"; 

@Injectable()
export class CommonUtilsProvider {

  loader: any;
  logConsole:boolean = false;
  log: {level} = {level:0};

  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alert: AlertController, public appVersion: AppVersion, public plt: Platform, public http: Http  /*public log:Logger*/) {
    console.log('Hello CommonUtilsProvider Provider');
 
    
  }


  setConsoleLog(val) {
    this.logConsole = val;
  }

  getRandomVal(min,max): number {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  getRandomTimeVal():string {
    //return new Date().valueOf().toString();
    let val = Math.floor(Math.random()*899999+100000);
    return val.toString();
  }


  setLogLevel(level) {
    const levels = {
      "off": 0,
      "error": 1,
      "warn": 2,
      "info": 3,
      "debug": 4,
      "verbose": 5,
    }
    /*
    0.- Level.OFF
    1.- Level.ERROR
    2.- Level.WARN
    3.- Level.INFO
    4.- Level.DEBUG
    5.- Level.LOG // verbose
    */


   this.log.level = levels[level];
  }

  verbose (text) {
   // this.log.log("VERBOSE:"+text);
    if (this.logConsole && this.log.level >=5) console.log ("VERBOSE:"+text);
  }

  debug (text) {
    // this.log.debug("DEBUG:"+text);
     if (this.logConsole && this.log.level >=4) console.log ("DEBUG:"+text);
  }

  info (text) {
    //this.log.info("INFO:"+text);
    if (this.logConsole && this.log.level >=3) console.log ("INFO:"+text);
  }

  warn (text) {
   // this.log.warn("WARN:"+text);
    if (this.logConsole && this.log.level >=2) console.log ("WARN:"+text);
  }

  error (text) {
   // this.log.error("ERROR:"+text);
    if (this.logConsole && this.log.level >=1) console.log ("ERROR:"+text);
  }



  // pass -1 to dur for infinite
  presentLoader(text, dur = 6000, remove = true) {

    if (this.loader && remove) { this.loader.dismiss(); }
    this.loader = this.loadingCtrl.create({
      content: text,
      duration: dur
    });
    this.loader.present();
  }

  removeLoader() {
    if (this.loader) { this.loader.dismiss(); }
  }

  // wrapper to present a toast with different colors
  // error = red
  // any other val = green
  presentToast(text, type?, dur?) {

    var cssClass = 'successToast';
    if (type == 'error') cssClass = 'errorToast';

    let toast = this.toastCtrl.create({
      message: text,
      duration: dur || 1800,
      position: 'top',
      cssClass: cssClass
    });
    toast.present();
  }

  //credit: https://gist.github.com/alexey-bass/1115557
  versionCompare(left, right) {
    if (typeof left + typeof right != 'stringstring')
      return false;

    var a = left.split('.');
    var b = right.split('.');
    var i = 0;
    var len = Math.max(a.length, b.length);

    for (; i < len; i++) {
      if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
        return 1;
      }
      else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
        return -1;
      }
    }

    return 0;
  }

}
