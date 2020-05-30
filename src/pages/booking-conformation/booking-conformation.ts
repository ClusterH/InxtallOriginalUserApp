import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { SettingsProvider } from '../../providers/settings/settings';
import { HomepagePage } from '../homepage/homepage';
import { DatePicker } from '@ionic-native/date-picker';
@IonicPage()
@Component({
  selector: 'page-booking-conformation',
  templateUrl: 'booking-conformation.html',
})
export class BookingConformationPage {
  itemsCollection: any;
  itemsCollection2: any;
  items: any;
  bookings: any = {};
  startTime: any;
  services: any = [];
  service: any = [];
  ser: any = [];
  bookingsData: any = [];
  bookData: any = [];
  carCollection: any = [];
  addressCollection: any = [];
  UserCar: any = [];
  Address: any = [];
  marchant: any = [];
  selectedAddress: any = '';
  selectedCar: any = '';
  lets: any = false;
  isenabled: any = false;
  constructor(private datePicker: DatePicker, public settings: SettingsProvider, private nativeGeocoder: NativeGeocoder, public actionSheetCtrl: ActionSheetController,
    public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    let status = this.navParams.get('status')
    this.marchant = this.navParams.get('marchant');

    let itemsCollection4 = this.afs.collection(`carMaster`);
    this.carCollection = itemsCollection4.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

    let itemsCollection3 = this.afs.collection(`addressMaster`);
    this.addressCollection = itemsCollection3.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

    this.addressCollection.forEach(element => {

      element.forEach(address => {
        if (address.UserId == localStorage.getItem('user')) {
          this.Address.push(address);
        }
      });

    });

    this.carCollection.forEach(element => {
      element.forEach(car => {
        if (car.UserId == localStorage.getItem('user')) {
          this.UserCar.push(car);
        }
      });
    });

    if (status == 'PACKAGE') {
      this.bookings.services = this.navParams.get('packageData').service;
      this.bookings.packageId = this.navParams.get('packageData').id;
      this.bookings.total = this.navParams.get('packageData').price;
      this.bookings.discount = 0;
      this.bookings.totalDuration = this.navParams.get('packageData').duration;
      this.bookings.Type = 'PACKAGE';
    }
    else {
      let services: any = [];
      let total = 0;
      let totalDuration = 0;
      this.services = this.navParams.get('data')
      this.navParams.get('data').forEach(element => {
        services.push(element.id);
        total += parseInt(element.price);
        totalDuration += parseInt(element.duration);
      });
      this.bookings.services = services;
      this.bookings.total = total;
      this.bookings.discount = 0;
      this.bookings.totalDuration = totalDuration;
      this.bookings.Type = 'SERVICES';
    }

    // ========================

    this.bookings.userId = localStorage.getItem('user');
    this.bookings.startTime = '';
    this.bookings.endTime = '';
    this.bookings.marchantId = this.navParams.get('marchant').id;
    this.bookings.status = 0;
    this.bookings.AvailableEmpId = '';
    this.bookings.onTheWay = false;
    this.bookings.empCurrentLoc = '';
    this.startTime = ''
    this.bookings.UserWant = ''
    this.bookings.carId = ''
    this.bookings.address = ''
    this.bookings.startTime = ''
    this.bookings.adminStatus = 0;
    this.bookings.paymentStatus = 0;
    this.bookings.reviewGiven = false;

    // ========================

    let userRef = this.afs.collection('users').ref.where('marchantId', '==', this.bookings.marchantId);
    userRef.get().then((result) => {
      result.forEach(doc => {
        this.ser.push({
          id: doc.id,
          data: doc.data()
        })
      })
    }, err => {
    })

    let itemsCollection2 = this.afs.collection(`bookingMaster`);
    this.bookingsData = itemsCollection2.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

    this.bookingsData.forEach(element => {
      this.bookData = element;
    });
  }

  GoToBack() {
    this.navCtrl.pop();
  }

  letDate() {
    var today = new Date();
    var dd = today.getDate();
    this.datePicker.show({
      date: new Date(),
      mode: 'datetime',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
      minDate: dd
    }).then(
      gotDate => {
        this.startTime = gotDate;
        let date = '';
        let start_time = moment(this.startTime).format('YYYY-MM-DD HH:mm');
        date = moment(this.startTime).format('YYYY-MM-DD');
        let end_time = moment(start_time, 'YYYY-MM-DD HH:mm').add(this.bookings.totalDuration, 'm').format('LTS');
        end_time = moment(date + ' ' + end_time).format('YYYY-MM-DD HH:mm');
        this.bookings.startTime = start_time;
        let checkDate = moment(start_time).format('YYYY-MM-DD');
        let S_time = moment(start_time).format('HH:mm');
        let E_time = moment(end_time).format('HH:mm');

        let wow = moment(checkDate);
        var dow = wow.day();
        let status = false;
        if (S_time < this.marchant.time[dow].start || this.marchant.time[dow].start == E_time) {
          this.settings.presentToast('Our shop is not opened at that time');
          status = true;
        }

        if (S_time == this.marchant.time[dow].end || S_time > this.marchant.time[dow].end) {
          this.settings.presentToast('Our shop is closed at that time');
          status = true;
        }

        if (status == true) {
          this.isenabled = true;
        }
        else {
          this.isenabled = false;
        }
      },
    );
  }

