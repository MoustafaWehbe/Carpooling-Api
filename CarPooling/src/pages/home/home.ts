import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { Component, NgZone } from "@angular/core/";
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage,NavController, Tabs, Platform, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { HomemapProvider } from '../../providers/homemap/homemap';
import { Events } from 'ionic-angular';


declare var google: any;

//back geolo;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  	map: GoogleMap;	
  	mylat: any;
 	mylon: any;
 	from: any;
	directionsService = new google.maps.DirectionsService;
  	directionsDisplay = new google.maps.DirectionsRenderer;
  	loader:any;
  	trackLng:any;
  	trackLat:any;
  	f:string;
  	t:string;
  	rid:any;
  	// public sendLocation:any;
  	constructor(public events:Events, public HomemapProvider:HomemapProvider, public zone: NgZone, 
  		private alertCtrl:AlertController, public loadingCtrl:LoadingController, private http:Http, 
  		private storage:Storage, public navParams: NavParams, public navCtrl:NavController, 
  		private platform:Platform, private geolocation:Geolocation, private googleMaps: GoogleMaps,
  		public LocationTrackerProvider: LocationTrackerProvider) {    	    		
   	}
   	ionViewWillEnter(){
		this.sendLocation();
   	}


  	ionViewDidLoad() {
  		this.initMap();
		//if(this.platform.is('core') || this.platform.is('mobileweb')) {
		// this.initMap();
		//}
		// else{this.loadMap();}

  	}
	 initMap() {
		// var msg = "Please wait while loading your map";
		// this.showLoader(msg);
		this.geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: false}).then((resp) => {
			this.mylat = resp.coords.latitude;
			this.mylon = resp.coords.longitude;
			this.setLatLng(this.mylat, this.mylon);
		}).catch((error) => {
			this.initMap();
		console.log('Error getting location', error);
		});
	}
	setLatLng(mylat:number, mylon:number){
		var autocomplete;
	 	var uluru = {lat: mylat, lng: mylon};
	    this.map = new google.maps.Map(<HTMLInputElement>document.getElementById('map'), {
	        zoom: 13,
	        center: uluru,
	        mapTypeId: 'terrain'
	    });
	    var marker = new google.maps.Marker({
	    	position: uluru,
	    	icon: 'assets/imgs/defaultProfileMap.png',
	        map: this.map
	    });
	    console.log(uluru);
	}

	showLoader(msg) { //call this fn to show loader
        this.loader = this.loadingCtrl.create({
            content: msg,
        });
        this.loader.present();    
    }
	sendLocation(){
		var autocomplete;
		this.directionsDisplay.setMap(this.map);
		this.zone.run(() => {
			this.f = this.HomemapProvider.from;
			this.t = this.HomemapProvider.to;
			this.rid = this.HomemapProvider.rideId;
			console.log(this.f);
		});
		if(this.f && this.t){	
			if(this.HomemapProvider.trackLat && this.HomemapProvider.trackLong){
				console.log(this.HomemapProvider.trackLat);
				var location = {lat: this.HomemapProvider.trackLat, lng: this.HomemapProvider.trackLong};
				var marker = new google.maps.Marker({
					position: location,
		        	draggable: true,
		        	animation: google.maps.Animation.DROP,
		        	icon: 'assets/imgs/navigation.png',
		        	map: this.map
				});
			}
			var msg = "Please wait while setting your route";
			this.showLoader(msg);
	  	    //var FromTo =  this.navParams.data.split('/');
	  		var from = this.f;
	  		console.log(from);
	  		var to = this.t;
	  		console.log(to);
	  		var rideId = this.rid;
	  		//var path = '';
	  		this.directionsService.route({
	      		origin: from,
	      		destination: to,
	      		travelMode: 'DRIVING'
	    	}, (response, status) => {
	      		if (status === 'OK') {
	        		this.directionsDisplay.setDirections(response);
					var poly = response.routes[0].overview_polyline;
					poly = this.decode(poly);
					this.storage.get('api_token').then((val) => {
    					let data = JSON.stringify({
      						path: poly,
							api_token: val,
							id: rideId
						});
					    let headers = new Headers({
					      'Content-Type' : 'application/json'
					    });
				    let options = new RequestOptions({ headers: headers });
				    this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/offer?', data, options)
				      .subscribe((res) => {   
				        if(res.json().status == "success"){
				          console.log("success");
				        }
				      }, (err) => {
				        console.log(err);
				        }
				      );
				    });
				    this.loader.dismiss();

	      		} else{
	        		window.alert('Directions request failed due to ' + status + " " + response);
	        		console.log(response);
	      		}
	   		 });
		}
	    autocomplete = new google.maps.places.Autocomplete(
	    	(document.getElementById('autocomplete')),{types: ['geocode']});
	        autocomplete.addListener('place_changed', this.showAuto);

	}
	decode(encoded){
	    // array that holds the points
	    var points=[ ]
	    var index = 0, len = encoded.length;
	    var lat = 0, lng = 0;
	    while (index < len) {
	        var b, shift = 0, result = 0;
	        do { 
	            b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
	            result |= (b & 0x1f) << shift;
	            shift += 5;
	            } while (b >= 0x20);
	        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
	        lat += dlat;
	        shift = 0;
	        result = 0;
	        do {
	        	b = encoded.charAt(index++).charCodeAt(0) - 63;
	        	result |= (b & 0x1f) << shift;
	       		shift += 5;
	        } while (b >= 0x20);
	     	var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
	     	lng += dlng;
			points.push({latitude:( lat / 1E5),longitude:( lng / 1E5)})  
	  	}
	  	return points
    }

	showAuto(){
		var geocoder = new google.maps.Geocoder();
		var address = (<HTMLInputElement>document.getElementById('autocomplete')).value;
		var latitude:any;
		var longitude: any;
		geocoder.geocode({ 'address': address}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				latitude = results[0].geometry.location.lat();
		    	longitude = results[0].geometry.location.lng();
		}		
		});

		let TIME_IN_MS = 1000;
		let hideFooterTimeout = setTimeout( () => {
			var location = {lat: latitude, lng:longitude};
			var map = new google.maps.Map(document.getElementById('map'), {
		    	zoom: 15,
		        center: location
		    });
			var marker = new google.maps.Marker({
				position: location,
		        draggable: true,
		        animation: google.maps.Animation.DROP,
		        map: map
			});

			marker.addListener('click', toggleBounce);
			function toggleBounce() {
		    	if (marker.getAnimation() !== null) {
		        	marker.setAnimation(null);
		        } else {
		        	marker.setAnimation(google.maps.Animation.BOUNCE);
		        }
		    }}, TIME_IN_MS);
	}
}