import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  private apiKey: string;
  private baseURL: string;
  private options: any;
  private locationAPIURLFull = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyD87vMsPNhcmVfArM9W9okUaEVhALAAbE0'
  private lat: string;

  getForecast() {
    let data = {
      lat : '44.0001',
      long : '45.0001',
      location : 'dallas,tx',
      loccationType : 'city'
    }

    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-api-key': 'lVrOGXvjyqYnJ00Xq5ru6pIcDAFxRdla3l4p1C32'
      })
    }

    console.log('getForcast has fired')
    let url = 'https://t2s0225595.execute-api.us-east-2.amazonaws.com/prod/darkSkyAPIProxy'
    this.http.post(url,data,this.options).subscribe(res =>{console.log(res)}, err =>{});
  }

  convertLatLong(){

  }

  getGeocodeApi(){
    let data = {}

    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-api-key': 'lVrOGXvjyqYnJ00Xq5ru6pIcDAFxRdla3l4p1C32'
      })
    }

    console.log('getForcast has fired')
    let url = 'https://t2s0225595.execute-api.us-east-2.amazonaws.com/prod/getLatLongFromGoogleAPI'
    this.http.post(url,data,this.options).subscribe(res =>{console.log(res)}, err =>{});

    // let proxyurl = 'https://t2s0225595.execute-api.us-east-2.amazonaws.com/prod/getLatLongFromGoogleAPI';
    // let body = 'test';
    // this.options = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'x-api-key': 'lVrOGXvjyqYnJ00Xq5ru6pIcDAFxRdla3l4p1C32'
    //   })
    // }
    // this.http.post(proxyurl,body).subscribe(res => {
    //   console.log(res);
    // }, err => {})
  }

  // getGeocodeApi(){
  //   this.http.get(this.locationAPIURLFull).subscribe(res => {
  //     console.log(res)
  //     this.lat = res.results[0].geometry.location.lat;
  //     console.log(this.lat)
  //   }, err => {
  //     console.log(err)
  //   })
  // }




}
