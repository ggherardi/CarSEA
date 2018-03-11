import { FormGroup } from '@angular/forms';

export class UtilitiesService {
    isMobile: boolean;
    specialCharPattern: RegExp = /^[a-zA-Z0-9]{4,10}$/;

    constructor() { }

    init() {
        this.isMobileDevice();
    }

    private isMobileDevice() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}

/** Classe di appoggio per effettuare operazioni più avanzate sugli array. */
export class List<T> extends Array<T> {
  private constructor (items?: Array<T>) {
      super(...items);
  }

  /** Istanzia la classe List. La factory è necessaria in quanto a runtime JavaScript
   * crea di default un array, anziché istanziare l'oggetto custom. */
  static create<T>(): List<T> {
      return Object.create(List.prototype);
  }

  static createFromArray<T>(sourceArray: any[]): List<T> {
    const list = Object.create(List.prototype);
    sourceArray.forEach(a => list.push(a));
    return list;
  }

  /** Effettua una copia per valore dell'array. */
  copy (): List<T> {
      const returnList: List<T> = List.create<T>();
      for (let i = 0; i < this.length; i++) {
          returnList.push(this[i]);
      }
      return returnList;
  }

  /** Rimuove tutti gli elementi che soddisfano la callback passata come argomento. */
  remove (callbackfn: (value: T) => boolean) {
      let i = 0;
      while (i < this.length) {
          if (callbackfn(this[i])) {
              this.splice(i, 1);
          } else {
              i++;
          }
      }
  }
}
