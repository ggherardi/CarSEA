import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Models {
    userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    disposeUserModel() {
        this.userModel = new UserModel();
    }
}

class UserModel {
    UserID: string;
    Name: string;
    username: string;

    constructor() { }
}
