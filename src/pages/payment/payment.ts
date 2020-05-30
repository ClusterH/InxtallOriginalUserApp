import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { SettingsProvider } from '../../providers/settings/settings';
import { HomepagePage } from '../homepage/homepage';
declare var RazorpayCheckout: any;

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  bookedData:any = {};
  checkOut:any = {}
  relationship:any = 1;
  constructor(public service:SettingsProvider,private payPal: PayPal,public afs: AngularFirestore,public navCtrl: NavController, public navParams: NavParams) {
   this.bookedData = this.navParams.get('data');

   this.afs.doc(`users/${this.bookedData.marchantId}`).valueChanges().subscribe(res => {
    this.bookedData.marchant = res;
    this.checkOut.id = this.bookedData.id;
    this.checkOut.AvailableEmpId = this.bookedData.AvailableEmpId;
    this.checkOut.Type = this.bookedData.Type;
    this.checkOut.UserWant = this.bookedData.UserWant;
    this.checkOut.address = this.bookedData.address;
    this.checkOut.adminStatus = this.bookedData.adminStatus;
    this.checkOut.carId = this.bookedData.carId;
    this.checkOut.discount = this.bookedData.discount;
    this.checkOut.empId= this.bookedData.empId;
    this.checkOut.endTime= this.bookedData.endTime;
    this.checkOut.marchantId= this.bookedData.marchantId;
    this.checkOut.onTheWay= this.bookedData.onTheWay;
    this.checkOut.startTime= this.bookedData.startTime;
    this.checkOut.status= this.bookedData.status;
    this.checkOut.total= this.bookedData.total;
    this.checkOut.totalDuration= this.bookedData.totalDuration;
    this.checkOut.userId= this.bookedData.userId;
    this.checkOut.paymentStatus= this.bookedData.paymentStatus;
   });
  }

  checkout() {
    let userData : any = {}
    this.afs.doc(`users/${localStorage.getItem('user')}`).valueChanges().subscribe(res => {
      userData = res;
    });

    if(this.relationship == 1) {
      this.payPal.init({
        PayPalEnvironmentProduction: 'AR-guF3mwL1jNVFEmJp9GiwL2GRuwN_kXuUNWfWzt4KfFUvbtaAt0vswqC6uiiLHNT26VE2s0d-XdcnM',
        PayPalEnvironmentSandbox: 'AWoo6mXhv6wlXhlzdWcbP2uJbWGYYKunfoqtue6mC8c1l8GmxJrfeOqi1gwMpu9x1jmi7_81JkqT4bgb'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {
          let payment = new PayPalPayment(this.bookedData.total, 'USD', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((res) => {
          
            if (res.response.id) {
             this.checkOut.paymentStatus = 1
             this.checkOut.paymentMethod = 'PAYPAL'
             this.checkOut.paymentToken = res.response.id

             let userDoc = this.afs.doc<any>('bookingMaster/' + this.bookedData.id);
             userDoc.update(this.checkOut)
             this.service.presentToast('payment successfully')
             this.navCtrl.setRoot(HomepagePage)

             }

          }, () => {
            // Error or render dialog closed without being successful
          });
        }, () => {
          // Error in configuration
        });
      }, () => {
        // Error in initialization, maybe PayPal isn't supported or something else
      });
     


    }
    else if (this.relationship == 2){
      let options = {
        description: 'Credits towards consultation',
        currency: 'USD',
        key: 'rzp_test_tM46aCFDGGJrSP',
        amount: this.bookedData.total * 100,
        name: this.bookedData.marchant.shopName,
        prefill: {
          email: userData.email,
          contact: userData.Mobile_No,
          name: userData.username
        },
        theme: {
          color: '#19212b'
        },
        modal: {
          ondismiss: () => {
          }
        }
      };

      let successCallback = (payment_id) => { // <- Here!
      
        this.checkOut.paymentStatus = 1
        this.checkOut.paymentMethod = 'RAZORPAY'
        this.checkOut.paymentToken = payment_id


        let userDoc = this.afs.doc<any>('bookingMaster/' + this.bookedData.id);
        userDoc.update(this.checkOut)
        this.service.presentToast('Payment Successful')
        this.navCtrl.setRoot(HomepagePage)


       
      };

      let cancelCallback = (error) => { // <- Here!
        this.service.presentToast(error.description)
      };

        RazorpayCheckout.open(options, successCallback, cancelCallback);
    }
    else if (this.relationship == 3){

      this.checkOut.paymentStatus = 1;
      this.checkOut.paymentMethod = 'COD';
      this.checkOut.paymentToken = 'COD';

      let userDoc = this.afs.doc<any>('bookingMaster/' + this.bookedData.id);
      userDoc.update(this.checkOut)
      this.service.presentToast('Payment Successful')
      this.navCtrl.setRoot(HomepagePage)


    }

  }
  
  GoToBack() {
    this.navCtrl.pop();
  }
}
