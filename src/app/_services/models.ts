import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { LatLng, LatLngBounds } from '@agm/core/services/google-maps-types';

// Classe singleton per i vari modelli, incluso l'utente
@Injectable()
export class Models {
    userModel: UserModel;
    newTrip: Trip;
    allMarkers: Map[];
    polyArray: LatLng[];
    bounds: LatLngBounds;

    constructor() {
        this.userModel = new UserModel();
    }

    disposeUserModel() {
        this.userModel = new UserModel();
    }
}

export class UserModel {
    UserID: number;
    Name: string;
    Username: string;
    Token: string;

    constructor() { }
}

export class UserDetail {
    userId: number;
    name: string;
    surname: string;
    email: string;
    age: string;
    description: string;
    car: number;

    constructor(userId: number, name: string, surname: string, email: string,
                age: string, description: string, car: number) {
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.age = age;
        this.description = description;
        this.car = car;
    }
}

export class UserDetailResponse {
    userId: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    age: string;
    description: string;
    photo_folder: string;
    car_id: string;
    make: string;
    model: string;
    year: string;
}

export class CarDetail {
    id: string;
    year: string;
    make: string;
    model: string;

    constructor(id: string, year: string, make: string, model: string) {
        this.id = id;
        this.year = year;
        this.make = make;
        this.model = model;
    }
}

export class City {
    id: number;
    value: string;
    id_regione: number;
    id_provincia: number;
    latitudine: number;
    longitudine: number;

    constructor() { }
}

export class Map {
lat: number;
lng: number;

constructor(lat: number, lgn: number) {
    this.lat = lat;
    this.lng = lgn;
    }
}

/** Modello per i dati da inviare al servizio SaveNewTrip */
export class Trip {
    ownerId: number;
    id: number;
    departureCity: number;
    arrivalCity: number;
    waypoints: number[];
    departureDate: string;
    price: number;
    seats: number;
    tripDescription: string;
    duration: number;
    distance: number;

    constructor(departureCity: number, arrivalCity: number, waypoints: number[],
                duration: number, distance: number, departureDate: string,
                tripDescription?: string) {
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.waypoints = waypoints;
        this.duration = duration;
        this.distance = distance;
        this.departureDate = departureDate;
    }
}

/** Modello per la response del servizio GetTrips */
export class TripResponse extends Trip {
    departureCityName: string;
    arrivalCityName: string;
    ownerName: string;
    tripId: number;
    allWaypoints: TripResponse[];
    waypointCityName: string;
    waypointId: number;

    constructor(duration, distance, departureDate, departureCityName, arrivalCityName,
                ownerName, tripId, allWaypoints, waypointCityName, waypointId) {
        super(0, 0, [], duration, distance, departureDate, '');
        this.departureCityName = departureCityName;
        this.arrivalCityName = arrivalCityName;
        this.ownerName = ownerName;
        this.ownerId = this.ownerId;
        this.tripId = tripId;
        this.allWaypoints = allWaypoints;
        this.waypointCityName = waypointCityName;
        this.waypointId = waypointId;
    }
}

/** Modelli per la gestione delle prenotazioni */
export class NewBooking {
    userId: number;
    tripId: number;

    constructor(userId: number, tripId: number) {
        this.userId = userId;
        this.tripId = tripId;
    }
}

export class BookingResponse {
    bookingId: number;
    userId: number;
    tripId: number;
    bookingStatus: string;

    constructor(bookingId, userId, tripId, bookingStatus) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.tripId = tripId;
        this.bookingStatus = bookingStatus;
    }
}

/** Modello per i filtri di ricerca dei Trip */
export class SearchFilters {
    departureCity: number;
    arrivalCity: number;
    price: number;
    dateStart: string;
    dateEnd: string;

    constructor(departureCity: number, arrivalCity: number, price: number,
                dateStart: string, dateEnd: string) {
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.price = price;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
    }
}

/* Modelli componente messages */
export class ConversationResponse {
    ConversationID: number;
    ConversationTitle: string;
    ConversationParticipantID: number;
    Active: boolean;

    constructor(conversationID: number, conversationTitle: string, conversationParticipantID: number) {
        this.ConversationID = conversationID;
        this.ConversationTitle = conversationTitle;
        this.ConversationParticipantID = conversationParticipantID;
    }
}

export class ConversationMessageResponse {
    ConversationMessageID: number;
    ConversationMessage: string;
    ConversationTimestamp: string;
    ConversationID: number;
    ConversationParticipantID: number;

    constructor(conversationMessageID: number, conversationMessage: string, conversationTimestamp: string,
                conversationID: number, conversationParticipantID: number) {
        this.ConversationMessageID = conversationMessageID;
        this.ConversationMessage = conversationMessage;
        this.ConversationTimestamp = conversationTimestamp;
        this.ConversationID = conversationID;
        this.ConversationParticipantID = conversationParticipantID;
    }
}

export class NewConversation {
    Title: string;
    Participants: number[];
    Message: string;

    constructor(title: string, participants: number[], message: string) {
        this.Title = title;
        this.Participants = participants;
        this.Message = message;
    }
}

export class NewMessage {
    ConversationID: number;
    ConversationParticipantID: number;
    ConversationMessage: string;

    constructor(conversationID: number, conversationParticipantID: number, conversationMessage: string) {
        this.ConversationID = conversationID;
        this.ConversationParticipantID = conversationParticipantID;
        this.ConversationMessage = conversationMessage;
    }
}
