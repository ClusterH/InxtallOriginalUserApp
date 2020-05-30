
import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class SettingsProvider {
  toast: any
  loadingpresent: any
  loading2: any
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    this.toast.present();
  }

  dismissToast() {
    this.toast.onDidDismiss(() => {
    });
  }

  startLoading() {
    this.loading2 = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    this.loading2.present()
  }
  stopLoading() {
    this.loading2.dismiss()
  }
}