  Availability() {
    this.settings.startLoading();
    if (this.isenabled == false) {
      let date = '';
      let start_time = moment(this.startTime).format('YYYY-MM-DD HH:mm');
      date = moment(this.startTime).format('YYYY-MM-DD');
      let end_time = moment(start_time, 'YYYY-MM-DD HH:mm').add(this.bookings.totalDuration, 'm').format('LTS');
      end_time = moment(date + ' ' + end_time).format('YYYY-MM-DD HH:mm');
      this.bookings.startTime = start_time;
      this.bookings.endTime = end_time;
      let checkDate = moment(start_time).format('YYYY-MM-DD');

      if (this.startTime != '' && this.bookings.UserWant != '' &&
        this.bookings.carId != '' && this.bookings.address != '' &&
        this.bookings.startTime != '') {
        this.bookingsData.forEach(element => {
          this.bookData = element;
        });

        for (let i = 0; i < this.bookData.length; i++) {
          const element = this.bookData[i];
          let status = true;
          let thatEmployee = this.bookData[i].AvailableEmpId;
          if (element.marchantId == this.bookings.marchantId) {
            if (element.status == 1) {
              let bookedDate = moment(element.startTime).format('YYYY-MM-DD');

              let bookedStartTime = moment(element.startTime).format('HH:mm');
              let bookedEndTime = moment(element.endTime).format('HH:mm');

              let S_time = moment(start_time).format('HH:mm');
              let E_time = moment(end_time).format('HH:mm');

              if (bookedDate == checkDate) {




                if (bookedStartTime == S_time) {
                  status = false

                }
                if (bookedEndTime == E_time) {
                  status = false
                }
                if (bookedStartTime < S_time && bookedStartTime > E_time || bookedEndTime < E_time) {
                  status = false

                }
                if (bookedEndTime > S_time || bookedStartTime < S_time && bookedStartTime > E_time) {
                  status = false

                }
              }
              if (status == false) {
                this.ser.forEach(element => {
                  if (element.id == thatEmployee) {
                    element.data.available = false;
                  }
                });
              }
            }
          }
        }

        let avEmp: any = []
        this.ser.forEach(element => {

          if (element.data.available != false) {
            avEmp.push(element);
          }
        });

        let emlpoyees = [];
        if (avEmp.length != 0) {
          if (this.bookings.UserWant == 'STAY') {
            avEmp.forEach(element => {
              if (element.data.at_outside == "0") {
                emlpoyees.push(element.id)
              }
            });
          }

          if (this.bookings.UserWant == 'COME') {
            avEmp.forEach(element => {
              if (element.data.at_shop == "0") {
                emlpoyees.push(element.id)
              }
            });
          }

          setTimeout(() => {
            if (emlpoyees.length != 0) {
              const id = this.afs.createId();
              this.bookings.empId = emlpoyees;
              let userDoc = this.afs.doc<any>('bookingMaster/' + id);
              userDoc.set(this.bookings)

              emlpoyees.forEach(element => {
                if (this.bookings.UserWant == 'STAY') {
                  this.itemsCollection = this.afs.collection<any>('notification');
                  this.itemsCollection.add({
                    id: element,
                    bookingKey: id,
                    type: 0,
                  })
                }
                else {
                  this.itemsCollection = this.afs.collection<any>('notification');
                  this.itemsCollection.add({
                    id: this.marchant.id,
                    bookingKey: id,
                    type: 0,
                  })
                }
              });

              this.settings.presentToast('Wait some seconds..');

              setTimeout(() => {
                this.settings.presentToast('Your request will be send to marchant we will give ans shortly');
                this.navCtrl.push(HomepagePage)
              }, 3000);
              this.settings.stopLoading();


            }
            else {
              this.settings.presentToast('No employees free at that time.')
              this.settings.stopLoading();

            }
          }, 1000);

        }
        else {
          this.settings.stopLoading();

          this.settings.presentToast('Employee is not available for selected time');
        }
      }
      else {
        this.settings.stopLoading();

        this.settings.presentToast('Select all the details');
      }
    }
    else {
      this.settings.presentToast('Our shop is not opened at that time');
      this.settings.stopLoading();
    }
  }

  ChangeLocation() {
    this.Address.forEach(element => {
      if (element.id == this.bookings.address) {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        this.nativeGeocoder.forwardGeocode(element.Address, options)
          .then((coordinates: NativeGeocoderForwardResult[]) => {
            coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude;
            let latti: any = coordinates[0].latitude;
            let lng: any = coordinates[0].longitude;

            var ky = 40000 / 360;
            var kx = Math.cos(Math.PI * this.marchant.lat / 180.0) * ky;
            var dx = Math.abs(this.marchant.lng - lng) * kx;
            var dy = Math.abs(this.marchant.lat - latti) * ky;
            Math.sqrt(dx * dx + dy * dy) <= this.marchant.radius;

            if (Math.sqrt(dx * dx + dy * dy) <= this.marchant.radius == true) {
              this.lets = false
            }
            else {
              this.lets = true
            }

            if (Math.sqrt(dx * dx + dy * dy) <= this.marchant.radius == false) {
              this.settings.presentToast('Our employee is not available for this location try other method..')
            }
          })
          .catch(err => {
            this.lets = true;
            this.settings.presentToast('Our employee is not available for this location try other method..')

          })
      }
    });
  }
}
