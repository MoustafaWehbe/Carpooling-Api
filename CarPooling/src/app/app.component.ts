import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
import { OtpPage } from '../pages/otp/otp';
import { ProfilePage } from '../pages/profile/profile';
import { LogInPage } from '../pages/log-in/log-in';
import { RidePage } from '../pages/ride/ride';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";




@Component({
  templateUrl: 'app.html'
})
export class MyApp { 
  rootPage:any;

  constructor(platform: Platform, cache: CacheService, private statusBar: StatusBar, splashScreen: SplashScreen, private storage:Storage) {
      
    platform.ready().then(() => {
      this.storage.get('api_token').then((val) => {
        if(val)
          this.rootPage = TabsPage;  
          else
            this.rootPage = LogInPage; 
        });   

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.statusBar.overlaysWebView(true);
      cache.setDefaultTTL(60 * 60 * 12);
       // Keep our cached results when device is offline!
      cache.setOfflineInvalidate(false);
      // this.statusBar.backgroundColorByHexString('#000000');
    });
  }
}
