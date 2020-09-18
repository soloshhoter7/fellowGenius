import {Pipe, PipeTransform } from '@angular/core';
@Pipe({
	name: 'lengthBound'
})
export class LengthBound implements PipeTransform {
	transform(value: string) {
        console.log("pipe is running" + value.length);
        if(value.length >=100){
            console.log(value.substr(0,100));
            return (value.substr(0,100));
            
        }else{
            return value;
        }
	}
}

