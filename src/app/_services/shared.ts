import { Component, OnInit, Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from './httpService';
import { Models, UserModel } from './models';
import { Cookies } from './cookies';
import { GooglemapsService } from './googlemaps.service';
import { ConstantsService } from './constants.service';
import { Observable } from 'rxjs/Observable';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from './utilities.service';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';

@Component({ })

@Injectable()
export class SharedComponent implements OnInit {
  profileCookieDuration = 5;
  userLogged = false;

  constructor(public router: Router, public httpService: HttpService, public models: Models,
              public cookies: Cookies, public googleMapsService: GooglemapsService,
              public constantsService: ConstantsService, public modalService: NgbModal,
              public utilities: UtilitiesService, public storage: StorageService) { }

  ngOnInit() { }

  /** Metodo proxy per chiamare la POST nell'HttpService rivolta alle API interne che
   * necessitano dell'autenticazione tramite il JWT. */
  post = (serviceUrl, data: object): Observable<any[]> => {
    const token = this.getToken();
    return this.httpService.post(serviceUrl, data, token);
  }

  /** Metodo proxy per chiamare la GET nell'HttpService rivolta alle API interne che
  * necessitano dell'autenticazione tramite il JWT. */
  get = (url: string): Observable<any[]> => {
    const token = this.getToken();
    return this.httpService.get(url, token);
  }

  /** Effettua il login con l'username e la password passati argomenti, dopodiché richiama
   * il metodo che effettua il set dei cookie sul client. Infine esegue la callback passata
   * come ultimo argomento */
  login(username: string, password: string, callback: any = function(a){}): void {
    const data = {
      action: 'login',
      username: username,
      password: password
    };
    this.post('php/AuthenticationService.php', data)
        .subscribe(this.setAuthCookiesCallBack.bind(this), err => console.log(err), callback);
    }

  private setAuthCookiesCallBack(data) {
    if (data >= 1000) {
      alert(`Errore durante la connessione al database: ${data}`);
      return;
    }
    if (data === -1) {
      alert('Attenzione, le credenziali inserite non sono corrette!');
    } else {
      this.cookies.setEncodedCookie(this.cookies.USER_COOKIE_NAME, data, this.profileCookieDuration);
      this.loadSession();
    }
  }

  /** Effettua il logout e riporta l'utente alla home */
  logout() {
    this.cookies.disposeCookie(this.cookies.USER_COOKIE_NAME);
    this.userLogged = false;
    this.models.disposeUserModel();
    this.httpService.JWToken = '';
    this.router.navigateByUrl('/');
  }

  /** Effettua il redirect alla home nel caso l'utente non sia loggato */
  redirectIfNotLogged() {
    const userObj: UserModel = this.getCurrentUser();
    if (userObj === undefined) {
      this.router.navigateByUrl('');
    }
  }

  /** Naviga all'url passato come argomento unicamente se l'utente è loggato */
  navigateIfLogged(url: string): boolean {
    const userObj: UserModel = this.getCurrentUser();
    if (userObj !== undefined) {
      this.storage.currentUserID = userObj.UserID;
      this.router.navigateByUrl(url);
    } else {
      return false;
    }
    return true;
  }

  /** Recupera l'utente corrente */
  getCurrentUser(): UserModel {
    return this.cookies.getObjectFromCookie(this.cookies.USER_COOKIE_NAME);
  }

  /** Carica la sessione dal cookie */
  loadSession() {
    const storedUserDetails = this.cookies.getObjectFromCookie(this.cookies.USER_COOKIE_NAME);
    if (storedUserDetails !== undefined) {
      this.models.userModel = storedUserDetails;
      this.userLogged = true;
    }
  }

  /** Recupera il Token dal cookie */
  getToken(): string {
    let token = '';
    const userCookie: UserModel = this.cookies.getObjectFromCookie(this.cookies.USER_COOKIE_NAME);
    if (userCookie !== undefined) {
      this.cookies.refreshCookie();
      token = userCookie.Token;
    }
    return token;
  }

  /** Recupera i dettagli dell'utente */
  loadUserDetails(userId: number): Observable<any> {
    const data = {
      action: 'retrieveDetails',
      userId: userId
    };
    return this.post('php/PeopleDetailService.php', data);
  }

  /** Apre il modal specificato nel content passato come argomento */
  openModal(content): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService.open(content);
    modalRef.result.then((result) => {
      const closeResult = `Closed with: ${result}`;
    }, (reason) => {
      const closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    return modalRef;
  }

  /** Chiude il modal specificato nel content passato come argomento */
  closeModal(content: NgbModalRef) {
    content.close();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  /** Formatta la data in modo corretto per essere utilizzata nel DB */
  formatDate(date: any, time: any): string {
    const month = date.month < 10 ? `0${date.month}` : date.month;
    const day = date.day < 10 ? `0${date.day}` : date.day;
    time = time >= 10 ? time : (`0${time}`).slice(0, 2);
    return `${date.year}-${month}-${day} ${time}:00`;
  }
}
