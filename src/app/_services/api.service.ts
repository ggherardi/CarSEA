import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { Observable } from 'rxjs/Observable';
import { NewConversation, NewMessage, NewBooking } from './models';
import { SharedComponent } from './shared';

@Injectable()
export class ApiService {

  constructor(private shared: SharedComponent, private http: HttpService) { }

  getConversations(userId: number): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const data = {
      userId: userId,
      action: 'getConversations'
    };
    return this.shared.post(serviceUrl, data);
  }

  insertConversation(newConversation: NewConversation): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const stringifiedNewConversation = JSON.stringify(newConversation);
    const data = {
      newConversation: stringifiedNewConversation,
      action: 'insertNewConversation'
    };
    return this.shared.post(serviceUrl, data);
  }

  getExistingConversations(senderId: number, receiverId: number): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const data = {
      senderId: senderId,
      receiverId: receiverId,
      action: 'getExistingConversation'
    };
    return this.shared.post(serviceUrl, data);
  }

  getMessages(conversationID: number): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const data = {
      conversationID: conversationID,
      action: 'getMessages'
    };
    return this.shared.post(serviceUrl, data);
  }

  insertMessage(message: NewMessage): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const stringifiedMessage = JSON.stringify(message);
    const data = {
      message: stringifiedMessage,
      action: 'insertNewMessage'
    };
    return this.shared.post(serviceUrl, data);
  }

  getExistingBooking(existingBooking: NewBooking): Observable<any[]> {
    const serviceUrl = 'php/TripService.php';
    const stringifiedExistingBooking = JSON.stringify(existingBooking);
    const data = {
      existingBooking: stringifiedExistingBooking,
      action: 'getExistingBooking'
    };
    return this.shared.post(serviceUrl, data);
  }

  insertBooking(newBooking: NewBooking): Observable<any[]> {
    const serviceUrl = 'php/TripService.php';
    const stringifiedNewBooking = JSON.stringify(newBooking);
    const data = {
      newBooking: stringifiedNewBooking,
      action: 'insertBooking'
    };
    return this.shared.post(serviceUrl, data);
  }
}
