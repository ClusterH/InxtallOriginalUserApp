import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { SettingsProvider } from '../../providers/settings/settings';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  email: any;
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  con: any;
  otp: any;
  userKey: any;
  constructor(public api: RestProvider, public menuCtrl: MenuController, public alertCtrl: AlertController, public service: SettingsProvider, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.menuCtrl.close();
    this.menuCtrl.swipeEnable(false)
  }

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  GoBack() {
    this.navCtrl.pop()
  }

  resetPassword() {

    if(this.email != undefined){
      this.api.resetPassword(this.email).then(res => {
        this.service.presentToast('Email has been sent to your respective email address..')
      }, err => {
      this.service.presentToast(err.message)

      })
    }
    else{
      this.service.presentToast('Email address must be required')
    }
  }
}
