import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidPermissions } from '@ionic-native/android-permissions'

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(private androidPermissions: AndroidPermissions,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.checkForPermissions();
      splashScreen.hide();
    });
  }

  checkForPermissions(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION).then(
      result => {
        console.log('Has permission?',result.hasPermission);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION);
        if(result.hasPermission = false) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION)
        }
      },

      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARS_LOCATION)
    );
  }
}
