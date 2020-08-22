import { Injectable } from '@angular/core';
import { MessageModel } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  private idSelected: number;
  private chat: MessageModel[]=[];
  
  public getIdSelected(): number {
    return this.idSelected;
  }
  public setIdSelected(value: number) {
    this.idSelected = value;
  }
  public getChat(){
    return this.chat;
  }
  public setChat(chat: MessageModel){
    this.chat.push(chat);
  }


}
