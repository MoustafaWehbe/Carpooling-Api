import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, Slides, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';




/**
 * Generated class for the PrizesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prizes',
  templateUrl: 'prizes.html',
})
export class PrizesPage {
	@ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;

  SwipedTabsIndicator :any= null;
  tabs:any=[];
  users:any=[];
  loader:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public http:Http, private alertCtrl: AlertController, public loadingCtrl:LoadingController) {
  	      this.tabs=["LeaderBoard","My Prizes"];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrizesPage');
    this.getLeaderBoard();
  }

ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

  selectTab(index) {    
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }
  showLoader() { //call this fn to show loader
    this.loader = this.loadingCtrl.create({
        content: `Loading Please Wait...`,
    });
    this.loader.present();    
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


  getLeaderBoard(){
    this.showLoader();
    this.storage.get('api_token').then((val) => {
        let data = JSON.stringify({
              api_token: val,
          });

        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/user/leaderboard?', data, options)
          .subscribe(res => {
            if(res.json().status=="success"){
              let result = res.json();
              this.users = result.users;
              console.log(this.users[0]);
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
          this.loader.dismiss();
      });

  }


}
