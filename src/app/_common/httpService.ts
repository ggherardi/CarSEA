import { Component, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClientModule } from '@angular/common/http/src/module';

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

    /** Effettua una XmlHttpRequest con metodo POST tramite jQuery per ottenere i dati dal servizio PHP specificato nell'url
    componentCallBack viene utilizzata per eseguire azioni sul componente che ha chiamato il servizio (se specificate) */
    postResponse(url: string, data: any, callback: any = function(){}, componentCallBack: any = function(){}) {
        return jQuery.ajax({
            async: false,
            url: url,
            data: data,
            method: 'post',
            success: function(res) {
                callback(res);
                componentCallBack(res);
            },
            error: function(err) {
                console.log('Errore:' + err);
            }
        });
    }

    /** Formatta l'oggetto in formato querstring (key=value&key2=value2). Non è ricorsivo. */
    toQueryString(obj: any): string {
        const str = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return str.join('&');
    }
}
