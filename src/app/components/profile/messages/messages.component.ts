import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { UserModel, NewConversation, ConversationResponse, ConversationMessageResponse, NewMessage } from '../../../_services/models';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messageControl = new FormControl('', [Validators.required]);

  allMessages: ConversationMessageResponse[] = [];
  allConversations: ConversationResponse[] = [];
  selectedConversation: ConversationResponse;
  currentUser: UserModel;

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.currentUser = this.app.shared.getCurrentUser();
    if (this.currentUser === undefined) {
      this.app.shared.router.navigateByUrl('');
      return;
    }
    this.retrieveConversations();
    console.log(this.app.shared.storage.browsedUserID);
    if (this.app.shared.storage.newConversation) {
      this.app.shared.storage.newConversation = false;
      this.prepareMessageForBrowsedUser();
    }
  }

  private retrieveConversations() {
    this.app.api.getConversations(this.currentUser.UserID).subscribe(
      succ => this.allConversations = succ,
      err => console.log(err)
    );
  }

  private prepareMessageForBrowsedUser() {
    const newConversation = new ConversationResponse(0, this.app.shared.storage.browsedUser.name, 0);
    this.allConversations.push(newConversation);
    this.selectConversation(newConversation);
  }

  selectConversation(conversation: ConversationResponse) {
    this.selectedConversation = conversation;
    this.getMessages(conversation);
    console.log(conversation.ConversationTitle);
  }

  private getMessages(conversation: ConversationResponse) {
    this.app.api.getMessages(conversation.ConversationID).subscribe(
      this.populateControlWithMessages.bind(this),
      err => console.log(err)
    );
  }

  private populateControlWithMessages(res: any) {
    const obj: ConversationMessageResponse[] = res;
    this.allMessages = obj.length > 0 ? obj : [];
  }

  sendMessage(message: string) {
    console.log(message);
    if (this.allMessages.length === 0) {
      this.insertNewConversation(message);
    } else {
      const oMessage = new NewMessage(
        this.selectedConversation.ConversationID,
        this.selectedConversation.ConversationParticipantID,
        message);
      this.app.api.insertMessage(oMessage).subscribe(
        this.populateControlWithMessages.bind(this),
        err => console.log(err));
    }
  }

  insertNewConversation(message: string) {
    const participants = [this.app.shared.storage.browsedUser.userId, this.currentUser.UserID];
    const newConversation = new NewConversation(this.app.shared.storage.browsedUser.name, participants, message);
    this.app.api.insertConversation(newConversation).subscribe(
      succ => {
        console.log(succ);
        this.selectedConversation.ConversationID = succ[0];
      },
      err => console.log(err)
    );
  }
}
