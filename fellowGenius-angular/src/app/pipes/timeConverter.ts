import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
@Pipe({
	name: 'timeConverter'
})
export class TimeConverter implements PipeTransform {
	transform(value: any) {
        console.log(value);
        if(value<=12){
            return value;
        }else{
            return (value-12);
        }
        
	}
}
