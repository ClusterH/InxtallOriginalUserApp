import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the UpdateCarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-car',
  templateUrl: 'update-car.html',
})
export class UpdateCarPage {
  update: any;
  storageref = firebase.storage().ref();

  constructor(public service: SettingsProvider, public afs: AngularFirestore, public actionSheetCtrl: ActionSheetController, public camera: Camera, public navCtrl: NavController, public navParams: NavParams) {
    this.update = this.navParams.get('data').data;
    this.update.id = this.navParams.get('data').id

  }

  ionViewDidLoad() {

  }

  updateThis() {
    if (this.update.Color != '' &&
      this.update.Number != '' &&
      this.update.Brand != '' &&
      this.update.Model != '' &&
      this.update.Type != '' && this.update.image_1 != 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg' && this.update.image_2 != 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg' && this.update.image_3 != 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg') {


      let userDoc = this.afs.doc<any>('addressMaster/' + this.update.id);
      userDoc.update(this.update)
      this.service.presentToast('Update successfully..')
      this.navCtrl.pop();
    }
    else {
      this.service.presentToast('Null fields are not allowed..');
    }
  }

  presentActionSheet(get) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Method',
      buttons: [
        {
          text: 'Add Photo',
          role: 'destructive',
          handler: () => {

            this.addOne(get)
          }
        },
        {
          text: 'Take Photo',
          handler: () => {

            this.takeOne(get)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  takeOne(get) {
    this.service.startLoading();
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

            if (get == 1) {
              this.update.image_1 = 'data:image/jpg;base64,' + imageData;
              this.service.stopLoading();

            }
            else if (get == 2) {
              this.update.image_2 = 'data:image/jpg;base64,' + imageData
              this.service.stopLoading();

            }
            else if (get == 3) {
              this.update.image_3 = 'data:image/jpg;base64,' + imageData
              this.service.stopLoading();

            }
            const filename = Math.floor(Date.now() / 1000);
            this.storageref.child(filename + '.jpg').putString(imageData, 'base64').then(snapshot => {
              this.storageref.child(filename + '.jpg').getDownloadURL().then(r => {
                this.service.presentToast('please wait.. Its take some times..')


              }, err => {
                this.service.stopLoading();

              })
            }).catch(uploaderr => {
              this.service.stopLoading();

            });
          }
        }, 1000)
      }
    }, (err) => {
      this.service.stopLoading();

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
      let t = setInterval(() => {
        if (imageData) {
          clearInterval(t);
          if (get == 1) {
            this.update.image_1 = 'data:image/jpg;base64,' + imageData
            this.service.stopLoading();
          }
          else if (get == 2) {
            this.update.image_2 = 'data:image/jpg;base64,' + imageData
            this.service.stopLoading();
          }
          else if (get == 3) {
            this.update.image_3 = 'data:image/jpg;base64,' + imageData
            this.service.stopLoading();
          }
          const filename = Math.floor(Date.now() / 1000);
          this.storageref.child(filename + '.jpg').putString(imageData, 'base64').then(snapshot => {
            this.storageref.child(filename + '.jpg').getDownloadURL().then(r => {
              this.service.presentToast('please wait.. Its take some times..')



            }, err => {
              this.service.stopLoading();

            })
          }).catch(uploaderr => {
            this.service.stopLoading();

          });
        }
      }, 1000)
    }, (err) => {

      this.service.stopLoading();

    });
  }

  GoToBack() {
    this.navCtrl.pop()
  }
}
