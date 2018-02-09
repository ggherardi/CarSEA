import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { City, Map } from './models';
declare var google;

@Injectable()
export class GooglemapsService {

  constructor(private mapsApiLoader: MapsAPILoader) { }

  /** Ritorna nel metodo di callback il percorso selezionato tramite origine e destinazione */
  retrieveRoute(originCoordinates: Map, destinationCoordinates: Map, callback) {
    this.mapsApiLoader.load().then(() => {
      const origin = new google.maps.LatLng(originCoordinates.lat, originCoordinates.lng);
      const destination = new google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng);
      const directions = new google.maps.DirectionsService();
      directions.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING',
        avoidHighways: false,
        avoidTolls: false,
      }, callback);
    });
  }

  /** Recupera l'array di polylines necessario per disegnare sulla mappa un percorso
   * più armonioso (seguendo la strada anziché in linea retta) */
  getPolylinesArray(overview_polyline: string) {
    return new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(overview_polyline)
    });
  }
}