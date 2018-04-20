import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { Observable } from 'rxjs/Observable';
import { NewConversation, NewMessage, NewBooking, SearchFilters } from './models';
import { SharedComponent } from './shared';

enum EndPoint {
    Trips = 'php/TripService.php',
    Messages = 'php/MessageService.php'
}

@Injectable()
export class ApiService {
  constructor(private shared: SharedComponent, private http: HttpService) { }

  getTripsWithFilters(filters: SearchFilters): Observable<any[]> {
    const endpoint =  EndPoint.Trips;
    const stringifiedFilters = JSON.stringify(filters);
    const data = {
      action: 'getTrips',
      filters: stringifiedFilters
    };
    return this.shared.post(endpoint, data);
  }

  getTripsForUser(ownerID: number): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const data = {
      ownerID: ownerID,
      action: 'getTrips'
    };
    return this.shared.post(endpoint, data);
  }

  getConversations(userId: number): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const data = {
      userId: userId,
      action: 'getConversations'
    };
    return this.shared.post(endpoint, data);
  }

  insertConversation(newConversation: NewConversation): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const stringifiedNewConversation = JSON.stringify(newConversation);
    const data = {
      newConversation: stringifiedNewConversation,
      action: 'insertNewConversation'
    };
    return this.shared.post(endpoint, data);
  }

  getExistingConversations(senderId: number, receiverId: number): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const data = {
      senderId: senderId,
      receiverId: receiverId,
      action: 'getExistingConversation'
    };
    return this.shared.post(endpoint, data);
  }

  getMessages(conversationID: number): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const data = {
      conversationID: conversationID,
      action: 'getMessages'
    };
    return this.shared.post(endpoint, data);
  }

  insertMessage(message: NewMessage): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const stringifiedMessage = JSON.stringify(message);
    const data = {
      message: stringifiedMessage,
      action: 'insertNewMessage'
    };
    return this.shared.post(endpoint, data);
  }

  getExistingBooking(existingBooking: NewBooking): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const stringifiedExistingBooking = JSON.stringify(existingBooking);
    const data = {
      existingBooking: stringifiedExistingBooking,
      action: 'getExistingBooking'
    };
    return this.shared.post(endpoint, data);
  }

  getBookingsForUser(userId: number): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const data = {
      userId: userId,
      action: 'getBookingsForUser'
    };
    return this.shared.post(endpoint, data);
  }

  getBookingsForTrip(tripId: number): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const data = {
      tripId: tripId,
      action: 'getBookingsForTrip'
    };
    return this.shared.post(endpoint, data);
  }

  insertBooking(newBooking: NewBooking): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const stringifiedNewBooking = JSON.stringify(newBooking);
    const data = {
      newBooking: stringifiedNewBooking,
      action: 'insertBooking'
    };
    return this.shared.post(endpoint, data);
  }
}
