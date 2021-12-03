import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  dateOfBirth = new Date();
  inputCompletionDate = new FormControl(moment());
  minDate;
  maxDate;
  constructor() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
  }

  ngOnInit(): void {}

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.inputCompletionDate.value;
    ctrlValue.year(normalizedYear.year());
    this.inputCompletionDate.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.inputCompletionDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.inputCompletionDate.setValue(ctrlValue);
    datepicker.close();
  }

  getMonthYearString(val) {
    let momentVariable = moment(val.value._d, 'YYYY-MM-DD');
    return momentVariable.format('MMMM YYYY');
  }

  formatDobFromMoment(momentDate: any) {
    // console.log(momentDate);
    let formattedDate = moment(momentDate._d).format('DD/MM/YYYY');
    return formattedDate;
  }

  onSubmit(form: any) {
    let dateString = this.getMonthYearString(this.inputCompletionDate);
    console.log(dateString);
    let dob = form.value.dob;
    // console.log(dob);
    console.log(this.formatDobFromMoment(dob));
  }
}
