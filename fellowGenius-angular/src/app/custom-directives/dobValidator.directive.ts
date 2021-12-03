import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
    selector: '[dobValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: dobValidator,
        multi: true
    }]
})
export class dobValidator implements Validator {
    validate(control: AbstractControl): { [key: string]: any } | null {

        if(control.value == null){
            return null
        }else{
            var dateOfBirth = control.value;
            if(dateOfBirth !=undefined){
            console.log(dateOfBirth);
            var dobYear=dateOfBirth._i.year;
            // var studentDOB = dateOfBirth.split('-');
            // var dobYear = parseInt(studentDOB[0]);
            var maxYear = new Date().getFullYear() - 6;
            var minYear = new Date().getFullYear() - 70;
    
            if (dobYear < maxYear && dobYear > minYear){
                return null;
            }else{
                return { 'invalidDob': true}
            }
            }
            
            
        }
       
        
    }
}