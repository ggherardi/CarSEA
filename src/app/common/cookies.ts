import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Cookies {

    constructor() { }

    encodeObject(object: any) {
        let b = '';
        for (const prop of Object.keys(object)) {
            b += prop + '=' + object[prop];
            b += '|';
        }
        b = b.substring(0, b.lastIndexOf('|'));
        console.log(b);
        return btoa(b);
    }

    setCookie(cookieName: string, valueAsObject: any, hours: number, path?: string) {
        const date = new Date();
        const daysInMilliseconds: number = hours * 60 * 60 * 1000;
        date.setTime(date.getTime() + daysInMilliseconds);
        const expirationString = date.toUTCString();
        const encodedObject = this.encodeObject(valueAsObject);
        let cookie = cookieName + '=' + encodedObject;
        cookie += '; expires=' + expirationString;
        cookie += '; path=' + path;
        document.cookie = cookie;
    }

    getCookie() {

    }
}
