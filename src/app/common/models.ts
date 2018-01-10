import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Models {
    userModel = UserModel;
    constructor() { }
}

class UserModel {
    UserID: string;
    Name: string;
    UserName: string;

    constructor() { }
}
