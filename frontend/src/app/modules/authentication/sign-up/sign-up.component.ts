import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeIn } from 'src/app/animations/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { confirmPassword } from 'src/app/helpers/validtors';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  animations: [fadeIn],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  step: number = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createSignUpForm();
  }

  signUp() {
    if (this.signUpForm.valid) {
      let signUpVal = {
        ...this.signUpForm.value['step1'],
        ...this.signUpForm.value['step2'],
      };
      this.spinner.show('spinner-light');
      this.authService.userSignUp(signUpVal).subscribe(
        (res) => {
          this.spinner.hide('spinner-light');
          this.router.navigate(['auth/login']);
        },
        (err) => {
          this.toast.error('Something went wrong!')
          this.spinner.hide('spinner-light');
        }
      );
    } else {
      return this.signUpForm.markAsTouched();
    }
  }

  next() {
    this.step++;
  }

  back() {
    this.step--;
  }

  createSignUpForm() {
    this.signUpForm = this.fb.group({
      step1: this.fb.group(
        {
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          email: [
            '',
            [
              Validators.required,
              Validators.pattern(
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
              ),
            ],
          ],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required]],
        },
        { validators: confirmPassword }
      ),
      step2: this.fb.group({
        businessName: ['', [Validators.required]],
        accessType: ['read', [Validators.required]],
        functionalityAccess: ['', [Validators.required]],
      }),
    });
  }
}
