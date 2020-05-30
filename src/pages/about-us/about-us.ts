import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  data: any = {};
  about: any = {};
  constructor(public service:SettingsProvider,public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.service.startLoading();
    let itemsCollection4 = this.afs.collection(`mainAdminConfiguration`);
    this.data = itemsCollection4.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

    this.data.forEach(element => {
      this.about = element[0]
      this.service.stopLoading();
    });
  }

  GoToBack() {
    this.navCtrl.pop()
  }

}
