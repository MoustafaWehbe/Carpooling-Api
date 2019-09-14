import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RidePage } from '../pages/ride/ride';
import { PrizesPage } from '../pages/prizes/prizes';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { OtpPage } from '../pages/otp/otp';
import { LogInPage } from '../pages/log-in/log-in';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { PopoverPage } from '../pages/popover/popover';
import { OfferridePage } from '../pages/offerride/offerride';
import { HistoryPage } from '../pages/history/history';
import { GetridePage } from '../pages/getride/getride';
import { HttpModule } from '@angular/http';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { CacheModule } from 'ionic-cache';
import { GetprofileProvider } from '../providers/getprofile/getprofile';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { HomemapProvider } from '../providers/homemap/homemap';
import { SaveactiveProvider } from '../providers/saveactive/saveactive';
import { LoadactiveProvider } from '../providers/loadactive/loadactive';
import { LoadprofileProvider } from '../providers/loadprofile/loadprofile';


@NgModule({
//directives
  declarations: [
    MyApp,
    RidePage,
    PrizesPage,
    ProfilePage,
    HomePage,
    SignupPage,
    OtpPage,
    PopoverPage,
    LogInPage,
    OfferridePage,
    GetridePage,
    TabsPage,
    HistoryPage,
    EditProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,    
    IonicImageViewerModule,
    IonicStorageModule.forRoot(),
    CacheModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RidePage,
    PrizesPage,
    ProfilePage,
    HomePage,
    SignupPage,
    OtpPage,
    PopoverPage,
    LogInPage,
    OfferridePage,
    GetridePage,
    TabsPage,
    HistoryPage,
    EditProfilePage
  ],
  providers: [
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GetprofileProvider,
    LocationTrackerProvider,
    BackgroundGeolocation,
    HomemapProvider,
    SaveactiveProvider,
    LoadactiveProvider,
    LoadprofileProvider
  ]
})
export class AppModule {}
