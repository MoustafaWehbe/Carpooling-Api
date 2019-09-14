import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferridePage } from './offerride';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    OfferridePage,
  ],
  imports: [
  	HttpModule,
    IonicPageModule.forChild(OfferridePage),
  ],
})
export class OfferridePageModule {}
