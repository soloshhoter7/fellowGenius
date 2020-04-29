import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	ngOnInit(): void {}
	profileCompleted = false;
	formProgress = 12;
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ ENTER, COMMA ];
	fruitCtrl = new FormControl();
	filteredFruits: Observable<string[]>;
	fruits: string[] = [];
	allFruits: string[] = [
		'Automata',
		'Compiler Design',
		'Science',
		'Maths',
		'English',
		'C++',
		'java',
		'Internet Fundamentals'
	];

	@ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	constructor() {
		this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
		);
	}
	basicInfoComplete() {
		this.formProgress += 25;
	}
	profileComplete() {
		this.formProgress += 25;
	}
	verificationComplete() {
		this.formProgress = 99;
	}
	// ------------------------------------------- for chips --------------------------------------------------------------------------
	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {
			this.fruits.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.fruitCtrl.setValue(null);
		console.log(this.fruits);
	}

	remove(fruit: string): void {
		const index = this.fruits.indexOf(fruit);

		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		this.fruits.push(event.option.viewValue);
		this.fruitInput.nativeElement.value = '';
		this.fruitCtrl.setValue(null);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allFruits.filter((fruit) => fruit.toLowerCase().indexOf(filterValue) === 0);
	}
	// -------------------------------------------------------------------------------------------------------------------------------------
}
