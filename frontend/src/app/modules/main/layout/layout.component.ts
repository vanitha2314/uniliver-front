import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/* type ProfileType = {
  givenName?: string;
  surname?: string;
  mail?: string;
  id?: string;
  token?: string;
  isAdmin?:any
}; */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})

export class LayoutComponent implements OnInit {
  isLandingPage = false;
  profile: any;
  GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
  constructor(private route: ActivatedRoute, private router: Router,   private http: HttpClient,
    private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.isLandingPage = true;
        } else {
          this.isLandingPage = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.getProfile();
  }
   getProfile() {
    this.http.get(this.GRAPH_ENDPOINT).subscribe((profile) => {
      this.profile = profile;
      this.profile['token'] = '';
      this.profile['id'] = '';
      this.authService.setUserDetails(this.profile);
      this.userLogin();
    });
  }

  userLogin() {
    const roles = JSON.parse(localStorage.getItem('id_data') as string);
    console.log("this.roles,", roles)
    if (roles?.roles[0] === 'NA_UPI_D&A_All_Users') {
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
  }

  toggleMobileSideNavCanvas() {}
}
