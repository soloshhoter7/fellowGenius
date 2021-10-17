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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterDiaologComponent } from './register-diaolog/register-diaolog.component';
import { featuredExpert } from '../model/tutorProfileDetails';
declare const owlCarousel: any;
@Component({
  selector: 'app-facade',
  templateUrl: './facade.component.html',
  styleUrls: ['./facade.component.css'],
})
export class FacadeComponent implements OnInit {
  constructor(
    private router: Router,
    public loginService: LoginDetailsService,
    public breakpointObserver: BreakpointObserver,
    private httpService:HttpService,
    private webSocketService:WebSocketService,
    private dialog:MatDialog
    
  ) {
    
  }
  featuredExperts:featuredExpert[]=[];
  switchView: boolean = false;
  showContainer: boolean = false;
  reviewsView = true;
  firstName='shubham';
  lastName='sharma'
  myControl = new FormControl();
  options: string[] = [
   'Sales and Business Development','Finance','Marketing','HR','Operations and SCM','Strategy and Industry Expertise','Programming and Technology','New and Emerging technologies','Software Tools','Personal Development','Immigration Consulting','Competitive Exam Preparation'
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
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1632597827378?alt=media&token=76adf521-fc64-430d-85b8-d02cac72d0aa',
      name: 'Ruchir Thakkar',
      specialisation: 'PIET - B.tech[CSE]',
      domain:'B2C Sales and Distribution',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Its beautiful user interface make Experts and learner feel at home.',
    },
    {
      id: 2,
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1632218586352?alt=media&token=78a15381-7bbf-455f-96e0-57c1a8cdceb2',
      name: 'Ritam Dasgupta',
      specialisation: 'PIET - B.tech[CSE]',
      domain:'International Sales',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Its beautiful user interface make Experts and learner feel at home.',
    },
    {
      id: 3,
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1630788559940?alt=media&token=c88171bc-de02-43da-b3f7-cba3e2fe7197',
      name: 'Vikas Dabas',
      domain:'Product Management',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'As an expert, it was an awesome experience being part of this platform. ',
      studentsCount: 30,
      sessionsCount: 46,
      rating: 90,
    },
    {
      id: 4,
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1631097989114?alt=media&token=ef49be5a-167a-471c-a09f-a140374268fd',
      name: 'Paawan juneja',
      domain:'Talent Acquisition',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I loved the experience of teaching here and the quality functionality.',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
    },
    {
      id: 5,
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1632124416978?alt=media&token=ebc11fdc-e4f2-4e3f-afb5-afb35717ee23',
      name: 'Rajdeep Singh Kang',
      specialisation: 'PIET - B.tech[CSE]',
      domain:'Website Development',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Its beautiful user interface make Experts and learner feel at home.',
    },
    {
      id: 6,
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1632637731432?alt=media&token=51b3fad3-05f7-47ba-8ec9-8671992b9b84',
      name: 'Sayantika Bose',
      specialisation: 'PIET - B.tech[CSE]',
      domain:'Wellness and Life Coaching',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Its beautiful user interface make Experts and learner feel at home.',
    },
    {
      id: 7,
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1631989579407?alt=media&token=65d14c69-78c4-4dc9-949a-49b0f501b8ca',
      name: 'Rahul Garg',
      specialisation: 'PIET - B.tech[CSE]',
      domain:'GATE/GRE/JEE',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Its beautiful user interface make Experts and learner feel at home.',
    }
  ];
  ngAfterViewInit(){
    initiate();
    this.getAllCategories();
  }
  ngOnInit(): void {
  
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.fetchFeaturedExperts();
  }
  signUpRouting(val){
    document.getElementById('closePopUpButton').click();
    this.router.navigate([val])
  }
  sendData(){
    // this.webSocketService.sendMessageToMeeting('724402542');
    this.httpService.randomApi().subscribe((res)=>{

    })
  }
  fetchFeaturedExperts() {
    this.httpService.fetchFeaturedExperts().subscribe((res) => {
      this.featuredExperts = res;
      this.sortFeaturedExperts();
      console.log(this.featuredExperts);
    });
  }
  sortFeaturedExperts() {
    this.featuredExperts.sort((a, b) =>
      a.precedence > b.precedence ? 1 : b.precedence > a.precedence ? -1 : 0
    );
  }
  getAllCategories(){    
    this.httpService.getAllCategories().subscribe((res)=>{
      let categories:Category[] = res;
      
      if(categories.length>0){
       this.options=[];
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
  optionSelected(val){
    this.router.navigate(['search-results'], {
      queryParams: { subject: val },
    });
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
