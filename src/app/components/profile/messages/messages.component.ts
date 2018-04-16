import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { UserModel, NewConversation, ConversationResponse, ConversationMessageResponse, NewMessage } from '../../../_services/models';
import { ApiService } from '../../../_services/api.service';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer: ElementRef;
  messageControl = new FormControl('', [Validators.required]);

  getMessagesInterval: any;
  allMessages: ConversationMessageResponse[] = [];
  allConversations: ConversationResponse[] = [];
  selectedConversation: ConversationResponse;
  tempNewConversationID: number;
  currentUser: UserModel;

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.currentUser = this.app.shared.getCurrentUser();
    if (this.currentUser === undefined) {
      this.app.shared.router.navigateByUrl('');
      return;
    }
    if (this.app.shared.storage.newConversation) {
      this.app.shared.storage.newConversation = false;
      this.app.api.getExistingConversations(this.currentUser.UserID, this.app.shared.storage.browsedUser.userId).subscribe(
        this.prepareMessageForBrowsedUser.bind(this),
        err => console.log(err)
      );
    } else {
      this.retrieveConversations();
    }
  }

  private retrieveConversations() {
    this.app.api.getConversations(this.currentUser.UserID).subscribe(
      this.manageAllConversationsArray.bind(this),
      err => console.log(err),

    );
  }

  private prepareMessageForBrowsedUser(res: any) {
    const conversationResponse: ConversationResponse = res[0];
    let newConversation = conversationResponse;
    this.app.api.getConversations(this.currentUser.UserID).subscribe(
      this.manageAllConversationsArray.bind(this),
      err => console.log(err),
      () => {
        if (conversationResponse === undefined) {
          newConversation = new ConversationResponse(0, this.app.shared.storage.browsedUser.name, 0);
          this.allConversations.push(newConversation);
        }
        this.selectConversation(newConversation);
      }
    );
  }

  selectConversation(conversation: ConversationResponse) {
    this.allConversations.forEach(c => c.Active = false);
    this.selectedConversation = conversation;
    const convIndex = this.allConversations.findIndex(c => c.ConversationID === conversation.ConversationID);
    this.allConversations[convIndex].Active = true;
    if (conversation.ConversationID !== 0) {
      this.manageActiveChat(conversation);
      this.getMessages(conversation);
    }
  }

  private manageActiveChat(conversation: ConversationResponse) {
    clearInterval(this.getMessagesInterval);
    this.getMessagesInterval = setInterval(() => this.getMessages(conversation), 5000);
    this.app.shared.router.events.subscribe((e: NavigationEnd) => {
      clearInterval(this.getMessagesInterval);
    });
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
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTo(0, this.messagesContainer.nativeElement.scrollHeight);
    }, 0.1);
  }

  sendMessage(message: string) {
    if (this.allMessages.length === 0) {
      this.insertNewConversation(message);
    } else {
      const oMessage = new NewMessage(
        this.selectedConversation.ConversationID,
        this.selectedConversation.ConversationParticipantID,
        message);
      this.app.api.insertMessage(oMessage).subscribe(
        this.populateControlWithMessages.bind(this),
        err => console.log(err),
        () => this.messageControl.reset());
    }
  }

  insertNewConversation(message: string) {
    const participants = [this.app.shared.storage.browsedUser.userId, this.currentUser.UserID];
    const conversationTitle = `${this.app.shared.storage.browsedUser.name}${this.currentUser.Name}`;
    const newConversation = new NewConversation(conversationTitle, participants, message);
    this.app.api.insertConversation(newConversation).subscribe(
      this.manageInsertNewConversation.bind(this),
      err => console.log(err)
    );
  }

  manageInsertNewConversation(res) {
    this.tempNewConversationID = res;
    this.app.api.getConversations(this.currentUser.UserID).subscribe(
      this.manageAllConversationsArray.bind(this),
      err => console.log(err),
    );
  }

  manageAllConversationsArray(res: ConversationResponse[]) {
    this.allConversations = res;
    this.fixConversationTitles();
    if (this.tempNewConversationID !== undefined) {
      const newInsertedConversation = this.allConversations.find(c =>
        c.ConversationID.toString() === this.tempNewConversationID.toString());
      this.selectConversation(newInsertedConversation);
    }
  }

  fixConversationTitles() {
    this.allConversations.forEach(c => {
      c.ConversationTitle = c.ConversationTitle.replace(this.currentUser.Name, '');
    });
  }
}
