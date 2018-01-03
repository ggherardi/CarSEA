import { Component, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-phpservicecomponent',
    template: '',
    styles: ['']
 })

@Injectable()
export class PhpServiceComponent {

    constructor(private http: Http) { }

    getResponse(url: string) {
        return this.http.get(url).map((res: Response) => {
            return res.json();
        });
    }

    postResponse(url: string, data: any) {
        return jQuery.ajax({
            url: '/php/Authentication.php',
            data: data,
            method: 'post',
            // success: this.LoginSuccess,
            // error: this.LoginFailure
        });
    }

    private LoginSuccess(data: any) {
        console.log(data);
        return data;
      }

    private LoginFailure(data: any) {
        console.log(data.statusText);
        return data;
    }
}
