import { Injectable } from '@angular/core';
import { UserDetail, UserModel, SearchFilters } from './models';

@Injectable()
export class StorageService {
  public currentUserID: number;
  public browsedUserID: number;
  public browsedUser: UserDetail;
  public browsedTripID: number;
  public searchFilters: SearchFilters;

  public newConversation: Boolean;
  constructor() { }

}
