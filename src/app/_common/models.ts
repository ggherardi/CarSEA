import { Component, Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Models {
    userModel: UserModel;

    constructor() { }

    dispose(model: ICarSeaModel) {
        model.dispose();
    }
}

interface ICarSeaModel {
    dispose();
}

export class UserModel implements ICarSeaModel {
    UserID: string;
    Name: string;
    UserName: string;

    constructor() { }

    dispose() {
        this.UserID = '';
        this.Name = '';
        this.UserName = '';
    }
}
