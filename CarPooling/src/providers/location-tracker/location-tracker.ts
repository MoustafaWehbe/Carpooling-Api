import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {
	public watch: any;   
 	public lat: number = 0;
  	public lng: number = 0;

  constructor(public zone: NgZone, private backgroundGeolocation:BackgroundGeolocation, private geolocation:Geolocation) {
    console.log('Hello LocationTrackerProvider Provider');
  }
	startTracking() {
		//filter is used to filter out any updates that return error
	  	let config = {
		    desiredAccuracy: 0,
		    stationaryRadius: 20,
		    distanceFilter: 10,
		    debug: true,
		    interval: 2000
	  	};
	 
	 	this.backgroundGeolocation.configure(config).subscribe((location) => {
		 	console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
		    // Run update inside of Angular's zone
		    this.zone.run(() => {
		      this.lat = location.latitude;
		      this.lng = location.longitude;
		    });
	 
	  	}, (err) => {
	    	console.log(err);
	  	});
	 
	  	// Turn ON the background-geolocation system.
		this.backgroundGeolocation.start();
	  	// Foreground Tracking
		let options = {
	  		frequency: 3000,
	  		enableHighAccuracy: true
		};
		//whenever we get an update we update the lat and lng member variables, and we force this to run inside of Angular’s zone so that it triggers change detection.
	 	this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
	 		console.log(position);
	  		// Run update inside of Angular's zone
			this.zone.run(() => {
				this.lat = position.coords.latitude;
				this.lng = position.coords.longitude;
			});
		});
	}
 
	stopTracking() {
  		console.log('stopTracking');
  		this.backgroundGeolocation.finish();
  		this.watch.unsubscribe(); 
  	}
}
