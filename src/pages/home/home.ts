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
  private weatherCurrent: any;
  private currentCityName: string;
  private currentCountyName: string;

  ngOnInit(){
    console.log('nginitfired')
    this.lat = 33.0918;
    this.long = -90.0467;
    //check if there is a stored location, if there is then make a call and get the weather info.

    //if there is not a stored location then call your gps location then use that lat long to get weather info.

    this.clickGetForecast(this.lat,this.long);
    this.getCityNameFromLL(this.lat,this.long);
  }

  //fires the request for forcast info that will be displayed to the user.
  clickGetForecast(lat,long){
    this.weatherService.getForecast(lat,long).subscribe(res =>{
      console.log('getforecast has fired');
      this.weatherCurrent = res.currently;
      console.log(res);
      console.log(this.weatherCurrent);
    }, err => {
      console.log(err);
    });
  };

  //I don think this api is going to work for looking up the city from lat long, no real standard to the response.
  getCityNameFromLL(lat,long){
    let location = lat+","+long;
    this.weatherService.getGeocodeApi(location).subscribe(res => {
      let data = JSON.parse(res);
      let addressData = data.results[0]
      console.log(addressData)
      let i;

      //this for loop goes through and looks at the array and iterates through it looking for locality & political 
      //as these two params = the name of the city.
      for(i=0; addressData.address_components.length > i; i++){
        console.log(i);
        let data = addressData.address_components[i]
        if(data.types[0] == 'locality' && data.types[1] == 'political') {
          this.currentCityName = data.short_name;
          console.log('the city name is ' + this.currentCityName);
        } else if(data.types[0] == 'administrative_area_level_2' && data.types[1] == "political") {
          this.currentCountyName = data.short_name;
        }
        
      }
      //this.currentCityName = data.results[0].address_components[3].short_name;
      //console.log(this.currentCityName);
    },err => {
      console.log(err);
    });
  }

  //grab the user input from a text field and set it to a var
  setLocation(){
    this.userProvidedLocation = (<HTMLInputElement>document.getElementById("locationInput")).value;
    console.log(this.userProvidedLocation);
  }

  //this takes the location provided by the user and then returns the lat long info that is then bound to the local vars for use in the getforecast().
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
