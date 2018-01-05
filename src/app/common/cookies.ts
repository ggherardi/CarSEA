import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Cookies {

    constructor() { }

    setCookie(object: any, expirationDate: Date) {
        document.cookie = '';
    }
}
