import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
declare var google;
import { ViewChild, ElementRef } from '@angular/core';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AngularFirestore } from '@angular/fire/firestore';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AnimationService } from 'css-animator';
import { ModalController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';
import { NgZone } from '@angular/core';
import { map } from 'rxjs/operators';
import { SettingsProvider } from '../../providers/settings/settings';
import { Geolocation } from '@ionic-native/geolocation';
import { BookingsPage } from '../bookings/bookings';
import { MarchantPage } from '../marchant/marchant';

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html',
})

export class HomepagePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marchant: any = [];
  loc: any = [];
  view: any;
  items: any;
  itemsCollection: any = [];
  searching: any;
  constructor(private geolocation: Geolocation, public settings: SettingsProvider, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, private ngZOne: NgZone, public modalCtrl: ModalController, animationService: AnimationService, public afs: AngularFirestore, private nativeGeocoder: NativeGeocoder, public navCtrl: NavController, public navParams: NavParams) {

    this.settings.startLoading();

    let total: any = 0;
    let userRef = this.afs.collection('users').ref.where('role', '==', 1);
    userRef.get().then((result) => {
      result.forEach(doc => {
        let rating = this.afs.collection('ratingMaster').ref.where('marchantId', '==', doc.id);
        rating.get().then((r2) => {
          let count: number = 0;
          total = 0;
          r2.forEach(element => {
            count++;
            total += element.data().star;
          });

          let avgRate = total / count;
          if (doc.data().status == 'Active') {
            this.marchant.push({
              id: doc.id,
              data: doc.data(),
              count: count,
              avgRate: avgRate
            })

          }
        })
      })

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      this.geolocation.getCurrentPosition().then((resp) => {
        if (resp) {
          this.initMap(resp.coords.latitude, resp.coords.longitude);
          this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.latitude, options)
            .then((result: NativeGeocoderReverseResult[]) => {

            })
            .catch((error: any) => {

            })
        }
      }).catch(() => {
        this.settings.presentToast('Enable your GPS');
      });
    })

    this.settings.stopLoading();
  }

  View(data) {
    if (this.view == 1 && this.view == 2 && this.view == 3) {
      this.view = 0;
    }
    else {
      this.view = data;
    }
    if (this.view == 3) {
      this.navCtrl.push(BookingsPage)
    }
  }

  initMap(lat, lng) {

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

    let latLng = new google.maps.LatLng(lat, lng);
    let mapoption = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      icon: {
        url: "../../assets/imgs/Logo.png",
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
    var marker;
    this.itemsCollection = this.afs.collection(`users`);
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map((actions: any) => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    this.items.forEach(element => {
      element.forEach(element2 => {
        if (element2.role == 1) {
          var image = {
            url: element2.coverImage,
            scaledSize: new google.maps.Size(70, 70),
          };

          if (element2.lat != 0 && element2.lng != 0 && status != 'Active') {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(element2.lat, element2.lng),
              map: this.map,
              icon: element.coverImage,
              url: image,
              id: element2,
              no: 0,
            });
          }

          google.maps.event.addListener(marker, 'click', () => {
            this.ngZOne.run(() => {
              marker.no++;
              if (marker.no == 1) {
                let profileModal = this.modalCtrl.create(ModalPage, { id: marker.id });
                profileModal.present();
              }
            });
          })
        }
      });
    });

  }

  viewM(data) {
    let d: any = data.data;
    d.id = data.id;
    this.navCtrl.push(MarchantPage, { data: d });
  }

  searchToggle() {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.forwardGeocode(this.searching, options)
      .then((coordinates: NativeGeocoderForwardResult[]) => {
        this.initMap(coordinates[0].latitude, coordinates[0].longitude);
      }).catch((error: any) => {

      });
  }
}
