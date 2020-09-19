import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shorten'
})
export class ShortenLength implements PipeTransform{
    transform(description: any){
        if(description.length > 100){
            return description.substr(0,100)+' ...';
        }
        return description;
    }
}