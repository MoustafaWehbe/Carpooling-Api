import { Component, ViewChild, NgZone} from '@angular/core';
import { IonicPage, NavController, Tabs, Slides, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { OfferridePage } from '../offerride/offerride';
import { GetridePage } from '../getride/getride';
import { GetprofileProvider } from '../../providers/getprofile/getprofile';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { SaveactiveProvider } from '../../providers/saveactive/saveactive';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { LoadactiveProvider } from '../../providers/loadactive/loadactive';
import { HomemapProvider } from '../../providers/homemap/homemap';




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
import { HomePage } from '../home/home';

declare var google: any; 


/**
 * Generated class for the RidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@IonicPage()
@Component({
  selector: 'page-ride',
  templateUrl: 'ride.html',
})
export class RidePage {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;

  SwipedTabsIndicator :any= null;
  tabs:any=[];
  isFilled:number=0;
  rideOffered:any = [];
  accepted_offer:any =[];
  myRequest:any =[];
  available_offers:any =[];
  trackLng:any;
  trackLat:any;
  started:boolean = false;
  setInt:any;

  constructor(public SaveactiveProvider:SaveactiveProvider, public http:Http,private storage: Storage,
    private GetprofileProvider:GetprofileProvider, public modalCtrl: ModalController, private alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public LocationTrackerProvider:LocationTrackerProvider, public zone:NgZone, public LoadactiveProvider:LoadactiveProvider, 
    public HomemapProvider:HomemapProvider) {
    this.tabs=["Get Started","Active Rides"]; 

    }

  ionViewDidLoad() {
    this.LoadactiveProvider.active();
    console.log('ionViewDidLoad RidePage');
  }
 
 
offer() {
    //console.log(this.GetprofileProvider.getProfile);
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
            if(res.json().status=="success"){
              let result = res.json();
              if(result.profile && result.vehicle.type && result.vehicle.model){
                let profileModal = this.modalCtrl.create(OfferridePage, { isFilled: 1 });
                profileModal.present();
              }
              else{
                let profileModal = this.modalCtrl.create(OfferridePage, { isFilled: 0 });
                profileModal.present();
              }
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

checkRide(offered_id:number, request_id:number){
  this.storage.get('api_token').then((val) => {
        let data = JSON.stringify({
              api_token: val,
              request_id:request_id,
              offer_id:offered_id
          });

        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/accept?', data, options)
          .subscribe(res => {
            if(res.json().status=="success"){
              let result = res.json();
              console.log(result);
                this.LoadactiveProvider.active();
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


start(){
  this.started = true;
  this.startTracking();
  var long= this.LocationTrackerProvider.lng;
    var lat = this.LocationTrackerProvider.lat;
    this.storage.get('api_token').then((val) => {
    this.setInt = setInterval(() => { 
      this.zone.run(() => {
        this.trackLat = this.LocationTrackerProvider.lat;
        this.trackLng = this.LocationTrackerProvider.lng;
      });
      console.log(this.trackLat);
      let data = JSON.stringify({
        api_token: val,
        long: this.trackLng,
        lat:this.trackLat
      });
      let headers = new Headers({
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({ headers: headers }); 
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/user/track?', data, options)
        .subscribe(res => {
          console.log("yesssss", JSON.stringify(res));
          if(res.json().status=="success"){
            let result = res.json();
            console.log(result);
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
        }, 3000);
      });
  }

  cancel(ride_id:number, type:string){
    if(type=="request"){
      this.storage.get('api_token').then((val) => {
        let data = JSON.stringify({
          api_token: val,
          request_id: ride_id
        });
        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers }); 
          this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/cancel?', data, options)
          .subscribe(res => {
            console.log("yesssss", JSON.stringify(res));
            if(res.json().status=="success"){
              let result = res.json();
              this.LoadactiveProvider.myRequest = [];
              this.LoadactiveProvider.available_offers = [];
              //  this.LoadactiveProvider.accepted_offer=[];
              // this.LoadactiveProvider.active();
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
    else{
       this.storage.get('api_token').then((val) => {
        let data = JSON.stringify({
          api_token: val,
          offer_id: ride_id
        });
        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers }); 
          this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/rides/cancel?', data, options)
          .subscribe(res => {
            console.log("yesssss", JSON.stringify(res));
            if(res.json().status=="success"){
              let result = res.json();
              // this.LoadactiveProvider.active();
              this.LoadactiveProvider.rideOffered = [];
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

  track(from:string, to:string, ride_id:number){  
    this.startTracking();
    var long= this.LocationTrackerProvider.lng;
    var lat = this.LocationTrackerProvider.lat;
    this.storage.get('api_token').then((val) => {
    setInterval(() => { 
      let data = JSON.stringify({
        api_token: val,
        driver_id: ride_id
      });
      let headers = new Headers({
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({ headers: headers }); 
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/user/track?', data, options)
        .subscribe(res => {
          console.log("yesssss", JSON.stringify(res));
          if(res.json().status=="success"){
            let result = res.json();
            var long = result.long;
            var lat = result.lat;
            this.HomemapProvider.trackAndDraw(from, to, long, lat);
            console.log(result);
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
        }, 3000);
      });
  }


















startTracking(){
  this.LocationTrackerProvider.startTracking();
}
stop(){
  this.started =false;
  clearInterval(this.setInt);
  this.LocationTrackerProvider.stopTracking();
}



























get() {
	// var elem = document.getElementById('ride');
	// elem.style.filter='blur(4px)';
  let profileModal = this.modalCtrl.create(GetridePage, { userId: 8675310 });
    profileModal.present();
}
  


ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

  selectTab(index) {    
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  updateIndicatorPosition() {
      // this condition is to avoid passing to incorrect index
    if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
    {
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';
    }
    
    }

  animateIndicator($event) {
    if(this.SwipedTabsIndicator)
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
  }

}

