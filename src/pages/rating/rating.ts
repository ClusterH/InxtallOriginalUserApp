import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { SettingsProvider } from '../../providers/settings/settings';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  rateData: any = {}
  giveData: any = {}
  rate: any = 1;
  items: any = {};
  itemsCollection: any;
  constructor(public setting: SettingsProvider, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.rateData = this.navParams.get('data')


    this.afs.doc(`users/${this.rateData.marchantId}`).valueChanges().subscribe(res => {

      this.items = res
    });

    this.giveData.userId = localStorage.getItem('user');
    this.giveData.marchantId = this.rateData.marchantId;
    this.giveData.employeeId = this.rateData.AvailableEmpId;
    this.giveData.bookingId = this.rateData.id;

  }

  ionViewDidLoad() {

  }

  set(r) {
    this.rate = r;
    this.giveData.star = r;
  }

  submit() {
    this.giveData.create_date = moment().format('YYYY-MM-DD HH:mm');

    if (this.giveData.cmt != undefined || this.giveData.star != undefined) {
      this.itemsCollection = this.afs.collection<any>('ratingMaster');
      this.itemsCollection.add(this.giveData)
      this.afs.doc(`bookingMaster/${this.giveData.bookingId}`).valueChanges().subscribe(res => {

        let bookdata: any = res;
        bookdata.reviewGiven = true;
        bookdata.id = this.giveData.bookingId
        let userDoc = this.afs.doc<any>('bookingMaster/' + this.giveData.bookingId);
        userDoc.update(bookdata)
        this.setting.presentToast('Rating successfully');
        this.navCtrl.pop()
      });
    }
    else {
      this.setting.presentToast('Fill all the details')
    }
  }
  GoToBack() {
    this.navCtrl.pop();
  }
}
