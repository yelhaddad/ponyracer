import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';

@Injectable()
export class UserService {

  public userEvents = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: Http) {
    this.retrieveUser();
  }

  register(login, password, birthYear): Observable<UserModel> {
    const body = {login, password, birthYear};
    return this.http.post('http://ponyracer.ninja-squad.com/api/users', body)
      .map(res => res.json());
  }

  authenticate(credentials): Observable<UserModel> {
    return this.http
      .post('http://ponyracer.ninja-squad.com/api/users/authentication', credentials)
      .map(res => res.json())
      .do(user => this.storeLoggedInUser(user));
  }

  storeLoggedInUser(user) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value);
      this.userEvents.next(user);
    }
  }

}
