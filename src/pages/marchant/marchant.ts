import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { BookingConformationPage } from '../booking-conformation/booking-conformation';
import { PackageInfoPage } from '../package-info/package-info';
import { Geolocation } from '@ionic-native/geolocation';
import { SettingsProvider } from '../../providers/settings/settings';
declare var $: any;
declare var google;

@IonicPage()
@Component({
  selector: 'page-marchant',
  templateUrl: 'marchant.html',
})
export class MarchantPage {
  @ViewChild('wow') mapElement: ElementRef;
  dirService = new google.maps.DirectionsService();
  dirRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false });
  map: any;
  open: any = 1;
  marchant: any = {};
  currentTime: any = {};
  employee: any = [];
  service: Observable<any[]>;
  package: Observable<any[]>;
  itemsCollection: any;
  cart: any = [];
  ratingData: any = [];
  avgRating: any = 0;
  tot: any = 0;
  constructor(public settings: SettingsProvider, public geolocation: Geolocation, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {

    this.marchant = this.navParams.get('data');
    let count: number = 0;
    let total: any = 0;
    let ratings = this.afs.collection('ratingMaster').ref.where('marchantId', '==', this.marchant.id);
    ratings.get().then((result) => {
      result.forEach(doc => {
        count++;
        total += doc.data().star;
        this.afs.doc(`users/${doc.data().userId}`).valueChanges().subscribe(res => {
          let rate = doc.data().star
          parseInt(total += rate)
          this.ratingData.push({
            data: doc.data(),
            user: res
          });
        });
      })
      this.avgRating = total / count;
      this.avgRating = Math.round(this.avgRating);

    }, err => {
    })

    var d: any = new Date();
    d = d.getDay();

    this.currentTime.end = 'Jun 15, 2015,' + ' ' + this.marchant.time[d].end;
    this.currentTime.start = 'Jun 15, 2015,' + ' ' + this.marchant.time[d].start;

    let userRef = this.afs.collection('users').ref.where('marchantId', '==', this.marchant.id);
    userRef.get().then((result) => {
      result.forEach(doc => {
        this.employee.push(doc.data())
        
        
      })
    }, err => {
    })

    this.itemsCollection = afs.collection(`service/${this.marchant.id}/service`);
    this.service = this.itemsCollection.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

    this.itemsCollection = afs.collection(`package/${this.marchant.id}/package`);
    this.package = this.itemsCollection.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  ionViewDidLoad() {
    this.initMap();
    $("#wow").hide();
  }

  checkCar(i) {
    i.check = true;
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Address',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {

          }
        },
        {
          text: 'Archive',
          handler: () => {

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

  ViewPackage(data) {
    let profileModal = this.modalCtrl.create(PackageInfoPage, { packageData: data, marchant: this.marchant });
    profileModal.present();
  }

  Open(data) {
    this.open = data;
    if(data == 1 && data == 4){
     
    }
    else{
    }

    if (this.open != 1) {
      this.cart = [];
    }
    if (data == 2) {
      $("#wow").show();
    }
    else {
      $("#wow").hide();
    }
    if (data == 1) {
      $("#footer").show();
    }
    else {
      $("#footer").hide();
    }
   
  }

  AddToCart(i) {
    this.tot = 0;
    let check = true;
    if (this.cart.length == 0) {
      check = true
    }
    else {
      this.cart.forEach(element => {
        if (element.id == i.id) {
          check = false
          element.check = i.check;
        }
      });
    }

    if (check == true) {
      this.cart.push(i);
    }

    if (this.cart.length != 0) {
      
    }

    this.cart.forEach(element => {
      if (element.check == true) {
        
        this.tot += element.price
      }
    });
  }

  next() {
    let services: any = [];
    this.cart.forEach(element => {
      if (element.check == true) {
        services.push(element)
      }
    });

    if (services.length != 0) {
      this.navCtrl.push(BookingConformationPage, { status: 'SERVICES', data: services, marchant: this.marchant })
    }
    else {
      this.settings.presentToast('No service selected..')
    }

  }

  bookPackage(data) {
    this.navCtrl.push(BookingConformationPage, { status: 'PACKAGE', packageData: data, marchant: this.marchant })
  }

  goBack() {
    this.navCtrl.pop()
  }

  initMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      var styledMapType = new google.maps.StyledMapType(
        [
          {
            "featureType": "all",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "saturation": 36
              },
              {
                "color": "#000000"
              },
              {
                "lightness": 40
              }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "visibility": "on"
              },
              {
                "color": "#000000"
              },
              {
                "lightness": 16
              }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 17
              },
              {
                "weight": 1.2
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#e5c163"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#c4c4c4"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#e5c163"
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 21
              },
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#e5c163"
              },
              {
                "lightness": "0"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#e5c163"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 18
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#575757"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#2c2c2c"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 16
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#999999"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 19
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              },
              {
                "lightness": 17
              }
            ]
          }
        ],
        { name: 'Styled Map' });

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapoption = {
        center: latLng,
        zoom: 50,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        icon: {
          url: "../../assets/imgs/dp1.png",
          size: {
            width: 50,
            height: 50
          }
        }, mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
            'styled_map']
        }
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapoption);
      this.map.mapTypes.set('styled_map', styledMapType);
      this.map.setMapTypeId('styled_map');

    }).catch((error) => {
      this.settings.presentToast('Enable your GPS..')
    });
  }

  getDirection() {
    this.settings.startLoading();
    this.geolocation.getCurrentPosition().then((resp) => {
      let a = resp.coords.latitude + ',' + resp.coords.longitude;
      let b = this.marchant.lat + ',' + this.marchant.lng;
      this.dirRenderer.setMap(this.map);
      var request = {
        origin: a,
        destination: b,
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.dirService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          this.dirRenderer.setDirections(result);
          this.settings.stopLoading();
        }
        else {
          this.settings.stopLoading();
        }
      });
    }, err => {
      this.settings.presentToast('Enable your GPS..');
      this.settings.stopLoading();
    })

  }
}
