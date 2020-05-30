import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomepagePage } from '../homepage/homepage';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-verify-no',
  templateUrl: 'verify-no.html',
})
export class VerifyNoPage {
  otp: any = '';
  userData: any = {}
  confirmationResult: any
  constructor(public menuCtrl: MenuController, public settings: SettingsProvider, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.confirmationResult = this.navParams.get('confirmationResult');
    this.userData = this.navParams.get('data');

    this.menuCtrl.close();
    this.menuCtrl.swipeEnable(false)

  }

  ionViewDidLoad() {

  }

  GoToNext() {
    let userDat = this.userData;
    let st: any;

    this.confirmationResult.confirm(this.otp).then(function (result: any) {

      st = result.user.uid;

    }, err => {
      this.settings.presentToast('Invalid OTP');
    })

    setTimeout(() => {
      if (st) {
        localStorage.setItem('user', st);
        let itemsCollection = this.afs.collection('users');
        itemsCollection.doc(st).set(userDat);
        this.settings.presentToast('Registered Successfully...')
        this.navCtrl.setRoot(HomepagePage)
      }
      else {
        this.settings.presentToast('Invalid OTP');
      }
    }, 4000);
  }

  GoBack() {
    this.navCtrl.pop();
  }

}
