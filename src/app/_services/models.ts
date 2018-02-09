import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

// Classe singleton per i vari modelli, incluso l'utente
@Injectable()
export class Models {
    userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
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

    constructor(lat, lgn) {
      this.lat = lat;
      this.lng = lgn;
    }
  }
