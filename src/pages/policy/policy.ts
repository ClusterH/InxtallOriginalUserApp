import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the PolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-policy',
  templateUrl: 'policy.html',
})
export class PolicyPage {
  data: any = {};
  policy: any = {};
  constructor(public service: SettingsProvider, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.service.startLoading();

    let itemsCollection4 = this.afs.collection(`mainAdminConfiguration`);
    this.data = itemsCollection4.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

    this.data.forEach(element => {
      this.policy = element[0]
      this.service.stopLoading();
    });
  }

  ionViewDidLoad() {

  }

}
