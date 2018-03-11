import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Cookies {

    USER_COOKIE_NAME = 'user';

    constructor() { }

    // Codifica il cookie in base64
    private encodeObject(object: any) {
        return btoa(JSON.stringify(object));
    }

    // Decodifica il cookie da base64
    private decodeObject(encodedObject: string) {
        const objString = atob(encodedObject);
        return JSON.parse(objString);
    }

    // Restituisce i cookie come array di stringhe senza whitespaces
    private getAllCookiesAsArray() {
        const allCookies = document.cookie;
        return allCookies.replace(/\s/g, '').split(';');
    }

    // Restituisce il cookie richiesto
    private getCookie(cookieName: string): string {
        const cookiesArray = this.getAllCookiesAsArray();
        return cookiesArray.find(c => c.startsWith(cookieName));
    }

    // Setta il cookie codificato in base 64
    setEncodedCookie(cookieName: string, object: any, hours: number, path?: string) {
        const encodedObject = this.encodeObject(object);
        this.setCookie(cookieName, encodedObject, hours, path);
    }

    // Setta il cookie. Formato cookie: name=value; expires=expirationDate; path=selectedPath
    setCookie(cookieName: string, cookieValue: string, hours: number, path?: string) {
        const date = new Date();
        const daysInMilliseconds: number = hours * 60 * 60 * 1000;
        date.setTime(date.getTime() + daysInMilliseconds);
        const expirationString = date.toUTCString();
        let cookie = cookieName + '=' + cookieValue;
        cookie += '; expires=' + expirationString;
        cookie += path ? '; path=' + path : '';
        document.cookie = cookie;
    }

    // Restituisce l'oggetto immagazzinato nel cookie
    getObjectFromCookie(cookieName: string): any {
        let encodedCookie = this.getCookie(cookieName);
        let object: any;
        if (encodedCookie !== undefined) {
            encodedCookie = encodedCookie.split('=')[1];
            object = this.decodeObject(encodedCookie);
        }
        return object;
    }

    // Estende la durata del cookie
    refreshCookie() {
        const data = this.getObjectFromCookie(this.USER_COOKIE_NAME);
        this.setEncodedCookie(this.USER_COOKIE_NAME, data, 0.5);
    }

    // Elimina il cookie dalla lista dei cookies
    disposeCookie(cookieName: string) {
        this.setCookie(cookieName, '', -1);
    }
}
