import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
    selector: '[completionDateValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: completionDateValidator,
        multi: true
    }]
})
export class completionDateValidator implements Validator {
    validate(control: AbstractControl): { [key: string]: any } | null {

        if(control.value == null){
            return null
        }else{
            var dateOfBirth = control.value;
            var studentDOB = dateOfBirth.split('-');
            var dobYear = parseInt(studentDOB[0]);
            var maxYear = new Date().getFullYear();
            var minYear = new Date().getFullYear() - 60;
    
            if (dobYear < maxYear && dobYear > minYear){
                return null;
            }else{
                return { 'invalid completion date': true}
            }
        }
       
        
    }
}