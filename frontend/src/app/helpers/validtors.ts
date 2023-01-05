import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPassword: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password?.value &&
    confirmPassword?.value &&
    password.value !== confirmPassword.value
    ? { invalidConfirmPassword: true }
    : null;
};

export const startsWith = (startsWith: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return (control.value as string).toLowerCase().startsWith(startsWith)
      ? null
      : { startsWith: true };
  };
};
