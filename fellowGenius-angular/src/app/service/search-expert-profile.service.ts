import { C } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchExpertProfileService {
  constructor() {}
  createExpertString(result: any, subject, limit) {
    console.log('Inside the search expert profile service ');
    let elementsLeft = false;
    console.log(result, subject, limit);
    let filteredArray = result.areaOfExpertise.filter((x) => {
      if (x.category == subject) return x;
    });
    console.log('filtered Array ->', filteredArray);
    let expertise: string = '';
    for (let i = 0; i < filteredArray.length; i++) {
      if (filteredArray[i].category == subject) {
        if (filteredArray[i].subCategory.length <= limit - expertise.length) {
          expertise += filteredArray[i].subCategory;
          if (
            i != filteredArray.length - 1 &&
            filteredArray[i + 1].subCategory.length <= limit - expertise.length
          ) {
            expertise += ', ';
          }
        } else {
          elementsLeft = true;
        }
      }
    }
    if (expertise.length <= limit - 3) {
      if (elementsLeft) {
        expertise += ' ...';
      }
    }
    console.log(expertise);
    return expertise;
  }
}
