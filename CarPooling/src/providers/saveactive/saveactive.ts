import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IonicPage, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoadactiveProvider } from '../loadactive/loadactive';


@Injectable()
export class SaveactiveProvider {
	driver_info:any=[];
  	driver_vehicle:any=[];
  	ride_info:any=[];
  	loader:any;

  constructor(public loadingCtrl:LoadingController, public http: Http, public storage:Storage,
   public toastCtrl:ToastController, public alertCtrl:AlertController,
   public LoadactiveProvider:LoadactiveProvider) {
    console.log('Hello SaveactiveProvider Provider');
  }

   showLoader(msg) { //call this fn to show loader
        this.loader = this.loadingCtrl.create({
            content: msg,
        });
        this.loader.present();    
    }


  get(from:string, to:string, f:any, t:any, date:any){
  	var msg = "Please wait while looking for the best ride for you";
    this.showLoader(msg);    
   	this.storage.get('api_token').then((val) => {
   	    let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
  	 	let data = JSON.stringify({
            from:from,
            to:to,
            f: f,
            t:t,
            ride_date: date,
            api_token: val
          });
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/request?', data, options)
          .subscribe(res => {
            if(res.json().status=="success"){
              this.LoadactiveProvider.active();

              //var bestRide = res.json().best_ride;
             if(res.json().available_offers){
                let toast = this.toastCtrl.create({
                  message: 'You have a new ride request, check active rides!',
                  duration: 4000
                });
                toast.present();
              }
              this.loader.dismiss();
            }
            else{
              let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: res.json().message,
                  buttons: ['OK']
              });
              alert.present();
              this.loader.dismiss();
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
