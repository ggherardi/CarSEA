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
        /* L'unico modello da inizializzare è newTrip, gli altri sono da eliminare. */
        this.newTrip = JSON.parse('{"ownerId":0,"departureCity":{"id":"8569","id_regione":"3","id_provincia":"15","value":"Milano","latitudine":"45.458626","longitudine":"9.181873"},"arrivalCity":{"id":"8579","id_regione":"19","id_provincia":"82","value":"Palermo","latitudine":"38.115621","longitudine":"13.361318"},"stopoverCity1":{"id":"8611","id_regione":"6","id_provincia":"32","value":"Trieste","latitudine":"45.689482","longitudine":"13.783307"},"encodedWaypoints":"","departureDate":"2018-02-25 10:20","price":0,"seats":0,"stopoverCity2":{"id":"8547","id_regione":"9","id_provincia":"48","value":"Firenze","latitudine":"43.767918","longitudine":"11.252379"},"stopoverCity3":{"id":"8572","id_regione":"15","id_provincia":"63","value":"Napoli","latitudine":"40.901975","longitudine":"14.332644"},"stopoverCity4":{"id":"8521","id_regione":"16","id_provincia":"72","value":"Bari","latitudine":"41.117123","longitudine":"16.871976"}}');
        this.allMarkers = JSON.parse('[{"lat":45.458626,"lng":9.181873,"id":"8569","index":null},{"lat":45.689482,"lng":13.783307,"id":"8611","index":0},{"lat":43.767918,"lng":11.252379,"id":"8547","index":1},{"lat":40.901975,"lng":14.332644,"id":"8572","index":2},{"lat":41.117123,"lng":16.871976,"id":"8521","index":3},{"lat":38.115621,"lng":13.361318,"id":"8579","index":null}]');
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
    departureDate: Date;
    price: number;
    seats: number;
    description: string;

    constructor(ownerId: number = 0, departureCity: number = 0, arrivalCity: number = 0,
                stopoverCity1: number = 0, encodedWaypoints: string = '',
                departureDate: Date = new Date(), price: number = 0, seats: number = 0) {
        this.ownerId = ownerId;
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.stopoverCity1 = stopoverCity1;
        this.departureDate = departureDate;
        this.price = price;
        this.seats = seats;
    }
}
