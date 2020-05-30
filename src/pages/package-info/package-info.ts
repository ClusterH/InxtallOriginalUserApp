import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { BookingConformationPage } from '../booking-conformation/booking-conformation';

@IonicPage()
@Component({
  selector: 'page-package-info',
  templateUrl: 'package-info.html',
})
export class PackageInfoPage {
  packageData: any = {}
  service: any = []
  itemsCollection: any;
  ser: any = [];
  a: any = 0;
  marchant: any = {}
  constructor(public viewCtrl: ViewController, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.packageData = this.navParams.get('packageData');
    this.marchant = this.navParams.get('marchant');
    this.itemsCollection = afs.collection(`service/${this.marchant.id}/service`);

    this.service = this.itemsCollection.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

    this.service.forEach(element1 => {
      element1.forEach(element => {
        this.packageData.service.forEach(element2 => {
          if (element.id == element2) {
            this.ser.push(element);
          }
        });
      });
    });
  }

  Cancel(data) {
    if (data == 2 && this.a == 0) {
      this.a++;
      this.navCtrl.push(BookingConformationPage, { status: 'PACKAGE', packageData: this.packageData, marchant: this.marchant })
    }
    else {
      this.viewCtrl.dismiss();
    }
  }

  GoToNext() {
    this.navCtrl.push(BookingConformationPage, { status: 'PACKAGE', packageData: this.packageData, marchant: this.marchant })
  }
}
