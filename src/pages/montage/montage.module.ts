import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MontagePage } from './montage';
import { TranslateModule } from '@ngx-translate/core';
import { HolderjsDirective } from '../../directives/holderjs.directive';


import { TooltipsModule } from 'ionic-tooltips';

@NgModule({
  declarations: [
    MontagePage,
    HolderjsDirective,
    
  ],
  imports: [

    TooltipsModule,
    IonicPageModule.forChild(MontagePage),
    TranslateModule.forChild() ,
    
    
    //Pipes
  ],
  exports: [
    MontagePage
  ]
})
export class MontagePageModule {}

