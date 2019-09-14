import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Tabs, NavParams, ViewController, ToastController, App, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RidePage } from '../ride/ride';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { SaveactiveProvider } from '../../providers/saveactive/saveactive';


declare var google: any;

@IonicPage()
@Component({
  selector: 'page-getride',
  templateUrl: 'getride.html',
})
export class GetridePage {

	From='';
	To='';
  Date = '';
  driver_info:string;
  driver_vehicle:string;
  ride_info:string;
  loader:any;

  constructor(public SaveactiveProvider:SaveactiveProvider, public loadingCtrl:LoadingController, private alertCtrl:AlertController, private http: Http, private storage: Storage, public app: App, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, private geolocation:Geolocation, private googleMaps: GoogleMaps) {
          this.addAutoComplete();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetridePage');
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
     
      autoCompleteFrom = new google.maps.places.Autocomplete(
      (document.getElementById('from')),{types: ['geocode']});
      //autocomplete.addListener('place_changed', this.showAuto);

          autoCompleteTo = new google.maps.places.Autocomplete(
            (document.getElementById('to')),{types: ['geocode']});
              //autocomplete.addListener('place_changed', this.showAuto);
  }

    showLoader(msg) { //call this fn to show loader
        this.loader = this.loadingCtrl.create({
            content: msg,
        });
        this.loader.present();    
    }

 get(){
 	    // (this.navCtrl.parent as Tabs).select(1);
   // let nav = this.app.getRootNav();
   //     nav.setRoot(TabsPage,{tab: 0, from: this.From, to:this.To});
   //            let toast = this.toastCtrl.create({
   //            message: 'Location was set Successfully',
   //            duration: 3000
   //          });
   //          toast.present();

        var geocoder = new google.maps.Geocoder();
        var from = (<HTMLInputElement>document.getElementById('from')).value;
        var to = (<HTMLInputElement>document.getElementById('to')).value;

        var latFrom:any;
        var longFrom: any;
        var latTo:any;
        var longTo: any;

        geocoder.geocode({ 'address': from}, function(results, status){
          if (status == google.maps.GeocoderStatus.OK) {
            latFrom = results[0].geometry.location.lat();
            longFrom = results[0].geometry.location.lng();
          }   
        });
        geocoder.geocode({ 'address': to}, function(results, status){
          if (status == google.maps.GeocoderStatus.OK) {
            latTo = results[0].geometry.location.lat();
            longTo = results[0].geometry.location.lng();
          }   
        });
        let TIME_IN_MS = 1000;
        let hideFooterTimeout = setTimeout( () => {
          var f = [latFrom, longFrom];
          var t = [latTo, longTo];
          this.SaveactiveProvider.get(from, to, f, t, this.Date);
          this. dismiss();
          }, TIME_IN_MS);

 }
}
