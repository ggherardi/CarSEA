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
    username: string;
    Token: string;

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
    departureDate: string;
    price: number;
    seats: number;
    description: string;
    duration: number;
    distance: number;

    constructor(departureCity: number, arrivalCity: number, stopoverCity1: number,
                stopoverCity2: number, stopoverCity3: number, stopoverCity4: number,
                duration: number, distance: number, departureDate: string) {
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.stopoverCity1 = stopoverCity1;
        this.stopoverCity2 = stopoverCity2;
        this.stopoverCity3 = stopoverCity3;
        this.stopoverCity4 = stopoverCity4;
        this.duration = duration;
        this.distance = distance;
        this.departureDate = departureDate;
    }
}

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
