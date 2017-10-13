import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(public storage:Storage) {
    console.log('Hello DatabaseProvider Provider');
  }

  init() {
    return this.storage.ready();
  }

  getDriver() {
    return this.storage.driver;
  }

  get(key): Promise <any> {
    return this.storage.get (key);
  }

  set(key,value): Promise <any> {
    return this.storage.set (key,value);
  }

  remove(key): Promise <any> {
    return this.storage.remove (key);
  }

  clear(): Promise <any> {
    return this.storage.clear();
  }

}
