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
    waypoints: number[];
    departureDate: string;
    price: number;
    seats: number;
    description: string;
    duration: number;
    distance: number;

    constructor(departureCity: number, arrivalCity: number, waypoints: number[],
                duration: number, distance: number, departureDate: string) {
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.waypoints = waypoints;
        this.duration = duration;
        this.distance = distance;
        this.departureDate = departureDate;
    }
}

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
        super(0, 0, [], duration, distance, departureDate);
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
