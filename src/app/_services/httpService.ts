import { Component, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClientModule } from '@angular/common/http/src/module';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {

    publicHttp: Http;

    constructor(private http: Http) {
    }

    /** Ritorna un observable contenente i dati recuperati dal servizio tramite POST.
     * Effettuare il subscribe sul valore di return per utilizzare i dati */
    post = (serviceUrl, data: object): Observable<any[]> => {
        const options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
        const querystringData = this.toQueryString(data);
        return this.http.post(serviceUrl, querystringData, options).map(r =>  r.json());
      }

    /** Ritorna un observable contenente i dati recuperati dal servizio tramite GET.
     * Effettuare il subscribe sul valore di return per utilizzare i dati */
    get = (url: string): Observable<any[]> => {
        const options = new RequestOptions({
            headers: new Headers({
                'Access-Control-Allow-Origin': 'http://www.progettostw.com'
            })
        });
        return this.http.get(url, options).map((res: Response) => {
            return res.json();
        });
    }

    /** Effettua una XmlHttpRequest con metodo POST tramite jQuery per ottenere i dati dal servizio PHP specificato nell'url.
     * le due callback vengono utilizzate per eseguire azioni sul componente che ha chiamato il servizio (se specificate) */
    postAjax(url: string, data: any, callback: any = function(){}, componentCallBack: any = function(){}) {
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
