import { Injectable } from '@angular/core';
import { UserDetail, UserModel } from './models';

@Injectable()
export class StorageService {
  public currentUserID: number;
  public browsedUserID: number;
  public browsedUser: UserDetail;
  public browsedTripID: number;

  public newConversation: Boolean;
  constructor() { }

}
