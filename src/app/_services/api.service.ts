import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { Observable } from 'rxjs/Observable';
import { NewConversation } from './models';
import { SharedComponent } from './shared';

@Injectable()
export class ApiService {

  // SPOSTARE CLASSE PER UTILIZZARE METODI HTTP CON HEADER CORRETTI
  constructor(private shared: SharedComponent, private http: HttpService) { }

  getConversations(userId: number): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const data = {
      userId: userId,
      action: 'getConversations'
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

  insertConversation(newConversation: NewConversation): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const stringifiedNewConversation = JSON.stringify(newConversation);
    const data = {
      newConversation: stringifiedNewConversation,
      action: 'insertNewConversation'
    };
    return this.shared.post(serviceUrl, data);
  }
}
