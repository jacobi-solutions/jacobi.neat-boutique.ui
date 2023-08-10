import { Directive } from '@angular/core';
import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPasswordConfirmMustMatch]'
})
export class PasswordConfirmMustMatchDirective {

  constructor() { }

}

// export const passwordConfirmMustMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  export const passwordConfirmMustMatchValidator: any = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    var misMatch = password && passwordConfirm && password.value !== passwordConfirm.value;
    if(misMatch) {
      passwordConfirm.setErrors({ 'passwordConfirmMustMatch': true });
    }
    return misMatch ? { passwordConfirmMustMatch: true } : null;
  };
  
  export const emailConfirmMustMatchValidator: any = (control: FormGroup): ValidationErrors | null => {
    const email = control.get('email');
    const emailConfirm = control.get('emailConfirm');
    var misMatch = email && emailConfirm && email.value !== emailConfirm.value;
    if(misMatch) {
      emailConfirm.setErrors({ 'passwordConfirmMustMatch': true });
    }
    return misMatch ? { passwordConfirmMustMatch: true } : null;
  };