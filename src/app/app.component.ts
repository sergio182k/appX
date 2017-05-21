import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from 'ionic-native';

import { InicioPage } from '../pages/inicio/inicio';
import { BusquedaPage } from '../pages/busqueda/busqueda';
import { PedidosRecibidos } from '../pages/pedidos-recibidos/pedidos-recibidos';

import { AuthService } from '../providers/auth-service'

// declare let FCMPlugin;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any; 

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // if (typeof FCMPlugin != 'undefined') {
    //   FCMPlugin.getToken((token) => {
    //     console.log(token);
    //      alert(token);
    //   }, (error) => {
    //     console.log('error retrieving token: ' + error);
    //   });
    // }

    // FCMPlugin.onNotification(
    //   (data) => {
    //     console.log(data);
    //   },
    //   (e) => {
    //     console.log(e);
    //   }
    // );


  }

  initializeApp() {
    this.platform.ready().then(() => {

      if(window.localStorage.getItem('username') === "undefined" || window.localStorage.getItem('username') === null){
        this.rootPage = InicioPage;
      }else{
        if(window.localStorage.getItem('tipoUsuario') == "U"){
          this.rootPage = BusquedaPage;
        }else{
          this.rootPage = PedidosRecibidos;
        }
      }
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  // openPage(page) {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   // navigate to the new page if it is not the current page
  //   this.nav.setRoot(page.component);
  // }
}
