import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Cookies {

    constructor() { }

    // Codifica il cookie in base64
    private encodeObject(object: any) {
        return btoa(JSON.stringify(object));
    }

    // Decodifica il cookie da base 64 a oggetto
    private decodeObject(encodedObject: string) {
        const objString = atob(encodedObject);
        return JSON.parse(objString);
    }

    // Restituisce i cookie come array di stringhe senza whitespaces
    private getAllCookiesAsArray() {
        const allCookies = document.cookie;
        return allCookies.replace(/\s/g, '').split(';');
    }

    // Setta il cookie codificato in base 64. Formato cookie: name=value; expires=expirationDate; path=selectedPath
    setEncodedCookie(cookieName: string, object: any, hours: number, path?: string) {
        const encodedObject = this.encodeObject(object);
        this.setCookie(cookieName, encodedObject, hours, path);
    }

    setCookie(cookieName: string, cookieValue: string, hours: number, path?: string) {
        const date = new Date();
        const daysInMilliseconds: number = hours * 60 * 60 * 1000;
        date.setTime(date.getTime() + daysInMilliseconds);
        const expirationString = date.toUTCString();
        let cookie = cookieName + '=' + cookieValue;
        cookie += '; expires=' + expirationString;
        cookie += '; path=' + path;
        document.cookie = cookie;
    }

    // Restituisce il cookie richiesto
    getCookie(cookieName: string) {
        const cookiesArray = this.getAllCookiesAsArray();
        const encodedCookie = cookiesArray.find(c => c.startsWith(cookieName));
        let cookie: any;
        if (encodedCookie !== undefined) {
            cookie = this.decodeObject(encodedCookie);
        }
        return cookie;
    }

    // Elimina il cookie dalla lista dei cookies
    disposeCookie(cookieName: string) {
        this.setCookie(cookieName, '', -1);
    }
}
