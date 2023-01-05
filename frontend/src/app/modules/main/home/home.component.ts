import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
// const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me'; // Prod graph endpoint. Uncomment to use.
const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
type ProfileType = {
  givenName?: string;
  surname?: string;
  mail?: string;
  id?: string;
  token?: string;
  isAdmin?:any
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  profile!: ProfileType;
  user: any;
  roles: any;
  isUsersActionEnabled: boolean;
  isIframe = false;
  loginDisplay = false;

  private readonly _destroying$ = new Subject<void>();

  // constructor(private authService: AuthService,
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // this.getProfile();
    this.accessUserManagementRole()
    this.authService.refreshToken().then((res) => {
      // console.log(res,"refreshToken")
    });
  }
  /*
  getProfile() {
    this.http.get(GRAPH_ENDPOINT).subscribe((profile) => {
      this.profile = profile;
      this.profile['token'] = '';
      this.profile['id'] = '';
      this.authService.setUserDetails(this.profile);
      this.userLogin();
    });
  }


  userLogin() {
    this.roles = JSON.parse(localStorage.getItem('id_data') as string);
    console.log("this.roles,", this.roles)
    if (this.roles?.roles[0] === 'NA_UPI_D&A_All_Users') {
      this.profile.isAdmin = 1;
    }
    else{
      this.profile.isAdmin = 0;
    }
    const data = {
      firstName: this.profile?.givenName,
      lastName: this.profile?.surname,
      email: this.profile?.mail,
      isAdmin:this.profile?.isAdmin,
    };
    this.authService.userLogIn(data).subscribe((res) => {
      this.profile['id'] = res.data.id;
      this.profile['token'] = res.data.token;
      this.authService.setUserDetails(this.profile);
      console.log(this.profile,"data")
    });
  }*/
  accessUserManagementRole() {
    this.roles = JSON.parse(localStorage.getItem('id_data') as string);
    console.log("this.roles,", this.roles)
    if (this.roles?.roles[0] === 'NA_UPI_D&A_All_Users') {
      this.isUsersActionEnabled = true;
    } else {
      this.isUsersActionEnabled = false;
    }
  }
  //   this.data = this.authService.getUserDetails();
  //   this.roles=this.authService.getUserDetails()
  //   // console.log(this.role,"role")
  //  for(const role in this.roles){
  //   //  console.log(`${role},`)
  //    this.usersRole=this.roles.role
  //   //  console.log(this.usersRole,"hhhhhhhh")
  //  }
  // }
}
