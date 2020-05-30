import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { VerifyNoPage } from '../pages/verify-no/verify-no';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { HomepagePage } from '../pages/homepage/homepage';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { IonicSwipeAllModule } from 'ionic-swipe-all';
import { AnimationService, AnimatesDirective } from 'css-animator';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from '@angular/fire';
import { RestProvider } from '../providers/rest/rest';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation';
import { SettingsProvider } from '../providers/settings/settings';
import { MarchantPage } from '../pages/marchant/marchant';
import { ModalPage } from '../pages/modal/modal';
import { BookingsPage } from '../pages/bookings/bookings';
import { BookingConformationPage } from '../pages/booking-conformation/booking-conformation';
import { AddCarPage } from '../pages/add-car/add-car';
import { PackageInfoPage } from '../pages/package-info/package-info';
import { Camera } from '@ionic-native/camera';
import { RatingPage } from '../pages/rating/rating';
import { StatusBar } from '@ionic-native/status-bar';
import { MycarsPage } from '../pages/mycars/mycars';
import { AddressPage } from '../pages/address/address';
import { DatePickerModule } from 'ion-datepicker';
import { FCM } from '@ionic-native/fcm';
import { ViewMapPage } from '../pages/view-map/view-map';
import { PaymentPage } from '../pages/payment/payment';
import { PayPal } from '@ionic-native/paypal';
import { PolicyPage } from '../pages/policy/policy';
import { AboutUsPage } from '../pages/about-us/about-us';
import { UpdateCarPage } from '../pages/update-car/update-car';
import { DatePicker } from '@ionic-native/date-picker';
import { FaqPage } from '../pages/faq/faq';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { HttpModule } from '@angular/http';

export const config = {
  apiKey: "AIzaSyBpSxDGSo3-UqkMy3_rsqxS01NxXz8ulRQ",
  authDomain: "carboy-b8b78.firebaseapp.com",
  databaseURL: "https://carboy-b8b78.firebaseio.com",
  projectId: "carboy-b8b78",
  storageBucket: "carboy-b8b78.appspot.com",
  messagingSenderId: "784277590732",
  appId: "1:784277590732:web:1c8e7abf7a928412512869",
  measurementId: "G-5D0T879FK0"
};
@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    SignupPage,
    ProfilePage,
    VerifyNoPage,
    ForgotPasswordPage,
    HomepagePage,
    AnimatesDirective,
    MarchantPage,
    ModalPage,
    BookingsPage,
    BookingConformationPage,
    AddCarPage,
    PackageInfoPage,
    RatingPage,
    MycarsPage,
    AddressPage,
    ViewMapPage,
    PaymentPage,
    PolicyPage,
    AboutUsPage,
    UpdateCarPage,
    FaqPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicSwipeAllModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    DatePickerModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    SignupPage,
    ProfilePage,
    VerifyNoPage,
    ForgotPasswordPage,
    HomepagePage,
    MarchantPage,
    ModalPage,
    BookingsPage,
    BookingConformationPage,
    AddCarPage,
    PackageInfoPage,
    RatingPage,
    MycarsPage,
    AddressPage,
    ViewMapPage,
    PaymentPage,
    PolicyPage,
    AboutUsPage,
    UpdateCarPage,
    FaqPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    NativeGeocoder,
    AnimationService,
    RestProvider,
    Geolocation,
    SettingsProvider,
    SettingsProvider,
    Camera,
    FCM,
    PayPal,
    DatePicker,
    WheelSelector
  ]
})
export class AppModule { }
