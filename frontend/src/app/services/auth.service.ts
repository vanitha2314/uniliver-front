import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { User } from '../shared/models/User';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
// const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  keepMeLoggedIn = new BehaviorSubject<any>(false);
  user_Details$ = new Subject;

  accessToken: string = '';
  activeUser = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private msalService: MsalService,
    private httpService: HttpService
  ) {}

  login() {
    return this.msalService.loginRedirect();
  }
ActiveAccounts() {
    return this.msalService.instance.getAllAccounts();
  }

  logout()  {
    localStorage.removeItem('_u');
    this.msalService.logout();
  }

  refreshToken() {
    return this.msalService.instance.acquireTokenSilent({
      scopes: ['User.Read'],
      account: this.msalService.instance.getActiveAccount() as AccountInfo,
      redirectUri:"/"
    });
  }
  setUserDetails(userDetails: any) {
    localStorage.setItem('_u', JSON.stringify(userDetails));
    // console.log(userDetails,"userDetails")
    this.user_Details$.next(userDetails);
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('_u') as string);
  }
  userLogIn(data: any): Observable<any> {
    return this.httpService.post<any>('/userManagement/login', data);
  }
  checkAndSetActiveAccounts() {
    return new Promise((resolve, reject) => {
      let activeAccount = this.msalService.instance.getActiveAccount();

      if (
        !activeAccount &&
        this.msalService.instance.getAllAccounts().length > 0
      ) {
        let accounts = this.msalService.instance.getAllAccounts();
        this.msalService.instance.setActiveAccount(accounts[0]);
        activeAccount = accounts[0];
      }
      if (activeAccount) {
        this.activeUser.next(activeAccount);
        localStorage.setItem('_user', JSON.stringify(activeAccount));
        this.storeAccessToken();
        resolve(activeAccount);
      } else {
        resolve(null);
      }
    });
  }
  storeAccessToken() {
    for (const storage of Object.keys(localStorage)) {
      if (storage.includes('accesstoken')) {
        const storageItem: any = JSON.parse(
          localStorage.getItem(storage) || ''
        );
        this.accessToken = storageItem['secret'];
      }
    }
  }
  // userSignUp(user: any): Observable<any> {
  //   return this.httpService.post<any>('/userManagement/signUp', user);
  // }
}
