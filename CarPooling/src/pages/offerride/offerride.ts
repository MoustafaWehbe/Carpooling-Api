import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Tabs, NavParams, ViewController, ToastController, App } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomemapProvider } from '../../providers/homemap/homemap';
import { Events } from 'ionic-angular';


/**
 * Generated class for the OfferridePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-offerride',
  templateUrl: 'offerride.html',
})
export class OfferridePage {
	// @ViewChild('From') from;
	// @ViewChild('To') to;
	// @ViewChild('Date') date;
	// @ViewChild('myTabs') tabRef: Tabs;
    @ViewChild('from2') from2;

  type ='';
  model ='';
  license = '';
  Date = '';
  constructor(public events: Events,public HomemapProvider:HomemapProvider, private storage:Storage, public app: App, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public http: Http) {
          this.addAutoComplete();
  }

  ionViewDidLoad() {  
    if(this.navParams.data.isFilled==0){
      document.getElementById("fixed").style.display = "none";
      document.getElementById("vehicleInfo").style.display = "";
    }
    else{
      document.getElementById("fixed").style.display = "";
      document.getElementById("vehicleInfo").style.display = "none";
    }

    console.log('ionViewDidLoad OfferridePage');
        this.addAutoComplete();

         //console.log("from5 " + document.getElementById("from"));
  }
  dismiss() {
  let data = { 'foo': 'bar' };
   this.viewCtrl.dismiss(data);
 }

  addAutoComplete(){
     var autoCompleteFrom;
     var autoCompleteTo;
     
     console.log("from " + document.getElementById("from"));
      autoCompleteFrom = new google.maps.places.Autocomplete(
      (document.getElementById('from')),{types: ['geocode']});
      //autocomplete.addListener('place_changed', this.showAuto);

          autoCompleteTo = new google.maps.places.Autocomplete(
            (document.getElementById('to')),{types: ['geocode']});
              //autocomplete.addListener('place_changed', this.showAuto);
  }

 offer(){ 
    var From = (<HTMLInputElement>document.getElementById("from")).value;
    var To = (<HTMLInputElement>document.getElementById("to")).value;
    this.HomemapProvider.offer(From, To, this.Date);
    this. dismiss();
 	    // (this.navCtrl.parent as Tabs).select(1);    
 }

 next(){
    var type = this.type;
    var model = this.model;
    var license = this.license;
    //GetprofileProvider.getprofile(type, model, license);
    this.storage.get('api_token').then((val) => {
    let data = JSON.stringify({
      type: type,
      model: model,
      driving_license: license,
      api_token: val
    });
    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/vehicle/update?', data, options)
      .subscribe((res) => {   
        if(res.json().status == "success"){
          document.getElementById("vehicleInfo").style.display ="none";
          document.getElementById("fixed").style.display = "";
        }
      }, (err) => {
        console.log(err);
        }
      );
    });
    //console.log(this.navParams.data.isFilled);
    // }, 3000);
  }
}
