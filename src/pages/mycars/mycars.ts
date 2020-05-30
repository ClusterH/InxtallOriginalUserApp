import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AddCarPage } from '../add-car/add-car';
import { AngularFirestore } from '@angular/fire/firestore';
import { SettingsProvider } from '../../providers/settings/settings';
import { UpdateCarPage } from '../update-car/update-car';

@IonicPage()
@Component({
  selector: 'page-mycars',
  templateUrl: 'mycars.html',
})
export class MycarsPage {
  items: any = [];

  constructor(public service:SettingsProvider,public alertCtrl: AlertController, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {

    this.service.startLoading();

    let userRef = this.afs.collection('carMaster').ref.where('UserId', '==', localStorage.getItem('user'));
    userRef.get().then((result) => {
      result.forEach(doc => {
        this.items.push({
          id: doc.id,
          data: doc.data()
        })
      })
    this.service.stopLoading();
    }, err => {
    this.service.stopLoading();
    this.service.presentToast('Something went wrong')
    })
  }

  ionViewDidLoad() {
    
  }

  addCar() {
    this.navCtrl.push(AddCarPage)
  }

  update(data) {
   this.navCtrl.push(UpdateCarPage,{data:data})
  }

  delete(key) {
    
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want remove this car?',
      message: 'If this cars booking is remaining then its against our policy ?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.afs.doc<any>('carMaster/' + key).delete();
            let index = this.items.map(function (item) {
              return item.id
            }).indexOf(key);
            this.items.splice(index, 1);
            this.service.presentToast('Deleted successfully')
          }
        }
      ]
    });

    alert.present();
  }

  GoToBack() {
    this.navCtrl.pop()
  }

}
