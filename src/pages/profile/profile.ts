import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from "firebase";
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: any = {};
  storageref = firebase.storage().ref();
  bookings: any = [];
  complete: any = 0;
  cancel: any = 0;
  total: any = 0;

  constructor(public service: SettingsProvider, public camera: Camera, public setting: SettingsProvider, public alertCtrl: AlertController, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.service.startLoading();
    this.afs.doc(`users/${localStorage.getItem('user')}`).valueChanges().subscribe(res => {
      this.user = res;
      this.service.stopLoading();

    }, err => {
      this.service.stopLoading();
      this.service.presentToast('Something went wrong')
    });

    let userRef = this.afs.collection('bookingMaster').ref.where('userId', '==', localStorage.getItem('user'));
    userRef.get().then((result) => {
      result.forEach(doc => {
        if (doc.data().status == 1) {
          this.total++;
        }
        if (doc.data().status == 2) {
          this.complete++;
        }
        if (doc.data().status == 3) {
          this.cancel++;
        }
        this.bookings.push(doc.data())
      })
    }, err => {
    })
  }

  doConfirm(get) {
    let alert = this.alertCtrl.create({
      message: 'Upload photo from ?',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.addOne(get)
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takeOne(get)
          }
        }
      ]
    });

    alert.present();
  }

  takeOne(get) {
    this.setting.startLoading();
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      if (imageData) {
        let t = setInterval(() => {
          if (imageData) {
            clearInterval(t);
            this.setting.presentToast('please wait.. Its take some times..')
            if (get == 1) {
              this.user.image = 'data:image/jpg;base64,' + imageData;
              this.setting.stopLoading();

            }
            else if (get == 2) {
              this.user.coverImage = 'data:image/jpg;base64,' + imageData;
              this.setting.stopLoading();

            }
            const filename = Math.floor(Date.now() / 1000);
            this.storageref.child(filename + '.jpg').putString(imageData, 'base64').then(snapshot => {
              this.storageref.child(filename + '.jpg').getDownloadURL().then(r => {

              }, err => {
                this.setting.stopLoading();

              })
            }).catch(uploaderr => {
              this.setting.stopLoading();

            });
          }
        }, 1000)
      }
    }, (err) => {
      this.setting.stopLoading();

    });
  }

  addOne(get) {
    this.service.startLoading();
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      if (imageData) {
        if (get == 1) {
          this.user.image = 'data:image/jpg;base64,' + imageData;
          this.service.stopLoading();
        }
        else if (get == 2) {
          this.user.coverImage = 'data:image/jpg;base64,' + imageData;
          this.service.stopLoading();
        }
        this.setting.presentToast('please wait.. Its take some times..')
        const filename = Math.floor(Date.now() / 1000);
        this.storageref.child(filename + '.jpg').putString(imageData, 'base64').then(snapshot => {
          this.storageref.child(filename + '.jpg').getDownloadURL().then(r => {

          }, err => {
            this.service.stopLoading();
          })
        }).catch(uploaderr => {
          this.service.stopLoading();
        });
      }
    }, (err) => {
      this.service.stopLoading();

    });
  }

  updatePro() {
    this.user.id = localStorage.getItem('user');
    let userDoc = this.afs.doc<any>('users/' + localStorage.getItem('user'));
    userDoc.update(this.user)
    this.service.presentToast('Update successfully')
  }

  GoToBack() {
    this.navCtrl.pop();
  }
}
