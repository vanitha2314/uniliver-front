import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { confirmPassword } from 'src/app/helpers/validtors';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private userService: UserManagementService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createResetForm();
    this.route.params.subscribe((params) => {
      this.resetForm.patchValue({
        id: params.id,
        resetToken: params.token,
      });
    });
  }

  submit() {
    if (this.resetForm.valid) {
      const data = this.resetForm.value;
      this.spinner.show('spinner-light');
      this.userService.resetPassword(data.id, data).subscribe(
        (res) => {
          this.spinner.hide('spinner-light');
          if (res?.status === 200) {
            this.toast.success('Successfully changed Password!');
          }
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 700);
        },
        (err) => {
          this.spinner.hide('spinner-light');
          this.toast.error('Something went wrong!');
        }
      );
    }
  }

  createResetForm() {
    this.resetForm = this.fb.group(
      {
        id: ['', Validators.required],
        resetToken: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: confirmPassword }
    );
  }
}
