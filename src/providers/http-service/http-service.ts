import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import {LoadingController} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';




@Injectable()
export class customHttpServiceProvider extends Http {
loading:any;

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, public loadingCtrl:LoadingController) {
    super(backend, defaultOptions);
 
    
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    //console.log ("********* CUSTOM HTTP POST to:"+url);

    this.loading = this.loadingCtrl.create({
      spinner:"dots",
      content:'',
      showBackdrop:false,
      cssClass: 'my-loading-class'
    });
    this.loading.present();
    return super.request(url, options)
    .do ( _ => { this.loading.dismiss();}, _=> { this.loading.dismiss();})


  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
  

    this.loading = this.loadingCtrl.create({
      spinner:"dots",
      content:'',
      showBackdrop:false,
      cssClass: 'my-loading-class'
    });
    this.loading.present();
    return super.post(url, body, options)
    .do((res: Response) => {
         this.loading.dismiss();
          this.onSuccess(res);
        }, (error: any) => {
          this.loading.dismiss();
          this.onError(error);
        })



    
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    //this.notifyService.popError();
    return Observable.throw(error);
  }

  /**
   * onSuccess
   * @param res
   */
  private onSuccess(res: Response): void {
    
  }

  /**
   * onError
   * @param error
   */
  private onError(error: any): void {
   // this.notifyService.popError();
  }

}
