import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore } from '@angular/fire/firestore';
import { NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { SettingsProvider } from '../../providers/settings/settings';
declare var google;

@IonicPage()
@Component({
  selector: 'page-view-map',
  templateUrl: 'view-map.html',
})

export class ViewMapPage {
  @ViewChild('parth') mapElement: ElementRef;
  map: any;
  items: any;
  dirService = new google.maps.DirectionsService();
  dirRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false });
  mapData: any = {};
  userLatLng: any;
  latlng: any;
  constructor(public service: SettingsProvider, private nativeGeocoder: NativeGeocoder, public afs: AngularFirestore, private geolocation: Geolocation, public navCtrl: NavController, public navParams: NavParams) {
    this.mapData = this.navParams.get('data')
  }

  refresh() {
    this.afs.doc(`users/` + this.mapData.AvailableEmpId).valueChanges().subscribe((res: any) => {
      this.latlng = res.empCurrentLoc
      this.initMap()
    });
  }

  ionViewDidLoad() {

    this.afs.doc(`users/` + this.mapData.AvailableEmpId).valueChanges().subscribe((res: any) => {

      this.latlng = res.empCurrentLoc


      this.mapData = this.navParams.get('data');
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      this.afs.doc(`addressMaster/${this.mapData.address}`).valueChanges().subscribe((res: any) => {
        this.nativeGeocoder.forwardGeocode(res.Address, options)
          .then((coordinates: NativeGeocoderForwardResult[]) => {
            this.userLatLng = coordinates[0].latitude + ',' + coordinates[0].longitude
            this.initMap();
          }).catch(() => {
            this.service.presentToast('Enable your GPS...')
          })
      });
    });
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

      let a = this.latlng;
      let b = this.userLatLng;

      if (a == undefined && b == undefined) {
        this.service.presentToast('Something went wrong')
      }




      this.dirRenderer.setMap(this.map);
      var request = {
        origin: a,
        destination: b,
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.dirService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          this.dirRenderer.setDirections(result);
        }
      });
    }).catch((error) => {
    });
  }
}
