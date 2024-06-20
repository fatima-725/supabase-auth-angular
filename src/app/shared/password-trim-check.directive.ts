import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordTrimCheck(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const trimmedValue = control.value.trim();
      if (control.value !== trimmedValue) {
        return { noLeadingTrailingSpaces: true };
      }
    }
    return null;
  };
}
