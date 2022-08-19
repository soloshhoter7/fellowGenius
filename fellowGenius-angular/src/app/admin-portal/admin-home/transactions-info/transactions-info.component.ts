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
  totalPayableUser:number;
  totalPayableAmount:number=0;
  partialMeetingTransaction: boolean=false;
  totalPayableTransactions: number;
  constructor(private httpService: HttpService,
              private adminService:AdminService,
              private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    
    this.initialisePendingTransactions();
    this.initialisePreviousTransactions();
  }

  

  initialisePendingTransactions(){
    this.adminService.fetchPendingTransactionsList();
    this.totalPayableAmount=0;
    this.adminService.pendingTransactionsChanged.subscribe(
      (pendingTransactionsList:Transaction[]) =>{
        this.pendingTransactions = pendingTransactionsList;
       
        this.totalPayableAmount=0;
        this.calculateTotalPendingAmountAndUsers();
      }
    )
  }

  initialisePreviousTransactions(){
    this.adminService.fetchPreviousTransactionsList();
    this.adminService.previousTransactionsChanged.subscribe(
      (previousTransactionsList:Transaction[])=>{
        this.previousTransactions=previousTransactionsList;
   
      }
    )
    }

    calculateTotalPendingAmountAndUsers(){
      this.totalPayableTransactions=this.pendingTransactions.length;
      for(let pendingTransaction of this.pendingTransactions){
        this.totalPayableAmount=this.totalPayableAmount+ pendingTransaction.remainingAmount;
      }
        this.totalPayableAmount=parseFloat(this.totalPayableAmount.toFixed(2));
      const uniqueArray=[...new Set(this.pendingTransactions.map(item=>item.userId))];
     
     this.totalPayableUser=uniqueArray.length;
    }

  isUpiIdNotAvailable(transaction:Transaction){
    if(transaction.upiId=="NOT_AVAILABLE"){
      return true;
    }else{
      return false;
    }
  }

  onAddTransaction(transaction:Transaction,form: NgForm){
    transaction.paidAmount=transaction.remainingAmount;
    transaction.transactionId=form.value.transactionId;
    
    this.httpService.addTransaction(transaction).subscribe(
      (res)=>{
        
        this.initialisePendingTransactions();
        this.initialisePreviousTransactions();
      }
    );
    $(".close").click();

     
  }
}
