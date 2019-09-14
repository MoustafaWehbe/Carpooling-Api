import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IonicPage, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/*
  Generated class for the GetprofileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetprofileProvider {
	public message: any;

  constructor(private storage:Storage, private alertCtrl: AlertController, public http:Http) {
    console.log('Hello GetprofileProvider Provider');
  }
	 getProfile(type:string, model:string, license:string) { 
	 	console.log("hi");
		let data = JSON.stringify({
                  type: type,
                  model: model,
                  driving_license: license
                });
                let headers = new Headers({
                  'Content-Type' : 'application/json'
                });
                let options = new RequestOptions({ headers: headers });
                this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/vehicle/update?', data, options)
                  .subscribe((res) => {   
                    console.log(res);
                  }, (err) => {
                    console.log(err);
                    }
                  );

















	 //  	this.storage.get('api_token').then((val) => {
	 //        let data = JSON.stringify({
	 //              api_token: val
	 //          });

	 //        let headers = new Headers({
	 //          'Content-Type' : 'application/json'
	 //        });
	 //        let options = new RequestOptions({ headers: headers });
	 //        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/user/profile?', data, options)
	 //          .subscribe(res => {
	 //            console.log("yesssss", JSON.stringify(res));
	 //            //write your logic once otp validation is done
	 //            if(res.json().status=="success"){
	 //              let result = res.json();
	 //              console.log(result);
	 //              this.message = result;
	 //              return result;
	 //            }
	 //            else{
	 //              let alert = this.alertCtrl.create({
	 //                  title: 'Error',
	 //                  subTitle: res.json().message,
	 //                  buttons: ['OK']
	 //              });
	 //              alert.present();
	 //            }
	 //          }, (err) => {
	 //            let alert = this.alertCtrl.create({
	 //                  title: 'Error!',
	 //                  subTitle: "Something went wrong, Please try again later",
	 //                  buttons: ['OK']
	 //              });
	 //              alert.present();
	 //        });
	 //      });
   }
}