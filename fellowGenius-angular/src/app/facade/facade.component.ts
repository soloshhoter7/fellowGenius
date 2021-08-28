import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDetailsService } from '../service/login-details.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpService } from '../service/http.service';
import { Category } from '../model/category';
import { WebSocketService } from '../service/web-socket.service';
import * as $ from 'jquery';
import {initiate} from '../../assets/js/custom';
declare const owlCarousel: any;
@Component({
  selector: 'app-facade',
  templateUrl: './facade.component.html',
  styleUrls: ['./facade.component.css'],
})
export class FacadeComponent implements OnInit {
  constructor(
    private router: Router,
    private loginDetailsService: LoginDetailsService,
    public breakpointObserver: BreakpointObserver,
    private httpService:HttpService,
    private webSocketService:WebSocketService
    
  ) {
    
  }
  
  switchView: boolean = false;
  showContainer: boolean = false;
  reviewsView = true;
  firstName='shubham';
  lastName='sharma'
  myControl = new FormControl();
  options: string[] = [
   'Tools','Marketing','Content','Project Management','Sales','E-comm','Industry Consulation','Strategy','Finance','HR','Operations','IT Support'
  ];
  filteredOptions: Observable<string[]>;

  selectedSubject;
  // options settings for owl carousel;
  customOptions: OwlOptions = {
    autoWidth:false,
        stagePadding: 0,
        autoplayTimeout: 9000, // time for slides changes
        smartSpeed: 1000, // duration of change of 1 slide
        items: 1,
        loop: true,
        //slideBy:'page',
        autoplay: true,
        margin: 0,
        dots: true,
        
        touchDrag: false,
        mouseDrag: false,
        nav: false
  };
  expertOptions:OwlOptions={
    autoWidth:false,
        stagePadding: 0,
        autoplayTimeout: 9000, // time for slides changes
        smartSpeed: 1000, // duration of change of 1 slide
        items: 3,
        // singleItem:true,
        loop: false,
        //slideBy:'page',
        autoplay: false,
        margin: 10,
        dots: false,
        touchDrag: false,
        mouseDrag: false,
        nav: true,
        // navText: ["<img src='../../assets/images/slider-left-arrow.svg'>","<img src=''../../assets/images/slider-right-arrow.svg'>"],
        navText:["<img src='../../assets/images/slider-left-arrow.svg'>","<img src='../../assets/images/slider-right-arrow.svg'>"],
        responsive:{
            0:{ // breakpoint from 0 up - small smartphones
                items:1
            },
            480:{  // breakpoint from 480 up - smartphones // landscape
                items:1
            },
            768:{ // breakpoint from 768 up - tablets
                items:2,
                loop:false
            },
            992:{ // breakpoint from 992 up - desktop
                items:3,
                loop:false
            },
            1199:{ // breakpoint from 1199 up - desktop
                items:4,
                loop:false
            }
        }
  }
  //arrray for carousel
  slidesStore = [
    {
      id: 1,
      imageUrl: '../../assets/images/expert-2.png',
      name: 'Suyash Kejriwal',
      specialisation: 'PIET - B.tech[CSE]',
      domain:'Finance',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Its beautiful user interface make Experts and learner feel at home.',
    },
    {
      id: 2,
      imageUrl: '../../assets/images/vaibhav.jpeg',
      name: 'Vaibhav Vishal Jha',
      domain:'Tools',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'As an expert, it was an awesome experience being part of this platform. ',
      studentsCount: 30,
      sessionsCount: 46,
      rating: 90,
    },
    {
      id: 3,
      imageUrl: '../../assets/images/ajayVerma.jpg',
      name: 'Ajay Verma',
      domain:'Marketing',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I loved the experience of teaching and the quality functionality.',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
    },
    {
      id: 4,
      imageUrl: '../../assets/images/amanGarg.jpg',
      name: 'Aman garg',
      domain:'Marketing',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I loved the experience of teaching here and the quality functionality.',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
    },
    {
      id: 5,
      imageUrl: '../../assets/images/expert-4.png',
      name: 'Himanshu Goyal',
      domain:'Sales',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I really loved the experience of teaching here and the quality functionality.',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
    },
    
    {
      id: 6,
      imageUrl: '../../assets/images/expert-3.png',
      name: 'Vir chauhan',
      domain:'Tools',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I really loved the experience of teaching here and the quality functionality.',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
    }
  ];
  ngAfterViewInit(){
    initiate();
  }
  ngOnInit(): void {
    
    // this.breakpointObserver
    //   .observe(["(min-width: 800px)"])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches) {
    //       this.showContainer = true;
    //       this.switchView = false;
    //     } else {
    //       this.showContainer = false;
    //       this.switchView = true;
    //     }
    //   });
    // this.getAllCategories();
    // this.stickyNavBar();
    // this.initialiseCarousel();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  
  sendData(){
    // this.webSocketService.sendMessageToMeeting('724402542');
    this.httpService.randomApi().subscribe((res)=>{

    })
  }
  getAllCategories(){
   
    
    this.httpService.getAllCategories().subscribe((res)=>{
      let categories:Category[] = res;
  
      if(categories.length>0){
       
        for(var i=0;i<categories.length;i++){
       
          this.options.push(categories[i].category);
        }
      }
     
      // if(categories.length>0){
      //   // categories.forEach(function (value){
      //   //   this.categories.push(value.category);
      //   // })
      // }
    });
  }
  switchReviewsView() {
    this.reviewsView = !this.reviewsView;
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displaySelectedSubjects() {
    if (this.selectedSubject) {
      this.router.navigate(['search-results'], {
        queryParams: { subject: this.selectedSubject },
      });
    }
  }
  displayFromTiles(category) {
    console.log(category)
    if (category!=null) {
      this.router.navigate(['search-results'], {
        queryParams: { subject: category },
      });
    }
  }
  toTermsPage(evt:any) {
  
      this.router.navigate(['terms-and-conditions'], {
        queryParams: { section: evt },
      });
  }
  onSignUp() {
    this.router.navigate(['sign-up']);
  }

  toLoginPage() {
    this.router.navigate(['login']);
  }
}
