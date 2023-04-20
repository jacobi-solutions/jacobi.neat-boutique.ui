import { Directive } from '@angular/core';
import { ValidatorFn, UntypedFormGroup, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPasswordConfirmMustMatch]'
})
export class PasswordConfirmMustMatchDirective {

  constructor() { }

}

// export const passwordConfirmMustMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
export const passwordConfirmMustMatchValidator: any = (control: UntypedFormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const passwordConfirm = control.get('passwordConfirm');

  return password && passwordConfirm && password.value !== passwordConfirm.value ? { passwordConfirmMustMatch: true } : null;
};