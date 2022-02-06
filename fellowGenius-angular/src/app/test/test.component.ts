import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [],
})
export class TestComponent implements OnInit {
  ngOnInit() {}
  menuToggle() {
    let toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
  }
}
