import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  //role to be get by session
  role="expert";
  rating:Number=0;
  mobilerating:Number=0;
  review:String;
  learner_likes:Likes[]
  learner_dislikes:Likes[]
  expert_likes:Likes[]
  expert_dislikes:Likes[]
  feedback:Feedback
  errorText:boolean=false;
  constructor() { }

  ngOnInit(): void {

    //  INITIALIZE VARIABLES
    this.rating=0;
    this.mobilerating=0;
    this.review="";
    this.role="learner"
    this.learner_likes=[
      { id:1,name:"Fellowgenius platform",checked:false},
      { id:2,name:"Expert's session",checked:false},
      { id:3,name:"Range of Experts",checked:false},
      { id:4,name:"Video Call Experience",checked:false}
    ];
    this.learner_dislikes=[
      { id:1,name:"Fellowgenius platform",checked:false},
      { id:2,name:"Expert's session",checked:false},
      { id:3,name:"Range of Experts",checked:false},
      { id:4,name:"Video Call Experience",checked:false}
    ];
    this.expert_likes=[
      { id:1,name:"Fellowgenius Platform", checked:true},
      { id:2,name:"Session with learner", checked:false},
      { id:3,name: "Video call experience",checked:false}                
    ];
    this.expert_dislikes=[
      { id:1,name:"Fellowgenius Platform", checked:false},
      { id:2,name:"Session with learner", checked:false},
      { id:3,name: "Video call experience",checked:false}   
    ]
    this.feedback=new Feedback();
  }

  onFeedback(form: NgForm){
      
    if(this.rating===0){
      if(this.mobilerating !=0){
        this.rating=this.mobilerating;
      }else{
        this.errorText=true;
        window.scroll(0,0);
      }   
    }else{
      this.feedback.role=this.role;
      this.feedback.rating=this.rating;
      this.feedback.review=this.review;
      this.feedback.Likes=[];
      this.feedback.Dislikes=[];
      if(this.feedback.role==="learner"){
        this.learner_likes.map((l)=>{
          if(l.checked){
            this.feedback.Likes.push(l.name);
          }
        });
        
        this.learner_dislikes.map((l)=>{
          if(l.checked){
            this.feedback.Dislikes.push(l.name);
          }
        });
      }else{ //if role is expert
      this.expert_likes.map((l)=>{
        if(l.checked){
          this.feedback.Likes.push(l.name);
        }
      });
      
      this.expert_dislikes.map((l)=>{
        if(l.checked){
          this.feedback.Dislikes.push(l.name);
        }
      });
    }
       console.log(this.feedback);

       document.getElementById('close-popup').click();
    }
      
  }

  onChangeLearnerLike($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.learner_likes = this.learner_likes.map((d) => {
      if (d.id == id) {
        d.checked = isChecked;
    
        return d;
      }
      
      return d;
    });
    console.log(this.learner_likes);
  }

  onChangeLearnerDislike($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.learner_dislikes = this.learner_dislikes.map((d) => {
      if (d.id == id) {
        d.checked = isChecked;
    
        return d;
      }
      
      return d;
    });
    console.log(this.learner_dislikes);
  }

  onChangeExpertLike($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.expert_likes = this.expert_likes.map((d) => {
      if (d.id == id) {
        d.checked = isChecked;
    
        return d;
      }
      
      return d;
    });
    console.log(this.expert_likes);
  }

  onChangeExpertDislike($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.expert_dislikes = this.expert_dislikes.map((d) => {
      if (d.id == id) {
        d.checked = isChecked;
    
        return d;
      }
      
      return d;
    });
    console.log(this.expert_dislikes);
  }

  onRatingChange(event: any){
    const value = event.target.value;
    console.log(value);
  }
  }

 

class Likes{
  id:Number;
  name:String;
  checked:Boolean
}

class Feedback{
  role:String;
  rating:Number;
  Likes:String[];
  Dislikes:String[];
  review:String
}


