import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the WeatherApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherApiProvider {

  constructor(public http: HttpClient) {
    console.log('Hello WeatherApiProvider Provider');
  }

  private options: any;

  getForecast(lat,long): Observable<any> {
    let data = {
      lat : lat,
      long : long,
    }

    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-api-key': 'lVrOGXvjyqYnJ00Xq5ru6pIcDAFxRdla3l4p1C32'
      })
    }

    console.log('getForcast has fired')
    let url = 'https://t2s0225595.execute-api.us-east-2.amazonaws.com/prod/darkSkyAPIProxy'
    return this.http.post(url,data,this.options);
  }

  getGeocodeApi(location): Observable<any> {
    let data = {
      location: location
    }
    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-api-key': 'lVrOGXvjyqYnJ00Xq5ru6pIcDAFxRdla3l4p1C32'
      })
    }
    console.log('get lat long has fired')
    let url = 'https://t2s0225595.execute-api.us-east-2.amazonaws.com/prod/getLatLongFromGoogleAPI'

    return this.http.post(url,data,this.options)
  }
}
