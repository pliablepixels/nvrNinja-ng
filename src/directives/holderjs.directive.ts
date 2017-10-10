
// credit: https://stackoverflow.com/a/46673111/1361529
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
declare var Holder: any;

@Directive({
  selector: '[holderjs]',
})
export class HolderjsDirective {
    constructor(public el: ElementRef, public ren:Renderer2) {
       //Holder.run({images:el.nativeElement});
    }

    ngAfterViewInit() {
        Holder.run({images:this.el.nativeElement});
    }
}