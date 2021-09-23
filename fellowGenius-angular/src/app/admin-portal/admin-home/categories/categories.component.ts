import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from 'src/app/model/category';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    this.getAllCategories();
  
  }
  selectedValue;
  categoryInput;
  subCategoryInput;
  categories:Category[]=[];
  subCategories:Category[] =[];
  addCategory(form:NgForm){
   
    let categ = new Category();
    categ.category = form.value.categoryName;
    
    this.httpService.addNewCategory(categ).subscribe((res)=>{
      if(res==true){
        this.categories.push(categ);
        this.categoryInput='';
      }
    })
  }
  addSubCategory(form:NgForm){
    let categ = new Category();
    categ.category= form.value.categoryName;
    categ.subCategory = form.value.subCategoryName;
    this.httpService.addNewSubCategory(categ).subscribe((res)=>{
      if(res==true){
        this.subCategories.push(categ);
        this.subCategoryInput='';
      }
    })
  }
  getAllCategories(){
    this.httpService.getAllCategories().subscribe((res)=>{
      let categories:Category[] = res;
      if(categories.length>0){
        for(var i=0;i<categories.length;i++){
          let categ=new Category();
          categ.category=categories[i].category
          this.categories.push(categ);
          this.selectedValue=this.categories[0].category;
        }
      }
      this.httpService.getAllSubCategories().subscribe((res)=>{
        this.subCategories = res;
    
      })
     
    });
  }
  
}
