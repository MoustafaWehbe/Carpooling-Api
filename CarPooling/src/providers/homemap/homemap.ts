import { Injectable, NgZone} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, Tabs, NavParams, ViewController, ToastController, App } from 'ionic-angular';
import { LoadactiveProvider } from '../../providers/loadactive/loadactive';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

/*
  Generated class for the HomemapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var google: any;

@Injectable()
export class HomemapProvider {

	public from: string;
  	public to: string;
  	public rideId:any;
  	directionsService = new google.maps.DirectionsService;
  	directionsDisplay = new google.maps.DirectionsRenderer;
  	public trackLat:number;
  	public trackLong:number;

  constructor(public storage:Storage, public http :Http, public toastCtrl:ToastController, 
  	public zone:NgZone, public LoadactiveProvider:LoadactiveProvider) {
    console.log('Hello HomemapProvider Provider');
  }


 //    	trackLong = long;(id:number){
	// 	    this.storage.get('api_token').then((val) => {
	// 	        setInterval(() => { 
	// 	        	this.zone.run(() => {
	// 					this.trackLong = long;Lat = this.LocationTrackerProvider.lat;
	// 					this.trackLong = long;Lng = this.LocationTrackerProvider.lng;
	// 				});
	// 	        	console.log(this.trackLong = long;Lat);
	// 	        	let data = JSON.stringify({
	// 	                api_token: val,
	// 	                long: this.trackLong = long;Lng,
	// 	                lat:this.trackLat
	// 	            });
	// 	        let headers = new Headers({
	// 	          'Content-Type' : 'application/json'
	// 	        });
	// 	        let options = new RequestOptions({ headers: headers }); 
				
	// 	        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/user/track?', data, options)
	// 	          .subscribe(res => {
	// 	            console.log("yesssss", JSON.stringify(res));
	// 	            //write your logic once otp validation is done
	// 	            if(res.json().status=="success"){
	// 	              let result = res.json();
	// 	              console.log(result);
	// 	            }
	// 	            else{
	// 	              let alert = this.alertCtrl.create({
	// 	                  title: 'Error',
	// 	                  subTitle: res.json().error,
	// 	                  buttons: ['OK']
	// 	              });
	// 	              alert.present();
	// 	            }
	// 	          }, (err) => {
	// 	            let alert = this.alertCtrl.create({
	// 	                  title: 'Error!',
	// 	                  subTitle: "Something went wrong, Please try again later",
	// 	                  buttons: ['OK']
	// 	              });
	// 	              alert.present();
	// 	        });
	// 	          }, 3000);
	// 	      });

	// }

  offer(from:string, to:string, date:any){
  	this.from = from;
  	this.to= to;
  	this.storage.get('api_token').then((val) => {
    let data = JSON.stringify({
      from: from, 
      to: to,
      ride_date: date,
      api_token: val
    });
    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    let rideId = 0;

    this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/offer?', data, options)
      .subscribe((res) => {   
        if(res.json().status == "success"){
        	this.rideId = res.json().id;
	  		var from = this.from;
	  		var to = this.to;
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
    					let data2 = JSON.stringify({
      						path: poly,
							api_token: val,
							id: this.rideId
						});
					    let headers2 = new Headers({
					      'Content-Type' : 'application/json'
					    });
				    let options2 = new RequestOptions({ headers: headers2 });
				    this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/offer?', data2, options2)
				      .subscribe((res) => {   
				        if(res.json().status == "success"){
				          console.log("success");
				                      this.LoadactiveProvider.active();
				        }
				      }, (err) => {
				        console.log(err);
				        }
				      );
				    });
	      		} else{
	        		window.alert('Directions request failed due to ' + status + " " + response);
	        		console.log(response);
	      		}
	   		 });
            let toast = this.toastCtrl.create({
              message: 'Location was set Successfully',
              duration: 3000
            });
            toast.present();
        }
      }, (err) => {
        console.log(err);
        }
      );
    });
  }

 	trackAndDraw(from:string, to:string, long:number, lat:number){
		this.from= from;
		this.to = to;
		this.trackLat = lat;
		this.trackLong = long;
		console.log(this.trackLat);
	}

  decode(encoded){
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
}
