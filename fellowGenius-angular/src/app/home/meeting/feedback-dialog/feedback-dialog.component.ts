import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent implements OnInit {
//role to be get by session
role;
rating:Number=0;
mobilerating:Number=0;
review:String;
learner_likes:Likes[]
learner_dislikes:Likes[]
expert_likes:Likes[]
expert_dislikes:Likes[]
feedback:Feedback
errorText:boolean=false;
constructor( 
  public dialogRef:MatDialogRef<FeedbackDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: {role:string}) {
    console.log("the role is :",data.role);
    this.role=data.role;
  }

ngOnInit(): void {

  //  INITIALIZE VARIABLES
  this.rating=0;
  this.mobilerating=0;
  this.review="";
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
    this.feedback.likes=[];
    this.feedback.dislikes=[];
    if(this.feedback.role==="learner"){
      this.learner_likes.map((l)=>{
        if(l.checked){
          this.feedback.likes.push(l.name);
        }
      });
      
      this.learner_dislikes.map((l)=>{
        if(l.checked){
          this.feedback.dislikes.push(l.name);
        }
      });
    }else{ //if role is expert
    this.expert_likes.map((l)=>{
      if(l.checked){
        this.feedback.likes.push(l.name);
      }
    });
    
    this.expert_dislikes.map((l)=>{
      if(l.checked){
        this.feedback.dislikes.push(l.name);
      }
    });
  }
     console.log(this.feedback);
     this.dialogRef.close(this.feedback);
  }
    
}

onFeedbackUpdations(isChecked: boolean,id: string,first_array: Likes[],second_array: Likes[]){
  if(isChecked){
    var index=second_array.findIndex(t=> t.name == id);
  
  if(index!=-1){
    second_array.splice(second_array.findIndex(t=> t.name == id),1);
  }
  }else{
    var json=first_array.find(t=>t.name == id);
    json.checked=false;
    
    second_array.splice(json.id-1,0,json);
  }
  
//  console.log(second_array);
  
  first_array = first_array.map((d) => {
    if (d.name == id) {
      d.checked = isChecked;

      return d;
    }
    
    return d;
  });

}

onChangeLearnerLike($event){
  
  this.onFeedbackUpdations(
    $event.target.checked,$event.target.value,this.learner_likes,this.learner_dislikes);
  
  console.log(this.learner_likes);
}

onChangeLearnerDislike($event){

  this.onFeedbackUpdations(
    $event.target.checked,$event.target.value,this.learner_dislikes,this.learner_likes);
  console.log(this.learner_dislikes);
}

onChangeExpertLike($event){

  this.onFeedbackUpdations(
    $event.target.checked,$event.target.value,this.expert_likes,this.expert_dislikes);

  console.log(this.expert_likes);
}

onChangeExpertDislike($event){

  this.onFeedbackUpdations(
    $event.target.checked,$event.target.value,this.expert_dislikes,this.expert_likes);

  console.log(this.expert_dislikes);
}

onRatingChange(event: any){
  const value = event.target.value;
  console.log(value);
}
closeDialog(){
  this.dialogRef.close();
}
}



class Likes{
id:number;
name:String;
checked:Boolean
}

class Feedback{
role:String;
rating:Number;
likes:String[];
dislikes:String[];
review:String
}

