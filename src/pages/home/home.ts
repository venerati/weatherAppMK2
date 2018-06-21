import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherApiProvider } from '../../providers/weather-api/weather-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public weatherService: WeatherApiProvider) {

  }

  clickGetForecast(){
    this.weatherService.getForecast();
  };


  clickgetGeocodeAPI(){
    this.weatherService.getGeocodeApi();
  };

}
