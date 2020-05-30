import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SigninPage } from '../pages/signin/signin';
import { HomepagePage } from '../pages/homepage/homepage';
import { ProfilePage } from '../pages/profile/profile';
import { BookingsPage } from '../pages/bookings/bookings';
import { AngularFirestore } from '@angular/fire/firestore';
import { MycarsPage } from '../pages/mycars/mycars';
import { AddressPage } from '../pages/address/address';
import { FCM } from '@ionic-native/fcm';
import { AboutUsPage } from '../pages/about-us/about-us';
import { VerifyNoPage } from '../pages/verify-no/verify-no';
import { FaqPage } from '../pages/faq/faq';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = VerifyNoPage;
  pages: Array<{ title: string, component: any, icon: any }>;
  user: any = {};
  constructor(public angularfire: AngularFireAuth, public event: Events, private fcm: FCM, public afs: AngularFirestore, public menuCtrl: MenuController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.event.subscribe('changeLogin', (login) => {
      if (login.login == 0) {
        this.afs.doc(`users/${localStorage.getItem('user')}`).valueChanges().subscribe(res => {
          this.user = res;
        });
      }
    })

    if (localStorage.getItem('user')) {
      this.rootPage = HomepagePage;
      this.afs.doc(`users/${localStorage.getItem('user')}`).valueChanges().subscribe(res => {
        this.user = res;
      });
    }
    else {
      this.rootPage = SigninPage
    }
    this.initializeApp();
    this.pages = [
      { title: 'Home', component: HomepagePage, icon: 'fas fa-home' },
      { title: 'My Garage', component: MycarsPage, icon: 'fas fa-car' },
      { title: 'My Address', component: AddressPage, icon: 'fas fa-address-card' },
      { title: 'My Profile', component: ProfilePage, icon: 'fas fa-user' },
      { title: 'Bookings', component: BookingsPage, icon: 'far fa-credit-card' },
      { title: 'About Us', component: AboutUsPage, icon: 'fas fa-address-card' },
      { title: 'FAQs', component: FaqPage, icon: 'fas fa-question-circle' },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {

          } else {

          };
        });
      }
    });
  }

  openPage(page) {
    this.menuCtrl.close();
    this.nav.push(page.component);
  }

  viewProfile() {
    this.menuCtrl.close();
    this.nav.push(ProfilePage)
  }


  logout() {
    this.angularfire.auth.signOut().then(() => {
      localStorage.clear();

      this.angularfire.auth.signOut();
      this.nav.setRoot(SigninPage)
    });

  }
}
