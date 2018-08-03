import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from '../../../node_modules/rxjs/Observable';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(
    public navCtrl: NavController,
    private storage: Storage, 
  ) {}

  public lat: any;
  public long: any;

  ngOnInit(){
    this.pullLatLong();
  }

  pullLatLong(){
    console.log('pull lat long has fired')
    this.storage.get('lat').then(res => {this.lat = res});
    this.storage.get('long').then(res => {this.long = res, this.createMap()});
  }

  createMap(){
    document.getElementById('mapBox').innerHTML += "<iframe id='map-embed-iframe' frameborder='0' height='500px' width='100%' src='https://maps.darksky.net/@temperature," + this.lat + "," + this.long + ",8?domain="+encodeURIComponent(window.location.href)+"&auth=1533218084_ae608546acd875a04d5b7e99680ccad0&embed=true&amp;timeControl=false&amp;fieldControl=true&amp;defaultField=radar&amp;defaultUnits=_f'></iframe>"
  }
}
