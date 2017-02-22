import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';

@Injectable()
export class UserService {

  public userEvents = new Subject<UserModel>();

  constructor(private http: Http) {
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
      .do((user: UserModel) => this.userEvents.next(user));
  }

}
