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

  private userProvidedLocation: string;

  private lat: number;
  private long: number;

  //fires the request for forcast info that will be displayed to the user.
  clickGetForecast(lat,long){
    this.weatherService.getForecast(lat,long).subscribe(res =>{
      console.log(res);
    });
  };

  //grab the user input from a text field and set it to a var
  setLocation(){
    this.userProvidedLocation = (<HTMLInputElement>document.getElementById("locationInput")).value;
    console.log(this.userProvidedLocation);
  }


  clickgetGeocodeAPI(location){
    this.weatherService.getGeocodeApi(location).subscribe(res =>{
      console.log(res);
      let parsedRes = JSON.parse(res);
      this.lat = parsedRes.results[0].geometry.location.lat;
      this.long = parsedRes.results[0].geometry.location.lng;
      console.log(this.lat);
    });
  };

}
