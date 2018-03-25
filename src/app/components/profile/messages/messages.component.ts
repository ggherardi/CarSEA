import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { UserModel, Conversation } from '../../../_services/models';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messageControl = new FormControl('', [Validators.required]);

  allConversations: Conversation[] = [];
  conversation: Conversation;
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
    this.app.shared.api.getConversations(this.currentUser.UserID).subscribe(
      succ => console.log(succ),
      err => console.log(err)
    );
  }

  private prepareMessageForBrowsedUser() {
    this.allConversations.push(new Conversation('0', this.app.shared.storage.browsedUser.name, '0'));
  }

  selectConversation(conversation: Conversation) {
    console.log(conversation.ConversationTitle);
  }

  sendMessage(control: FormControl) {
    console.log(control.value);
  }
}
