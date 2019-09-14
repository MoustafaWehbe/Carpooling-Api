import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import {Http, Headers, RequestOptions } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';



/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {
  email ='';
  password='';
  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http, private alertCtrl: AlertController, private storage:Storage) {
     storage.get('api_token').then((val) => {
        if(val)
          this.navCtrl.push(TabsPage);
        console.log(val);   
        });   
    // this.storage.get('api_token').then((val) => {
    // });   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
  }



  signInUser(){
    let data = JSON.stringify({
    email: this.email,
    password: this.password,
    });

    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/login?', data, options)
      .subscribe((res) => { 
        if(res.json().error){
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: res.json().error,
            buttons: ['OK']
          });
          alert.present();
        }

        else{
          this.storage.set("api_token", res.json().user.api_token);
          console.log("token ", res.json().user.api_token);
          this.navCtrl.push(TabsPage);


          this.storage.get("api_token").then((val) => {
            console.log(val);   
            }); 
        }
      }, (err) => {
        console.log(err);
        }
      );
  }
  register(){
  	this.navCtrl.push(SignupPage);
  }

}
