import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { RatingPage } from '../rating/rating';
import { ViewMapPage } from '../view-map/view-map';
import { PaymentPage } from '../payment/payment';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  open = 1;
  map: any;
  data: any = [];
  userBooks: any = [];
  items: any;
  activeLength:any = 0;
  completeLength:any = 0;
  cancelLength:any = 0;

  constructor(public service:SettingsProvider,public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
   this.service.startLoading();
    let itemsCollection4 = this.afs.collection(`bookingMaster`);
    this.data = itemsCollection4.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    this.data.forEach(element => {
      element.forEach(el => {
        if (el.userId == localStorage.getItem('user')) {
          
          
          if(el.status == 1){
             this.activeLength++;
          }
          else if(el.status == 2){
            this.completeLength++;

          }
          else if(el.status == 3){
            this.cancelLength++;

          }
          this.userBooks.push(el);
        }
      });
    });

    setTimeout(() => {
      
      this.userBooks.forEach(element => {
        this.afs.doc(`users/${element.marchantId}`).valueChanges().subscribe((res: any) => {
          element.marchant = res;
        });
        if (element.status != 0) {
          this.afs.doc(`users/${element.AvailableEmpId}`).valueChanges().subscribe((res: any) => {
            element.Empnm = res.name
          });
        }
        
        let ser:any = [];
        element.services.forEach(el => {
        this.afs.doc(`service/${element.marchantId}/service/${el}`).valueChanges().subscribe((res: any) => { 
         
         ser.push(res)
        })
        });
        element.servicesInfo = ser;
      });
      this.service.stopLoading();

    }, 1000);
  }

  Open(data) {
    this.open = data;
  }

  GoToBack() {
    this.navCtrl.pop()
  }

  payNow(data) {
    this.navCtrl.push(PaymentPage, { data: data })
  }

  rate(data) {
    this.navCtrl.push(RatingPage, { data: data })
  }

  viewMap(data) {
    this.navCtrl.push(ViewMapPage, { data: data })
  }

}
