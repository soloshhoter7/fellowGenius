
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Transaction } from '../model/Transaction';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(private httpService:HttpService) { }

  private pendingTransactionsList:Transaction[]=[];
  pendingTransactionsChanged=new Subject<Transaction[]>();

  private previousTransactionsList:Transaction[]=[];
  previousTransactionsChanged=new Subject<Transaction[]>();

  expertsList: tutorProfileDetails[];

  getPendingTransactionsList(){
    return this.pendingTransactionsList.slice();
  }

  setPendingTransactionsList(pendingInfo:Transaction[]) {
    this.pendingTransactionsList=pendingInfo;
    this.pendingTransactionsChanged.next(this.pendingTransactionsList.slice());
  }

  fetchPendingTransactionsList(){
    this.httpService.fetchPendingTransactionsInfo().subscribe(
      (res)=>{
        this.setPendingTransactionsList(res);
      }
    )
  }

  getPreviousTransactionsList(){
    return this.previousTransactionsList.slice();
  }

  setPreviousTransactionsList(previousInfo:Transaction[]){
    this.previousTransactionsList=previousInfo;
    this.previousTransactionsChanged.next(this.previousTransactionsList.slice());
  }

  fetchPreviousTransactionsList(){
    this.httpService.fetchPreviousTransactionsInfo().subscribe(
      (res)=>{
        this.setPreviousTransactionsList(res);
      }
    )
  }

  setExpertsList(expertList:tutorProfileDetails[]){
    this.expertsList=expertList; 
  }

  getExpertsList(){
    return this.expertsList;
  }

  
}
