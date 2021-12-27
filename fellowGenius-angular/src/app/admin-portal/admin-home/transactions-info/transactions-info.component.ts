import { Component, OnInit } from '@angular/core';
import th from 'date-fns/esm/locale/th/index.js';
import { Transaction } from 'src/app/model/Transaction';
import { AdminService } from 'src/app/service/admin.service';
import { HttpService } from 'src/app/service/http.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-transactions-info',
  templateUrl: './transactions-info.component.html',
  styleUrls: ['./transactions-info.component.css']
})
export class TransactionsInfoComponent implements OnInit {
  pendingTransactions:Transaction[]=[];
  previousTransactions:Transaction[]=[];

  constructor(private httpService: HttpService,
              private adminService:AdminService,
              private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    
    this.initialisePendingTransactions();
    this.initialisePreviousTransactions();
  }

  initialisePendingTransactions(){
    this.adminService.fetchPendingTransactionsList();
    this.adminService.pendingTransactionsChanged.subscribe(
      (pendingTransactionsList:Transaction[]) =>{
        this.pendingTransactions = pendingTransactionsList;
        console.log('pending transaction list: ',this.pendingTransactions);
      }
    )
  }

  initialisePreviousTransactions(){
    this.adminService.fetchPreviousTransactionsList();
    this.adminService.previousTransactionsChanged.subscribe(
      (previousTransactionsList:Transaction[])=>{
        this.previousTransactions=previousTransactionsList;
        console.log('previous transaction list: ',this.previousTransactions);
      }
    )
    }

  isUpiIdNotAvailable(transaction:Transaction){
    if(transaction.upiId=="NOT_AVAILABLE"){
      return true;
    }else{
      return false;
    }
  }

  onAddTransaction(transaction:Transaction,form: NgForm){
    // console.log(transaction);
    // console.log(form.value.payableAmount);
    transaction.transactionId=form.value.transactionId;
    if(transaction.payableAmount<form.value.payableAmount){
      transaction.payableAmount=form.value.payableAmount;
    }else{
      transaction.payableAmount=form.value.payableAmount;
    }
    console.log(transaction);
    
    this.httpService.addTransaction(transaction).subscribe(
      (res)=>{
        console.log(res);
        console.log('success');
        this.initialisePendingTransactions();
        this.initialisePreviousTransactions();
      }
    )
    $(".close").click();
  }
}
