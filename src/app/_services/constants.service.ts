import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  alphabet: String[] = 'abcdefghilmnopqrstuvz'.toUpperCase().split('');

  constructor() { }

}
