import { Injectable } from '@angular/core';
import { UserDetail } from './models';

@Injectable()
export class StorageService {
  public currentUserID: number;
  public browsedUserID: number;
  public browsedTripID: number;
  constructor() { }

}
