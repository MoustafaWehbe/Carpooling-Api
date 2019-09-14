import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
	accOff:any=[];
  	accGet:any=[];
  	unaccOff:any=[];
  	unaccGet:any=[];
  	loader:any;

  constructor(public loadingCtrl:LoadingController, public alertCtrl:AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
    this.loadHistory();
  }
    showLoader(msg) { //call this fn to show loader
        this.loader = this.loadingCtrl.create({
            content: msg,
        });
        this.loader.present();    
    }

  loadHistory(){
  	var msg = "Loading history...";
  	this.showLoader(msg);
    this.storage.get('api_token').then((val) => {
        let data = JSON.stringify({
              api_token: val
          });

        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/me?', data, options)
          .subscribe(res => {
            if(res.json().status=="success"){
              console.log(res.json());
              this.unaccOff = res.json().rides.unaccomplished.offers;
              this.unaccGet = res.json().rides.unaccomplished.requests;
              this.accOff = res.json().rides.accomplished.offers;
              this.accGet = res.json().rides.accomplished.requests;
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
