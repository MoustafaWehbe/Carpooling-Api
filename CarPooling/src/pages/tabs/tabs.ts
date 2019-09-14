import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { RidePage } from '../ride/ride';
import { PrizesPage } from '../prizes/prizes';
import { HomePage } from '../home/home';
import { IonicPage,NavController, Platform, NavParams, Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  activeTab: any;
  from:string;
  to:string;
  FromTo:any;
  rideId:number;
  allinfo:string;

  tab1Root = HomePage;
  tab2Root = PrizesPage;
  tab3Root = RidePage;
  tab4Root = ProfilePage;

  constructor(public params: NavParams) {
  	this.from = params.get("from");
		this.to = params.get("to");
    this.rideId = params.get("rideId");
		this.FromTo = this.from+"/" + this.to+"/"+this.rideId;
		// console.log(this.from);
    this.activeTab = params.get("tab")?params.get("tab"):0;
    this.allinfo = params.get('driver_info')+"" + params.get('ride_info') + ""+params.get('driver_vehicle');
  }
}