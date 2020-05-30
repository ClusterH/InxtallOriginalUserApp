import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
declare var $: any;
import { RestProvider } from '../../providers/rest/rest';
import { AngularFirestore } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation';
import { SettingsProvider } from '../../providers/settings/settings';
import { FCM } from '@ionic-native/fcm';
import { PolicyPage } from '../policy/policy';
// import { VerifyNoPage } from '../verify-no/verify-no';
// import firebase from 'firebase';
import { HomepagePage } from '../homepage/homepage';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  itemsCollection: any;
  user: any = {};
  c_password: any = '';

  constructor(public events: Events,public menuCtrl: MenuController, private fcm: FCM, public setting: SettingsProvider, private geolocation: Geolocation, public afs: AngularFirestore, public api: RestProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.itemsCollection = afs.collection('users');
    this.user.role = 3;
    this.user.image = 'https://dumielauxepices.net/sites/default/files/person-icons-avatar-711972-5314933.png';
    this.user.coverImage = 'https://cache.ocean-sandbox.com/img/front/cag/default-cover.jpg';
    this.user.status = true;
    this.menuCtrl.close();
    this.menuCtrl.swipeEnable(false)
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

  GoToLogin() {
    this.navCtrl.setRoot(SigninPage)
  }

  register() {
    this.setting.startLoading();

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    var mobile = /^\d{10}$/;

    if (mobile.test((this.user.Mobile_No)) == false) {
      this.setting.presentToast('Mobile no does not valid');
      this.setting.stopLoading();
    }
    else {
      if (this.user.username != undefined || this.user.email != undefined || this.user.Mobile_No != undefined || this.user.password != undefined) {
        if (re.test(String(this.user.email).toLowerCase()) == true) {
          if (this.user.password == this.c_password) {
            if (regularExpression.test(String(this.user.password).toLowerCase()) == true) {

                  this.fcm.subscribeToTopic('marketing');
                  // this.fcm.getToken().then(token => {

                    this.geolocation.getCurrentPosition().then((resp) => {
                      this.user.lat = resp.coords.latitude;
                      this.user.long = resp.coords.longitude;
                      // this.user.token = token;
                      if (resp) {
                        this.api.register(this.user.email, this.user.password).then((data: any) => {

                          if (data.user.uid) {
                            let itemsCollection = this.afs.collection('users');
                            itemsCollection.doc(data.user.uid).set(this.user);
                            this.setting.presentToast('Registerd Successfully..');
                            this.api.login(this.user.email, this.user.password).then((data: any) => {
                              localStorage.setItem('user', data.user.uid);
                              this.setting.presentToast('Welcome to CarBoy..');
                              this.events.publish('changeLogin', { login: 0 });
                              this.navCtrl.push(HomepagePage);
                            })
                          }
                        }).catch(err => {
                          this.setting.stopLoading();
                        })
                      }
                    }).catch((error) => {
                      this.setting.presentToast(error.message);
                    });
                  // })
            }
            else {
              this.setting.presentToast('Choose a strong password');
            }
          }
          else {
            this.setting.presentToast('Password and Conform Password does not match');
          }
        }
        else {
          this.setting.presentToast('Email Address badly formated');
        }
      }
      else {
        this.setting.presentToast('Fill up all the details');
      }

      setTimeout(() => {
        this.setting.stopLoading();
      }, 1000);


    }
  }

  viewPolicy() {
    this.navCtrl.push(PolicyPage)
  }
  

}
