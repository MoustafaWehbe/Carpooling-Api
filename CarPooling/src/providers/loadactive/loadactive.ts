import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component, ViewChild, NgZone} from '@angular/core';
import { IonicPage, NavController, Tabs, Slides, NavParams, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LoadactiveProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadactiveProvider {

	public rideOffered:any = [];
  	public accepted_offer:any =[];
  	public myRequest:any =[];
  	public available_offers:any =[];
  	loader:any;

  constructor(public http: Http, public storage:Storage,public loadingCtrl:LoadingController, public alertCtrl:AlertController) {
    console.log('Hello LoadactiveProvider Provider');
  }
  showLoader(msg) { //call this fn to show loader
        this.loader = this.loadingCtrl.create({
            content: msg,
        });
        this.loader.present();    
    }

   active(){
   	var msg = "Loading rides";
	this.showLoader(msg);
    this.storage.get('api_token').then((val) => {
        let data = JSON.stringify({
              api_token: val
          });
        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/active?', data, options)
          .subscribe(res => {
            if(res.json().status=="success"){
              let result = res.json();
              if(result.ride_offer)
              	this.rideOffered.push(result.ride_offer.from, result.ride_offer.to, result.ride_offer.ride_date, result.ride_offer.passengers_notified, result.ride_offer.id);
              console.log(this.rideOffered);
              if(result.ride_request){
	              	this.myRequest.push(result.ride_request.id, result.ride_request.from, result.ride_request.to, result.ride_request.ride_date, result.ride_request.ride_offer, result.ride_request.user_id);
	              //if the ride is accepted get it
	              if(result.ride_request.accepted_offer){
	                var acc = result.ride_request.accepted_offer;
	                this.accepted_offer.push(acc.driver.first_name, acc.driver.last_name, acc.driver.gender, acc.driver.phone,
	                acc.ride.from, acc.ride.to, acc.ride.ride_date, acc.vehicle.type, acc.vehicle.model, acc.driver.id);
	                this.available_offers = [];
	              }
	              else if(result.ride_request.available_offers){
	                for(var i=0; i<result.ride_request.available_offers.length; i++){
	                  var av = result.ride_request.available_offers;
	                  this.available_offers[i] = av[i].driver.first_name+"/"+av[i].driver.last_name+"/"+av[i].driver.gender+"/"+av[i].driver.phone+"/"+
	                  av[i].ride.from+"/"+av[i].ride.to+"/"+av[i].ride.ride_date+"/"+av[i].vehicle.type+"/"+av[i].vehicle.model +"/"+
	                  av[i].ride.id+"/" + result.ride_request.id;
	                }
	                console.log(this.available_offers);
	              }
          	}
              console.log(result.ride_offer);
				this.loader.dismiss();
            }
            else{
              let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: res.json().message,
                  buttons: ['OK']
              });
              alert.present();
            }
          }, (err) => {
            let alert = this.alertCtrl.create({
                  title: 'Error!',
                  subTitle: "Something went wrong, Please try again later",
                  buttons: ['OK']
              });
              alert.present();
        });
      });
  }


}
