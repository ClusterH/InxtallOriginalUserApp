import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  FAQs: any = [];
  constructor(public service: SettingsProvider, private afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    let userDoc;

    this.service.startLoading();

    let itemsCollection4 = this.afs.collection(`faq`);
    userDoc = itemsCollection4.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    userDoc.forEach(element => {

      this.FAQs = element;
      this.service.stopLoading();

    });
  }

  ionViewDidLoad() {

  }

  GoToBack() {
    this.navCtrl.pop();
  }

}
