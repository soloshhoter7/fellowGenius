import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
	name: 'zero'
})
export class zeroDigit implements PipeTransform {
	transform(value: any) {
		if (value == 0) {
			return 0 + value.toString();
		} else {
			return value;
		}
	}
}
