import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { FlexmonsterPivotModule } from 'ng-flexmonster';
import { AppComponent } from './app.component';
// import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ThemeComponent } from './modules/theme/theme.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.qa';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CustomDecimalPipePipe } from './shared/pipes/custom-decimal-pipe.pipe';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1
export function loggerCallback(logLevel: LogLevel, message: string) {
  // console.log(message);
}
//To initialize MSAL module It is required to pass the clientId of our application which we can get from the application registration.
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority:
      'https://login.microsoftonline.com/' + environment.azure.tenantID,
      redirectUri: '/',
      postLogoutRedirectUri: '/'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false, // set to true for IE 11
  },
  system: {
    loggerOptions: {
      loggerCallback,
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false
    }
  }
  }
  );
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

  return {
    interactionType: InteractionType.Redirect,

    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    },
  }
}


@NgModule({
  declarations: [AppComponent, ThemeComponent],
  imports: [
    HttpClientModule,
    // AuthenticationModule,
    FlexmonsterPivotModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'decreasing',
    }),
    NgxSpinnerModule,
    MsalModule,
    MatDialogModule
  ],
  providers:
  [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    },
    {
        provide: MSAL_INSTANCE,
        useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    MsalService,
    MsalGuard,
    AuthService
    // MsalBroadcastService

],

  bootstrap: [AppComponent,MsalRedirectComponent] //used for handling redirect
})
export class AppModule {}
