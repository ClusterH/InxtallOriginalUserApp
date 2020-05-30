
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http } from '@angular/http';

@Injectable()
export class RestProvider {

  constructor(public http: Http, public afAuth: AngularFireAuth) {

  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  contryCode() {
    return this.http.get('../../assets/JSON/code.json');
  }

  resetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

}
