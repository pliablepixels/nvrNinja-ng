import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MontagePage } from './montage';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
  declarations: [
    MontagePage,
  ],
  imports: [
  	DragulaModule,
    IonicPageModule.forChild(MontagePage),
    TranslateModule.forChild() 
    //Pipes
  ],
  exports: [
    MontagePage
  ]
})
export class MontagePageModule {}

