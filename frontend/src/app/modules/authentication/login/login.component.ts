import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { AuthenticationResult } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';


// const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me'; // Prod graph endpoint. Uncomment to use.
const GRAPH_ENDPOINT = 'https://graph.microsoft-ppe.com/v1.0/me';
type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  profile!: ProfileType;
  loginForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private userService: MsalService
  ) {}

  ngOnInit(): void {
    // this.createLoginForm();
    this.getProfile();
    this.userService.instance.handleRedirectPromise().then( res => {
      if (res != null && res.account != null) {
        this.userService.instance.setActiveAccount(res.account)
      }
    })
  }
  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
        console.log(this.profile,"profile info")
      });
  }
  isLoggedIn(): boolean {
    return this.userService.instance.getActiveAccount() != null
  }

  userLogin() {
    this.userService.loginRedirect();

    this.userService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.userService.instance.setActiveAccount(response.account);
        console.log("user loggedIn")
      });
  }

  // userLogout() {
  //   this.userService.logout()
  // }



  // login() {
  //   if (this.loginForm.valid) {
  //     this.spinner.show('spinner-light');
  //     this.authService.userLogIn(this.loginForm.value).subscribe(
       
  //       (res: any) => {
  //         console.log(res,"login");
  //         this.spinner.hide('spinner-light');
  //         if (res.status === 200) {

  //             // const userValue = this.loginForm.value;
  
  //             // if(userValue.email === 'admin@gmail.com'){
  //             //   res.data.role = 1;
  //             //   res.data.role_name = 'Admin';
  //             // } else if(userValue.email === 'user@gmail.com'){
  //             //   res.data.role = 2;
  //             //   res.data.role_name = 'User';
  //             // }
  
  //           this.authService.setUserDetails(res.data);
  //           this.authService.getUserDetails();
  //           this.router.navigate(['/']);
  //         }
  //       },
  //       (err) => {
  //         this.spinner.hide('spinner-light');
  //         this.toast.error(
  //           (err?.error?.status === 401 || err?.error?.status === 404) &&
  //             err?.error?.message
  //             ? err?.error?.message
  //             : 'Something went wrong'
  //         );
  //         console.log(err);
  //       }
  //     );
  //   }
  //   return this.loginForm.markAsTouched();
  // }

  // createLoginForm() {
  //   this.loginForm = this.fb.group({
  //     email: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
  //       ],
  //     ],
  //     password: ['', [Validators.required]],
  //   });
  // }
}
