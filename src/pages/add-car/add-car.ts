import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { SettingsProvider } from '../../providers/settings/settings';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from "firebase";
import { MycarsPage } from '../mycars/mycars';
import { PolicyPage } from '../policy/policy';
declare var $: any;
@IonicPage()
@Component({
  selector: 'page-add-car',
  templateUrl: 'add-car.html',
})
export class AddCarPage {
  storageref = firebase.storage().ref();
  car: any = {};
  carImgs: any = {};
  itemsCollection: any;
  img: string;
  constructor(public actionSheetCtrl: ActionSheetController, public camera: Camera, public setting: SettingsProvider, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.car.UserId = localStorage.getItem('user');
    this.car.Color != undefined
    this.car.Number != undefined
    this.car.Brand != undefined
    this.car.Model != undefined
    this.car.Type != undefined

    this.car.image_1 = 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg';
    this.car.image_2 = 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg';
    this.car.image_3 = 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg';
  }

  ionViewDidLoad() {
    $(".flp label").each(function () {
      var sop = '<span class="ch">'; //span opening
      var scl = '</span>'; //span closing
      //split the label into single letters and inject span tags around them
      $(this).html(sop + $(this).html().split("").join(scl + sop) + scl);
      //to prevent space-only spans from collapsing
      $(".ch:contains(' ')").html("&nbsp;");
    })
    var d;
    $(".flp input").focus(function () {
      //calculate movement for .ch = half of input height
      var tm = $(this).outerHeight() / 2 * -1 + "px";
      //label = next sibling of input
      //to prevent multiple animation trigger by mistake we will use .stop() before animating any character and clear any animation queued by .delay()
      $(this).next().addClass("focussed").children().stop(true).each(function (i) {
        d = i * 50;//delay
        $(this).delay(d).animate({ top: tm }, 200, 'easeOutBack');
      })
    })
    $(".flp input").blur(function () {
      //animate the label down if content of the input is empty
      if ($(this).val() == "") {
        $(this).next().removeClass("focussed").children().stop(true).each(function (i) {
          d = i * 50;
          $(this).delay(d).animate({ top: 0 }, 500, 'easeInOutBack');
        })
      }
    })
  }

  addCar() {
    this.car.image = this.img ? this.img : '';
    if (this.car.Color != undefined &&
      this.car.Number != undefined &&
      this.car.Brand != undefined &&
      this.car.Model != undefined &&
      this.car.Type != undefined && this.car.image_1 != 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg' && this.car.image_2 != 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg' && this.car.image_3 != 'https://www.urbansplash.co.uk/images/placeholder-1-1.jpg') {

      this.itemsCollection = this.afs.collection<any>('carMaster');
      this.itemsCollection.add(this.car);
      this.setting.presentToast('Your car addeded successfully')
      this.navCtrl.push(MycarsPage)
    }
    else {
      this.setting.presentToast('All detail must be required')
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

  GoBack() {
    this.navCtrl.pop();
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
            this.setting.presentToast('please wait.. Its take some times..')

            if (get == 1) {
              this.car.image_1 = 'data:image/jpg;base64,' + imageData
              this.setting.stopLoading();
            }
            else if (get == 2) {
              this.car.image_2 = 'data:image/jpg;base64,' + imageData
              this.setting.stopLoading();
            }
            else if (get == 3) {
              this.car.image_3 = 'data:image/jpg;base64,' + imageData
              this.setting.stopLoading();
            }
            clearInterval(t);
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
          else {
            this.setting.stopLoading();
          }
        }, 1000)
      }
    }, (err) => {
      this.setting.stopLoading();

    });
  }

  addOne(get) {
    this.setting.startLoading();
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      this.img = 'data:image/jpg;base64,' + imageData;
      let t = setInterval(() => {
        if (this.img) {
          this.setting.presentToast('please wait.. Its take some times..')
          clearInterval(t);
          if (get == 1) {
            this.car.image_1 = this.img;
            this.setting.stopLoading();
          }
          else if (get == 2) {
            this.car.image_2 = this.img;
            this.setting.stopLoading();
          }
          else if (get == 3) {
            this.car.image_3 = this.img;
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
        else {
          this.setting.stopLoading();
        }
      }, 1000)
    }, (err) => {
      // Handle error
      this.setting.stopLoading();

    });
  }

  viewPolicy() {
    this.navCtrl.push(PolicyPage)
  }

  onPageDidEnter() {
    $(".flp label").each(function () {
      var sop = '<span class="ch">'; //span opening
      var scl = '</span>'; //span closing
      //split the label into single letters and inject span tags around them
      $(this).html(sop + $(this).html().split("").join(scl + sop) + scl);
      //to prevent space-only spans from collapsing
      $(".ch:contains(' ')").html("&nbsp;");
    })
    var d;
    $(".flp input").focus(function () {
      //calculate movement for .ch = half of input height
      var tm = $(this).outerHeight() / 2 * -1 + "px";
      //label = next sibling of input
      //to prevent multiple animation trigger by mistake we will use .stop() before animating any character and clear any animation queued by .delay()
      $(this).next().addClass("focussed").children().stop(true).each(function (i) {
        d = i * 50;//delay
        $(this).delay(d).animate({ top: tm }, 200, 'easeOutBack');
      })
    })
    $(".flp input").blur(function () {
      //animate the label down if content of the input is empty
      if ($(this).val() == "") {
        $(this).next().removeClass("focussed").children().stop(true).each(function (i) {
          d = i * 50;
          $(this).delay(d).animate({ top: 0 }, 500, 'easeInOutBack');
        })
      }
    })
  }
}
