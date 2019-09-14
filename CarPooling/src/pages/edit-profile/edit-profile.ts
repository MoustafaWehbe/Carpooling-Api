import { Component } from '@angular/core';
import { IonicPage, NavController, Tabs, NavParams, Slides, , ModalController, AlertController, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ProfilePage} from '../profile/profile';
import { LoadprofileProvider } from '../../providers/loadprofile/loadprofile';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
	first_name:string;
  last_name:string;
	phone:string;
	gender:string;
	type:string;
	model:any;
	drivingLicense:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public storage:Storage, public alertCtrl:AlertController, public LoadprofileProvider:LoadprofileProvider) {
  	
  }

  ionViewDidLoad() {
    this.first_name = this.navParams.get('first_name');
    this.last_name = this.navParams.get('last_name');
    this.phone = this.navParams.get('phone');
    this.gender = this.navParams.get('gender');
    this.type = this.navParams.get('type');
    this.model = this.navParams.get('model');
    this.drivingLicense = this.navParams.get('drivingLicense');
  }

  update(){
    this.storage.get('api_token').then((val) => {
          let data = JSON.stringify({
                api_token: val,
                first_name:this.first_name,
                last_name: this.last_name,
                phone:this.phone,
                gender:this.gender,
                model:this.model,
                type:this.type,
                driving_license:this.drivingLicense
            });
          console.log(data);
        let headers = new Headers({
          'Content-Type' : 'application/json'
        });
        let options = new RequestOptions({ headers: headers }); 
        this.http.post('http://ec2-34-242-107-211.eu-west-1.compute.amazonaws.com/api/v1/profile/update?', data, options)
          .subscribe(res => {
            console.log("yesssss", JSON.stringify(res));
            //write your logic once otp validation is done
            if(res.json().status=="success"){
              this.navCtrl.pop();
              this.LoadprofileProvider.loadprofile();
            }
            else{
              let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: res.json().error + ",\n " ,
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
