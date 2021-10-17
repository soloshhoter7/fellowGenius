import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'timeConverter',
})
export class TimeConverter implements PipeTransform {
  transform(value: any) {
    if (value == 0) {
      return 12;
    } else if (value <= 12) {
      return value;
    } else {
      return value - 12;
    }
  }
}
