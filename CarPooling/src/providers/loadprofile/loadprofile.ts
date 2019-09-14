import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';


/*
  Generated class for the LoadprofileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadprofileProvider {
	points:string;
  first_name:string;
  last_name:string;
  phone:string;
  gender:string;
  type1: string;
  model:string;
  drivingLicense:string;
  RequestOptions:any;
  loader:any;

  constructor(public http: Http, public storage:Storage, public alertCtrl:AlertController, public loadingCtrl:LoadingController) {
    console.log('Hello LoadprofileProvider Provider');
  }

	 showLoader() { //call this fn to show loader
	    this.loader = this.loadingCtrl.create({
	        content: `Loading Please Wait...`,
	    });
	    this.loader.present();    
	 }
  loadprofile(){
  	this.showLoader();
        this.storage.get('api_token').then((val) => {
          let data = JSON.stringify({
                api_token: val
            });
        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers }); 
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/user/profile?', data, options)
          .subscribe(res => {
            console.log("yesssss", JSON.stringify(res));
            //write your logic once otp validation is done
            if(res.json().status=="success"){
              let result = res.json();
              console.log(result);
              this.points=result.profile.points;
              this.first_name = result.profile.first_name;
              this.last_name = result.profile.last_name;
              this.phone = result.profile.phone;
              this.gender = result.profile.gender;
              this.drivingLicense = result.profile.driving_license;
              this.type1 = result.vehicle.type;
              this.model = result.vehicle.model;
              this.loader.dismiss();
            }
            else{
              let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: res.json().error,
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
