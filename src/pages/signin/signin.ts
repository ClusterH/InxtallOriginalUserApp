import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, Events } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AngularFirestore } from '@angular/fire/firestore';
import { RestProvider } from '../../providers/rest/rest';
import { HomepagePage } from '../homepage/homepage';
import { SettingsProvider } from '../../providers/settings/settings';
declare var $: any;
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  email: any = '';
  password: any = '';
  itemsCollection: any;
  userDoc: any;

  constructor(    public afAuth: AngularFireAuth,
    public events: Events, public menuCtrl: MenuController, public alertCtrl: AlertController, public platform: Platform, private fcm: FCM, public setting: SettingsProvider, public api: RestProvider, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.menuCtrl.close();
    this.menuCtrl.swipeEnable(false);
  }

  ionViewDidLoad() {
    $(".flp label").each(function () {
      var sop = '<span class="ch">'; 
      var scl = '</span>';
      $(this).html(sop + $(this).html().split("").join(scl + sop) + scl);
      $(".ch:contains(' ')").html("&nbsp;");
    })
    var d;
    $(".flp input").focus(function () {
      var tm = $(this).outerHeight() / 2 * -1 + "px";
      $(this).next().addClass("focussed").children().stop(true).each(function (i) {
        d = i * 50;
        $(this).delay(d).animate({ top: tm }, 200, 'easeOutBack');
      })
    })
    $(".flp input").blur(function () {
      if ($(this).val() == "") {
        $(this).next().removeClass("focussed").children().stop(true).each(function (i) {
          d = i * 50;
          $(this).delay(d).animate({ top: 0 }, 500, 'easeInOutBack');
        })
      }
    })
  }

  GoToRegister() {
    this.navCtrl.setRoot(SignupPage)
  }

  signin() {
    let uid: any;
    let userRef = this.afs.collection('users').ref.where('Mobile_No', '==', this.email).where('password', '==', this.password);
    userRef.get().then((result) => {
      result.forEach(doc => {
        uid = doc.id;
      })
      if (result.docs.length != 0) {
        if (this.platform.is('cordova')) {
          this.fcm.subscribeToTopic('marketing');
          this.fcm.getToken().then(token => {

            this.afs.doc(`users/${uid}`).valueChanges().subscribe(res => {
              localStorage.setItem('user', uid)
              let user: any = {};
              user = res;
              user.token = token;
              console.log('user',user)
              if (res) {
                this.userDoc = this.afs.doc<any>('users/' + uid);
                this.userDoc.update(user);
                this.events.publish('changeLogin', { login: 0 });
                this.navCtrl.setRoot(HomepagePage);
                this.setting.presentToast('Welcome to car wash :)');
              }
              else {

              }
            });
          }).catch(err => {
            this.setting.presentToast(err.message);
          })
          this.navCtrl.setRoot(HomepagePage)
        }
        else {
          this.afs.doc(`users/${uid}`).valueChanges().subscribe(res => {
            console.log('res',res)
          })
          // localStorage.setItem('user', uid)
          // this.navCtrl.setRoot(HomepagePage);
          // this.setting.presentToast('Welcome to car wash :)');
        }
      }
      else {
        this.setting.presentToast('Number or password does not match..')
      }

    }, err => {
    })
  }

  login() {
    this.setting.startLoading();
    this.api.login(this.email, this.password).then((data: any) => {
      if (data.user.uid) {
        this.afs.doc(`users/${data.user.uid}`).valueChanges().subscribe((res:any) => {
          console.log(res)
          if(res.role == 3){
            this.setting.stopLoading();
            localStorage.setItem('user', data.user.uid);
            this.setting.presentToast('Welcome to CarBoy..');
            this.events.publish('changeLogin', { login: 0 });
            this.navCtrl.push(HomepagePage);
          }
          else{
            this.setting.presentToast('There is no user record corresponding to this identifier. The user may have been deleted.')
            this.afAuth.auth.signOut().then((res: any) => {});
            this.setting.stopLoading();
          }
        })
      }
    }).catch(err => {
      this.setting.stopLoading();
      this.setting.presentToast(err.message)
    })
  }

  GoToForgot() {
    this.navCtrl.push(ForgotPasswordPage)
  }
}
