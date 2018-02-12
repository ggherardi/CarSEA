import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

// Classe singleton per i vari modelli, incluso l'utente
@Injectable()
export class Models {
    userModel: UserModel;
    newTrip: Trip;
    allMarkers: Map[];

    constructor() {
        this.userModel = new UserModel();
        // this.newTrip = new Trip()
    }

    disposeUserModel() {
        this.userModel = new UserModel();
    }
}

export class UserModel {
    UserID: string;
    Name: string;
    username: string;

    constructor() { }
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

export class Trip {
    ownerId: number;
    id: number;
    departureCity: number;
    arrivalCity: number;
    stopoverCity1: number;
    stopoverCity2: number;
    stopoverCity3: number;
    stopoverCity4: number;
    encodedWaypoints: string;
    departureDate: Date;
    price: number;
    seats: number;

    constructor(ownerId: number = 0, departureCity: number = 0, arrivalCity: number = 0,
                stopoverCity1: number = 0, encodedWaypoints: string = '',
                departureDate: Date = new Date(), price: number = 0, seats: number = 0) {
        this.ownerId = ownerId;
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.stopoverCity1 = stopoverCity1;
        this.encodedWaypoints = encodedWaypoints;
        this.departureDate = departureDate;
        this.price = price;
        this.seats = seats;
    }
}
