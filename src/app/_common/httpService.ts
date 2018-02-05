import { Component, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

    publicHttp: Http;

    constructor(private http: Http) {

    }

    getResponse(url: string) {
        return this.http.get(url).map((res: Response) => {
            return res.json();
        });
    }

    // Effettua una XmlHttpRequest con metodo POST tramite jQuery per ottenere i dati dal servizio PHP specificato nell'url
    // componentCallBack viene utilizzata per eseguire azioni sul componente che ha chiamato il servizio (se specificate)
    postResponse(url: string, data: any, callback: any, componentCallBack: any = function(){}) {
        return jQuery.ajax({
            async: false,
            url: url,
            data: data,
            method: 'post',
            success: function(res) {
                callback(res);
                componentCallBack(res);
            }
        });
    }
}
