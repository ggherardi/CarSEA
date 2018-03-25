import { Component, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClientModule } from '@angular/common/http/src/module';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {

    publicHttp: Http;
    JWToken: string;

    constructor(private http: Http) { }

    /** Ritorna un observable contenente i dati recuperati dal servizio tramite POST.
     * Il metodo utilizza l'header per le CORS e il JWT per poter utilizzare le API interne.
     * Effettuare il subscribe sul valore di return per utilizzare i dati */
    post = (serviceUrl, data: object): Observable<any[]> => {
        const options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'bearer ' + this.JWToken
            })
        });
        const querystringData = this.toQueryString(data);
        return this.http.post(serviceUrl, querystringData, options).map(r =>  r.json());
      }

    /** Ritorna un observable contenente i dati recuperati dal servizio tramite GET.
     * Il metodo utilizza l'header per le CORS e il JWT per poter utilizzare le API interne.
     * Effettuare il subscribe sul valore di return per utilizzare i dati */
    get = (url: string): Observable<any[]> => {
        const options = new RequestOptions({
            headers: new Headers({
                'Access-Control-Allow-Origin': 'http://www.progettostw.com',
                'Authorization': 'bearer ' + this.JWToken
            })
        });
        return this.http.get(url, options).map((res: Response) => res.json());
    }

    /** Ritorna un observable contenente i dati recuperati dal servizio tramite GET.
     * Il metodo non contiene headers per effettuare richieste verso l'esterno.
     * Effettuare il subscribe sul valore di return per utilizzare i dati */
    getExternal = (url: string): Observable<any[]> => {
        return this.http.get(url).map((res: Response) => res.json());
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
