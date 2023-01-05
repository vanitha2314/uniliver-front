import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { filter, takeUntil } from 'rxjs/operators';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';


// const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
// type ProfileType = {
//   givenName?: string,
//   surname?: string,
//   token?:string
// }
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {
  // profile!: ProfileType;
  constructor(private http: HttpClient,private authService: AuthService, private  msalService: MsalService,private msalBroadcastService: MsalBroadcastService,) {}
  user: any;
  profile:any;
  userDetails: any;
  userName:any;
  @Input('isLandingPage') isLandingPage = false;
  ngOnInit(): void 
  {
    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
    )
    .subscribe((result: EventMessage) => {
      const payload = result.payload as AuthenticationResult;
      console.log(payload,"payload")
      this.authService.checkAndSetActiveAccounts().then((res) => {
        this.userDetails = res;
        this.userDetails.name=this.userDetails.name.trim()
        let nameArr=this.userDetails.name.split(',');
        console.log(nameArr)
        this.profile=nameArr[1]+" "+nameArr[0];
        console.log(this.profile,"new");       
      });
    });

  this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None)
    )
    .subscribe(() => {
      this.authService.checkAndSetActiveAccounts().then((res) => {
        this.authService.storeAccessToken();
        this.userDetails = res;
        this.userDetails.name=this.userDetails.name.trim()
        let nameArr=this.userDetails.name.split(',');
        // console.log(nameArr,"nameArray")
      });
    });

  this.authService.checkAndSetActiveAccounts().then((res) => {
    this.userDetails = res;
    this.userDetails.name=this.userDetails.name.trim()
        let nameArr=this.userDetails.name.split(',');
        this.userName=nameArr[1]+" "+nameArr[0];
  });
    this.userDetails
    this.authService.refreshToken().then(res =>{
      let item: any;
      let secretKey = res.accessToken              
            Object.keys(localStorage).forEach(data => {
              item = localStorage.getItem(data);
              try {
                if (typeof (JSON.parse(item)) === 'object') {
                  const secret_key= JSON.parse(item)
                  if (secret_key.credentialType === "AccessToken")
                    if (secret_key.hasOwnProperty("secret")) {
                      secret_key.secret = secretKey
                      localStorage.setItem(data, JSON.stringify(secret_key))
                      // console.log("first")
                    }
                }
        
              } catch (err) {
                // console.log(err)
              }
            });
    })
    
    // // this.user = this.authService.getUserDetails();
    // console.log(this.user,"header user detials")
    // // this.getProfile()
    
    if (window.innerWidth) {
      const sideNavContainer =
        document.getElementsByClassName('sidenav-container')[0];
      if (window.innerWidth < 786) {
        sideNavContainer?.classList.add('sidebar-collapsed');
      } else {
        sideNavContainer?.classList.remove('sidebar-collapsed');
      }
    }
    window.onresize = () => {
      const sideNavContainer =
        document.getElementsByClassName('sidenav-container')[0];
      if (window.innerWidth < 786) {
        sideNavContainer?.classList.add('sidebar-collapsed');
      } else {
        sideNavContainer?.classList.remove('sidebar-collapsed');
      }
    };
  }
  // getProfile(){
  // this.profile=JSON.parse(localStorage.getItem('_u') as string)
  // }
  onToggleSideNavCanvas() {
    document
      .getElementsByClassName('sidenav-container')[0]
      .classList.toggle('sidebar-collapsed');
  }

  toggleDropdown() {
    document
      .getElementById('navbar-dropdown')
      ?.classList.toggle('dropdown-collapsed');
  }

  onLogout() {
    this.authService.logout();
    this.msalService.logout();
  }
}
