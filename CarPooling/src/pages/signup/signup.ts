import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ViewController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var require: any;

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  mobile ='';
  FirstName='';
  LastName='';
  email='';
  Password='';
  passConfirmation='';
  gender = '';

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, private storage:Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  
  signup(){
    if(this.mobile.length!=8){
      let alert = this.alertCtrl.create({
        title: 'Mobile Number Required!',
        subTitle: 'Please enter your 8 digit mobile number',
        buttons: ['OK']
      });
    alert.present();
    }
    else{
      let data = JSON.stringify({
        first_name: this.FirstName,
        last_name: this.LastName,
        email: this.email,
        phone: "+961"+this.mobile,
        password: this.Password,
        gender: this.gender,
        password_confirmation: this.passConfirmation
      });

      let headers = new Headers({
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({ headers: headers });
      this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/register?', data, options)
        .subscribe((res) => {   
          this.storage.set("api_token", res.json().api_token);
          this.navCtrl.push(OtpPage,{mobile:this.mobile});
        }, (err) => {
          console.log(err);
          }
        );
    }
  }































  // signup(phoneNumber: number){
  // 	const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
  // 	const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'LB')
  //   console.log("IS PHONE VALID:? ", phoneUtil.isValidNumber(number));

  // }

}
