import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchExpertProfileService {

  constructor() { }
  createExpertString(result:any,subject,limit){
    let elementsLeft=false;
    let filteredArray =  result.areaOfExpertise.filter(
      (x) => x.category == subject
    );
    let expertise:string='';
    for(let i=0;i<filteredArray.length;i++){
      if(filteredArray[i].category==subject){
        if(filteredArray[i].subCategory.length<=(limit-expertise.length)){
          expertise+=filteredArray[i].subCategory;
          if(i!=filteredArray.length-1&&filteredArray[i+1].subCategory.length<=(limit-expertise.length)){
            expertise+=', ';
          }
        }else{

          elementsLeft=true;
        }
      }
    }
    if(expertise.length<=(limit-3)){
      if(elementsLeft){
        expertise+=' ...';
      } 
    }
    return expertise;
  }
}
