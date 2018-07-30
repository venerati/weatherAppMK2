import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { WeatherApiProvider } from '../../providers/weather-api/weather-api';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { Keyboard } from '@ionic-native/keyboard';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private keyboard: Keyboard, public navCtrl: NavController, public weatherService: WeatherApiProvider, private storage: Storage, private geolocation: Geolocation, private plat: Platform) {

    this.plat.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      if(readySource = 'cordova') {
        this.env = readySource
        this.weatherSearchFromCurrentGPS();
      } else {
        this.getWeatherFromIP();
      }
      //this.setGPSCords()
    });
  }

  private env: any;
  private userProvidedLocation: string;
  private lat: number;
  private long: number;
  private weatherCurrent: any;
  private weatherFuture: any;
  private weatherHourly: any;
  private currentCityName: string;
  private currentNeighborhood: string;
  private currentState: string;
  private currentCountyName: string;


  ngOnInit(){
    console.log('nginitfired')
    //this.checkForPermissions();
    //this.weatherSearchFromCurrentGPS()
  }

  ngAfterViewInit(){
    
  }

  //fires the request for forcast info that will be displayed to the user.
  clickGetForecast(lat,long){
    this.weatherService.getForecast(lat,long).subscribe(res =>{
      console.log('getforecast has fired');
      this.weatherCurrent = res.currently;
      this.weatherFuture = res.daily.data;
      this.weatherHourly = res.hourly.data;
      console.log(res);
      console.log(this.weatherCurrent);
    }, err => {
      console.log(err);
      alert('there was an error getting your location from IP. Be sure you have a connection to the internet.');
    });
  };

  //this takes the lat long passed to it and returns the name of the closest city or region.
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

        if(data.types[0] == 'neighborhood' && data.types[1] == 'political'){
          this.currentNeighborhood = data.short_name;
        }

        if(data.types[0] == 'administrative_area_level_1' && data.types[1] == 'political'){
          this.currentState = data.short_name;
        }
        
      }
      //this.currentCityName = data.results[0].address_components[3].short_name;
      //console.log(this.currentCityName);
    },err => {
      console.log(err);
    });
  }

  //this calls the built in gps of the phone and will return location information or an error
  getGPSCords(): Observable<any> {
    console.log('setGPSCords has fired')
      return new Observable(observer => {
        this.geolocation.getCurrentPosition({enableHighAccuracy: false, timeout: 1000}).then(res => {
          observer.next(res);
        }).catch((err) => {
          console.log('Error getting location', err);
          observer.error(err);
        });
      })
  }

  //this will request a fresh set of lat long from the gps radio or from your IP address
  weatherSearchFromCurrentGPS(){
    console.log('wathersearchfromcurrentgps has fired')
    this.getGPSCords().subscribe( res => {
      console.log('the gps resp is ' + res.coords.latitude);
      console.log('the gps resp is ' + res.coords.longitude);
      this.clickGetForecast(res.coords.latitude,res.coords.longitude);
      this.getCityNameFromLL(res.coords.latitude,res.coords.longitude);
      this.lat = res.coords.latitude;
      this.long = res.coords.longitude;
    }, err => {
      console.log("gps failed to get location.");
      this.getWeatherFromIP();
    });
  }

  getWeatherFromIP(){
    console.log('Getting weather from IP')
    this.weatherService.getLocationFromIP().subscribe(res => {
      this.clickGetForecast(res.lat,res.lon);
      this.getCityNameFromLL(res.lat,res.lon);
      this.lat = res.lat;
      this.long = res.lon;
    }, err => {
      console.log(err);
      alert('there was an error getting your location from IP. Be sure you have a connection to the internet.');
    });
  }

  //grab the user input from a text field and set it to a var
  setLocation(): Observable<any> {
    console.log('setlocation fired')
    console.log(this.env)
    if(this.env = 'cordova') {
      this.keyboard.close();
      console.log('close keyboard has fired.')
    }
    return new Observable(observer => {
      let location = (<HTMLInputElement>document.getElementById("locationInput")).value
      console.log(location);
      //this.userProvidedLocation = location
      observer.next(location)
    })
  }

  //this is used to get the forcast from user input from the searchbar
  searchFromUserInput(){
    this.setLocation().subscribe(res => {
      this.clickgetGeocodeAPI(res).subscribe(res => {
        this.clickGetForecast(this.lat,this.long);
        this.getCityNameFromLL(this.lat,this.long);
      });
    });
  };

  //this takes the location provided by the user and then returns the lat long info that is then bound to the local vars for use in the getforecast().
  clickgetGeocodeAPI(location): Observable<any>{
    return new Observable(observer => {
      this.weatherService.getGeocodeApi(location).subscribe(res =>{
        console.log(res);
        let parsedRes = JSON.parse(res);
        this.lat = parsedRes.results[0].geometry.location.lat;
        this.long = parsedRes.results[0].geometry.location.lng;
        observer.next(res)
      });
    });
  };
}

  //this method uses the phones's gps to grab the current location then sets those values into storage for later use.
  // storeCurrentLocationGPS(){
  //   console.log('storecurrentlocation has fired')
  //   this.geolocation.getCurrentPosition().then((res) => {
  //     console.log('the gps resp is ' + res.coords.latitude);
  //     console.log('the gps resp is ' + res.coords.longitude);
  //     this.storage.set('lat', res.coords.latitude);
  //     this.storage.set('long', res.coords.longitude)
  //    }).catch((error) => {
  //      console.log('Error getting location', error);
  //    });
  // }

    //this is used to set the lat long variables with the data set in app storage.
  // getLatLongFromStorage(){
  //   console.log('getlatlongfromstorage has fired')
  //   this.storage.get('lat').then((res) => {
  //     this.lat = res;
  //     console.log(this.lat)
  //   });

  //   this.storage.get('long').then((res) => {
  //     this.long = res;
  //     console.log(this.long)
  //   })
    
  // }

    // initialGPSCheck() {
  //   console.log("navigator.geolocation works well");
  //   this.storeCurrentLocationGPS()
  //   this.getLatLongFromStorage()
    
  // }

  //askforPermission(){
    //   //this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION);
    //   //this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(res => {console.log(res)}, err => {console.log(err)})
    //   this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION).then(res => {
    //     if(res.hasPermission) {
    //       alert('you now have permission')
    //       this.setGPSCords()
    //     } else {
    //       alert('you still suck')
    //     }
    //   })
  
    // }
  
    // checkForPermissions() {
    //     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION).then(
    //       res => {
    //         console.log('check for permissions fired and returned a res')
    //         console.log(res)
    //         this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION);
  
    //       },
    //       err => {
    //         console.log('there was an err')
    //         this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION)
    //       }
    //     );
    // }
