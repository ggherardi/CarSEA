import { Injectable } from '@angular/core';
import { UserDetail } from './models';

@Injectable()
export class StorageService {
  public browsedUserID: number;
  public browsedTripID: number;
  constructor() { }

}
