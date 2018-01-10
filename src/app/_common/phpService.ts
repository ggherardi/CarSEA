import { Component, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PHPService {

    constructor(private http: Http) {

    }

    getResponse(url: string) {
        return this.http.get(url).map((res: Response) => {
            return res.json();
        });
    }

    postResponse(url: string, data: any, callback) {
        return jQuery.ajax({
            url: '/php/Authentication.php',
            data: data,
            method: 'post',
            success: callback
        });
    }
}
