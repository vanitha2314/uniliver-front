import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './modules/main/home/home.component';
import { ThemeComponent } from './modules/theme/theme.component';
// import { UrlConstants } from "./core/constants/url.constants";


const routes: Routes = [
  {
    path: '',
    canActivate: [MsalGuard],
    // canActivate:[AuthGuard],
    loadChildren: () =>
      import('./modules/main/main.module').then((m) => m.MainModule),
  },
  // {
  //   path: 'auth',
  //   loadChildren: () =>
  //     import('./modules/authentication/authentication.module').then(
  //       (m) => m.AuthenticationModule
  //     ),
  // },
  {
    path: 'theme',
    component: ThemeComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
  // {
  //   path:'',
  //   component:HomeComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
