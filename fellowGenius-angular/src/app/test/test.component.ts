import { Component, OnInit } from '@angular/core';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [],
})
export class TestComponent implements OnInit {

  constructor(
    private router: Router
  ){

  }

  myControl = new FormControl(undefined, [Validators.required, this.requireMatch.bind(this)]);
  filteredOptions: Observable<string[]>;
  options: string[] = [
    'Sales and Business Development','Finance','Marketing','HR','Operations and SCM','Strategy and Industry Expertise','Programming and Technology','New and Emerging technologies','Software Tools','Personal Development','Immigration Consulting','Competitive Exam Preparation'
   ];
   selectedSubject;
  ngOnInit() {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private requireMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.options && this.options.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  } 

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displaySelectedSubjects() {
    console.log("Inside display selected subject");
    console.log(this.selectedSubject);
    if (this.selectedSubject) {
      console.log("Inside route")
      this.router.navigate(['search-results'], {
        queryParams: { subject: this.selectedSubject },
      });
    }
  }

  optionSelected(val){
    console.log("Inside option selected");
    console.log(val);
    this.router.navigate(['search-results'], {
      queryParams: { subject: val },
    });
  }

  onEnter(event){
    console.log("Event keycode");
    console.log(event.code);
  }
  menuToggle() {
    let toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
  } 
}
