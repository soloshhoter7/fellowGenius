import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  selector: '[expertPriceValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => expertisePriceValidator),
      multi: true,
    },
  ],
})
export class expertisePriceValidator implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value == null) {
      return null;
    } else {
      var price = control.value;
      if (price != undefined) {
        if (price > 1 && price % 1 == 0) {
          return null;
        } else {
          return { invalidPrice: true };
        }
      }
    }
  }
}
