import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { MarchantPage } from '../marchant/marchant';
import { Geolocation } from '@ionic-native/geolocation';
import { HomepagePage } from '../homepage/homepage';
import { AngularFirestore } from '@angular/fire/firestore';


@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  a: any = 0;
  marchant: any = [];
  distance:any;
  avgRating: number;
  constructor(public afs: AngularFirestore,private appCtrl: App,public geolocation: Geolocation, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.marchant = this.navParams.get('id');
    let count:number = 0;
    let total: any = 0;
    let ratings = this.afs.collection('ratingMaster').ref.where('marchantId', '==', this.marchant.id);
    ratings.get().then((result) => {
      result.forEach(doc => {
        count++;
        total += doc.data().star;
      })
       
      this.avgRating = total / count;
      this.avgRating = Math.round(this.avgRating);

    }, err => {
    })
    this.getDistanceFromLatLonInKm();
  }

  Cancel(data) {
    if (data == 2 && this.a == 0) {
      this.a++;
      this.navCtrl.push(MarchantPage, { data: this.marchant });
    }
    if(data != 2) {
      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().setRoot(HomepagePage);
    }
  }
 
  GoToNext() {
    this.navCtrl.push(MarchantPage, { data: this.marchant })
  }

  getDistanceFromLatLonInKm() {
    this.geolocation.getCurrentPosition().then((resp) => {
      if (resp) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(resp.coords.latitude - this.marchant.lat);  // deg2rad below
        var dLon = this.deg2rad(resp.coords.longitude - this.marchant.lng);
        
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.deg2rad(this.marchant.lat)) * Math.cos(this.deg2rad(resp.coords.latitude)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2) ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        this.distance =  Math.round(d);
      }
    }).catch((error) => {
      
    });
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

}
