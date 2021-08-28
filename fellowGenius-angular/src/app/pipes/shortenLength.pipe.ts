import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shorten'
})
export class ShortenLength implements PipeTransform{
    transform(description: any){
        if(description.length > 50){
            return description.substr(0,50)+' ...';
        }
        return description;
    }
}