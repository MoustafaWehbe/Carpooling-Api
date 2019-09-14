import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LogInPage } from '../log-in/log-in';
import { HistoryPage } from '../history/history';
import { Http, Headers, RequestOptions } from '@angular/http';



/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',    
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private http: Http, private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }
  logout(){
  		this.storage.clear();
  		this.navCtrl.push(LogInPage);
  }


  test(){
  	this.storage.get('api_token').then((val) => {
        this.storage.clear();
        console.log(val);   
        }); 
  }
  history(){
  	this.navCtrl.push(HistoryPage);
  }

}
