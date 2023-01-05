import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { JwtHelperService, JwtInterceptor, JwtModule } from '@auth0/angular-jwt';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtHelper:JwtHelperService, private authService: AuthService, private router: Router,private msalService: MsalService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let userDetails: any = this.authService.getUserDetails();
    if (userDetails && userDetails.token) {
      request = request.clone({
        headers: new HttpHeaders({
          'x-auth-token': userDetails.token,
          // 'is-admin': userDetails?.isAdmin?.toString(),
        }),
      });
    }
    
    let item: any;
    let token_name_info: any;
    Object.keys(localStorage).forEach(data => {
      item = localStorage.getItem(data);
      try {
        if (typeof (JSON.parse(item)) === 'object') {
          const secret_key= JSON.parse(item)
          if (secret_key.credentialType === "AccessToken")
            if (secret_key.hasOwnProperty("secret")) {
              token_name_info = secret_key.secret
            }
        }

      } catch (err) {
        // console.log(err)
      }
    });
    const user_profile_info = (localStorage.getItem('_u'));
    if (request.url.indexOf('https://graph.microsoft.com/v1.0/me') >= 0) {
      if (token_name_info) {
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json').set('Authorization', 'Bearer ' + token_name_info)
        });
      }
    }
    let data_item: any;
    let user_role: any;
    let decode_roles:any;
    Object.keys(localStorage).forEach(data => {
      data_item = localStorage.getItem(data);
      try {
        if (typeof (JSON.parse(data_item)) === 'object') {
          const secret_key= JSON.parse(data_item)
          if (secret_key.credentialType === "IdToken")
            if (secret_key.hasOwnProperty("secret")) {
              user_role = secret_key.secret
              decode_roles=this.jwtHelper.decodeToken(user_role)
              localStorage.setItem('id_data',JSON.stringify(decode_roles))

            }
        }

      } catch (err) {
        // console.log(err)
      }
    });
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error?.error?.code === 'InvalidAuthenticationToken' || 'isInvalidGrantError' || 'No token provided.' ||  'InteractionRequiredAuthError'
        ) {
          this.authService
            .refreshToken() //this method will generate new token
            .then((res) => {
            let secretKey = res.accessToken              
            Object.keys(localStorage).forEach(data => {
              item = localStorage.getItem(data);
              // console.log(item,"authInterceptorItem")
              try {
                if (typeof (JSON.parse(item)) === 'object') {
                  const secret_key= JSON.parse(item)
                  if (secret_key.credentialType === "AccessToken")
                    if (secret_key.hasOwnProperty("secret")) { 
                      secret_key.secret = secretKey 
                      localStorage.setItem(data, JSON.stringify(secret_key)) // updating the new secret key in the local storage
                    }
                }
        
              } catch (err) {
                // this.msalService.loginRedirect();
                // console.log("authInterceptorHandleError",err)
              }
            });
            })
            .catch((err) => {
              this.msalService.loginRedirect();
            });
        }
        return throwError(error);
        
      })
    );
    }
  }
  
