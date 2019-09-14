import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var SMS:any;
declare var document:any;

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
	otp='';
	mobile='';

	constructor(public alertCtrl: AlertController, public platform:Platform, public androidPermissions: AndroidPermissions, public http:Http, public navCtrl:NavController, public navParams: NavParams, private storage: Storage) {
		this.mobile=this.navParams.get('mobile');
		// console.log(this.mobile);
		document.addEventListener('onSMSArrive', function(e){
	      	var sms = e.data;
	     	console.log("received sms "+JSON.stringify( sms ) );
		    //look for your message address
		    //if(sms.address=='HP-611773'){
	        	this.otp=sms.body.substr(0,4);
	      		this.stopSMS();
	      		this.verify_otp();
	     	//}
    	});
		this.checkPermission();
	}
	checkPermission(){
    	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
        success => {  
	        //if permission granted
	        this.receiveSMS();
		},
      	err =>{
        	this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS).
        	then(success=>{
          		this.receiveSMS();
        	},
      		err=>{
        	console.log("cancelled")
      		});
      	});
		this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]); 
    }
    receiveSMS(){
		if(SMS) SMS.startWatch(function(){
			console.log('watching started');
		}, function(){
			console.log('failed to start watching');
			});
	}
	stopSMS(){
    	if(SMS) SMS.stopWatch(function(){
        	console.log('watching stopped');
        }, function(){
        	console.log('failed to stop watching');
      	});
    }
    verifyOTP(){
		console.log("verify otp");
		if(this.mobile.length==0){
			let alert = this.alertCtrl.create({
		  	title: 'OTP Required!',
		  	subTitle: 'Please enter your OTP and proceed',
		  	buttons: ['OK']
		});
		alert.present();
		}
		else{
			this.storage.get('api_token').then((val) => {
				console.log(val);
				let data = JSON.stringify({
			        code: this.otp,
			        api_token: val
			    });
			    console.log(val);
			    console.log(data);

			  let headers = new Headers({
			    'Content-Type' : 'application/json'
			  });
			  let options = new RequestOptions({ headers: headers });
				this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/verify/phone?', data, options)
					.subscribe(res => {
						console.log("yesssss", JSON.stringify(res));
						//write your logic once otp validation is done
						if(res.json().status=="success")
							this.navCtrl.push(TabsPage);
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

	ionViewDidLoad() {
		console.log('ionViewDidLoad OtpPage');
	}

}
