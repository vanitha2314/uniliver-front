import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private userService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.createForgotForm();
  }

  createForgotForm() {
    this.forgotForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
    });
  }

  submit() {
    if (this.forgotForm.valid) {
      this.spinner.show('spinner-light');
      this.userService.forgotPassword(this.forgotForm.value).subscribe(
        (res) => {
          this.spinner.hide('spinner-light');
          if (res?.status === 200) {
            this.toast.success('Successfully sent reset link to email!');
            setTimeout(() => {
              this.router.navigate(['/auth']);
            }, 1000);
          }
        },
        (err) => {
          this.spinner.hide('spinner-light');
          this.toast.error(err?.error?.message || 'Something went wrong!');
        }
      );
    }
  }
}
