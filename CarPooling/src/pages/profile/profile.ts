 import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../popover/popover'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LogInPage } from '../log-in/log-in';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { LoadprofileProvider } from '../../providers/loadprofile/loadprofile';



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public imageURL:any =null;
  points:string;
  first_name:string;
  last_name:string;
  phone:string;
  gender:string;
  type1: string;
  model:string;
  drivingLicense:string;
  RequestOptions:any;
  loader:any;

  constructor(public loadingCtrl:LoadingController, public alertCtrl: AlertController, public http:Http, 
    public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, 
    private camera: Camera, public actionSheetCtrl: ActionSheetController, private platform:Platform, 
    private storage: Storage, public LoadprofileProvider:LoadprofileProvider) {
      this.imageURL = "assets/imgs/defaultProfile.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.loadUserInfo();
  }
  showLoader() { //call this fn to show loader
        this.loader = this.loadingCtrl.create({
            content: `Loading Please Wait...`,
        });
        this.loader.present();    
    }
    edit(){
      this.first_name = this.LoadprofileProvider.first_name;
      console.log(this.first_name);
       this.last_name = this.LoadprofileProvider.last_name;
       this.phone = this.LoadprofileProvider.phone;
       this.gender = this.LoadprofileProvider.gender;
       this.type1 = this.LoadprofileProvider.type1;
       this.model = this.LoadprofileProvider.model;
       this.drivingLicense = this.LoadprofileProvider.drivingLicense;
      this.navCtrl.push(EditProfilePage, {first_name: this.first_name, last_name:this.last_name, phone:this.phone, gender: this.gender, type1:this.type1, model:this.model, drivingLicense:this.drivingLicense});
    }

  loadUserInfo(){
      this.LoadprofileProvider.loadprofile();
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }
  chooseImage(){
    if(this.platform.is("ios")||this.platform.is("android")){
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Option',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Take photo',
            role: 'destructive',
            icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
            handler: () => {
              this.takephoto();
            }
          },
          {
            text: 'Choose photo from Gallery',
            icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
            handler: () => {
              this.openGallery();
            }
          },
        ]
      });
      actionSheet.present();
    }
    else{
      document.getElementById('my_file').click();
      // document.getElementById('my_file').onchange=function(){
        
      //     var file    = document.querySelector('input[type1=file]').files[0];
      //     var reader  = new FileReader();

      //       reader.addEventListener("load", function(){
      //         console.log(reader.result);
      //         // this.imageURL ='data:image/jpeg;base64,' + reader.result;
      //         document.getElementById("profileImage").src = reader.result;
      //       }, false);
      //         if(file)
      //          reader.readAsDataURL(file); 
      // }
    }
  }

  openGallery(){
    const options: CameraOptions = {
       quality: 100,
       destinationType: this.camera.DestinationType.DATA_URL,
       encodingType: this.camera.EncodingType.JPEG,
       mediaType: this.camera.MediaType.PICTURE,
       sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
     }
 
     this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64:
       let base64Image = 'data:image/jpeg;base64,' + imageData;
       this.imageURL = base64Image;
       // document.getElementById("profileImage").src="this.base64Image";
       // this.photos.push(this.base64Image);
       // this.photos.reverse();
     }, (err) => {
       // Handle error
     })
  }
  takephoto(){
    console.log("openCamera");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageURL = base64Image;
    }, (err) => {
     // Handle error
    });
  }

}

