import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
@Pipe({
	name: 'timeMedian'
})
export class TimeMedian implements PipeTransform {
	transform(value: any) {
        if(value<12){
            return 'AM';
        }else{
            return 'PM';
        }
        
	}
}
