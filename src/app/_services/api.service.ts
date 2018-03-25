import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService {

  constructor(private http: HttpService) { }

  getConversations(userId: number): Observable<any[]> {
    const serviceUrl = 'php/MessageService.php';
    const data = {
      userId: userId,
      action: 'getConversations'
    };
    return this.http.post(serviceUrl, data);
  }
}
