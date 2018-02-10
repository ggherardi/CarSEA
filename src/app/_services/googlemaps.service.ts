import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { City, Map } from './models';
import { Polyline, LatLng, LatLngBounds } from '@agm/core/services/google-maps-types';
declare var google;

@Injectable()
export class GooglemapsService {

  constructor(private mapsApiLoader: MapsAPILoader) { }

  /** Ritorna nel metodo di callback il percorso selezionato tramite origine e destinazione */
  retrieveRoute(originCoordinates: Map, destinationCoordinates: Map, callback, waypointsArray: Map[]) {
    // this.mapsApiLoader.load().then(() => {
      const origin = new google.maps.LatLng(originCoordinates.lat, originCoordinates.lng);
      const destination = new google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng);
      const directionWaypointArray = this.createLatLngWaypointsArray(waypointsArray.slice());
      const directions = new google.maps.DirectionsService();
      directions.route({
        origin: origin,
        destination: destination,
        waypoints: directionWaypointArray,
        travelMode: 'DRIVING',
        avoidHighways: false,
        avoidTolls: false,
      }, callback);
    // });
  }

  private createLatLngWaypointsArray(waypointsArray: Map[]): DirectionWaypoint[] {
    waypointsArray.shift();
    waypointsArray.pop();
    const directionWayPointArray: DirectionWaypoint[] = [];
    if (waypointsArray.length !== 0) {
      waypointsArray.forEach(w => {
        const directionWaypoint = new DirectionWaypoint(new google.maps.LatLng(w.lat, w.lng), true);
        directionWayPointArray.push(directionWaypoint);
      });
    }
    return directionWayPointArray;
  }

  /** Recupera l'array di polylines necessario per disegnare sulla mappa un percorso
   * più armonioso (seguendo la strada anziché in linea retta) */
  getPolylinesArray(overview_polyline: string): any[] {
    const polyLineArray: Polyline = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(overview_polyline)
    });
    const path: LatLng[] = polyLineArray.getPath();
    const poly: LatLng[] = [];
    path.forEach(p => {
      poly.push(new google.maps.LatLng(p.lat(), p.lng()));
    });
    // path
    return poly;
  }

  getLatLng(lat: number, lng: number) {
    return new google.maps.LatLng(lat, lng);
  }

  getBounds(latLngStart: LatLng, latLngEnd: LatLng): LatLngBounds {
    return new google.maps.LatLngBounds(latLngStart, latLngEnd);
  }
}

class DirectionWaypoint {
  location: LatLng;
  stopover: Boolean;

  constructor(location: LatLng, stopover: Boolean) {
    this.location = location;
    this.stopover = stopover;
  }
}
