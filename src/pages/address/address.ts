import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { SettingsProvider } from '../../providers/settings/settings';
import { map } from 'rxjs/internal/operators/map';

/**
 * Generated class for the AddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  wow: any = [];
  carCollection: any = [];
  private itemsCollection: AngularFirestoreCollection;
  constructor(public service: SettingsProvider, public alertCtrl: AlertController, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
  this.service.startLoading();
    this.itemsCollection = afs.collection(`addressMaster`, ref => ref.where('UserId', '==', localStorage.getItem('user')));
    this.carCollection = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    this.service.stopLoading();
  }

  GoToBack() {
    this.navCtrl.pop();
  }

  add() {
    let alert = this.alertCtrl.create({
      title: 'Add Location',
      inputs: [
        {
          name: 'Name',
          placeholder: 'Name'
        },
        {
          name: 'Address',
          placeholder: 'Address',
          type: 'text'
        },
        {
          name: 'Pincode',
          placeholder: 'Pincode',
          type: 'text'
        },
        {
          name: 'Mobile_no',
          placeholder: 'MobileNo',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Add',
          handler: data => {
            
            if(data.Name != undefined && data.Address != undefined && data.Pincode != undefined 
              && data.Mobile_no){
            data.UserId = localStorage.getItem('user')
            let itemsCollection2 = this.afs.collection<any>('addressMaster');
            itemsCollection2.add(data);
            this.service.presentToast('Addeded successfully')
          }
          else{
            this.service.presentToast('All fields must be required')
          }
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  update(data, key) {
    let alert = this.alertCtrl.create({
      title: 'Edit Address',
      inputs: [
        {
          name: 'Name',
          placeholder: 'Username',
          value: data.Name
        },
        {
          name: 'Address',
          placeholder: 'Password',
          value: data.Address
        },
        {
          name: 'Pincode',
          placeholder: 'Password',
          value: data.Pincode
        },
        {
          name: 'Mobile_no',
          placeholder: 'Password',
          value: data.Mobile_no
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Edit',
          handler: data => {
            let userDoc = this.afs.doc<any>('addressMaster/' + key);
            userDoc.update(data)
            this.service.presentToast('Update successfully')
          }
        }
      ]
    });
    alert.present();
  }

  delete(key) {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to remove this address?',
      message: 'If booking is remaining on this address then its against our policy ?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.afs.doc<any>('addressMaster/' + key).delete();
            this.service.presentToast('Deleted successfully')
          }
        }
      ]
    });

    alert.present();
  }

}
