import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { Observable } from 'rxjs/Observable';
import { NewConversation, NewMessage, NewBooking, SearchFilters, BookingStatus, BookingResponse } from './models';
import { SharedComponent } from './shared';

enum EndPoint {
    Trips = 'php/TripService.php',
    Messages = 'php/MessageService.php',
    Statistics = 'php/StatisticService.php'
}

@Injectable()
export class ApiService {
  constructor(private shared: SharedComponent, private http: HttpService) { }

  /** Recupera i Passaggi che rientrane nei filtri passati */
  getTripsWithFilters(filters: SearchFilters): Observable<any[]> {
    const endpoint =  EndPoint.Trips;
    const stringifiedFilters = JSON.stringify(filters);
    const data = {
      action: 'getTrips',
      filters: stringifiedFilters
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera i Passaggi offerti dello user con l'ID passato come argomento */
  getTripsForUser(ownerID: number): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const data = {
      ownerID: ownerID,
      action: 'getTrips'
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera tutte le conversazioni dello user con l'ID passato come argomento */
  getConversations(userId: number): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const data = {
      userId: userId,
      action: 'getConversations'
    };
    return this.shared.post(endpoint, data);
  }

  /** Inserisce una nuova conversazione nel DB */
  insertConversation(newConversation: NewConversation): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const stringifiedNewConversation = JSON.stringify(newConversation);
    const data = {
      newConversation: stringifiedNewConversation,
      action: 'insertNewConversation'
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera, se esiste, la conversazione tra due utenti */
  getExistingConversations(senderId: number, receiverId: number): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const data = {
      senderId: senderId,
      receiverId: receiverId,
      action: 'getExistingConversation'
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera tutti i messaggi per la conversazione con l'ID passato come argomenti */
  getMessages(conversationID: number): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const data = {
      conversationID: conversationID,
      action: 'getMessages'
    };
    return this.shared.post(endpoint, data);
  }

  /** Inserisce un nuovo messaggio nel DB */
  insertMessage(message: NewMessage): Observable<any[]> {
    const endpoint = EndPoint.Messages;
    const stringifiedMessage = JSON.stringify(message);
    const data = {
      message: stringifiedMessage,
      action: 'insertNewMessage'
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera la prenotazione specificata dal DB */
  getExistingBooking(existingBooking: NewBooking): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const stringifiedExistingBooking = JSON.stringify(existingBooking);
    const data = {
      existingBooking: stringifiedExistingBooking,
      action: 'getExistingBooking'
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera tutte le prenotazioni per lo user con l'ID passato come argomento */
  getBookingsForUser(userId: number): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const data = {
      userId: userId,
      action: 'getBookingsForUser'
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera tutte le prenotazioni con il Passaggio con l'ID passato come argomento */
  getBookingsForTrip(tripId: number): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const data = {
      tripId: tripId,
      action: 'getBookingsForTrip'
    };
    return this.shared.post(endpoint, data);
  }

  /** Inserisce una nuova prenotazione nel DB */
  insertBooking(newBooking: NewBooking): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const stringifiedNewBooking = JSON.stringify(newBooking);
    const data = {
      newBooking: stringifiedNewBooking,
      action: 'insertBooking'
    };
    return this.shared.post(endpoint, data);
  }

  /** Cambia lo stato della prenotazione passata come argomento */
  setBookingStatus(booking: BookingResponse, bookingStatus: BookingStatus): Observable<any[]> {
    const endpoint = EndPoint.Trips;
    const data = {
      tripId: booking.tripId,
      bookingId: booking.bookingId,
      bookingStatus: bookingStatus,
      action: 'setBookingStatus'
    };
    return this.shared.post(endpoint, data);
  }

  /** Recupera i viaggi più frequenti dal DB */
  getMostFrequentTrips() {
    const endpoint = EndPoint.Statistics;
    const data = {
      action: 'getMostFrequentTrips'
    };
    return this.shared.post(endpoint, data);
  }
}
