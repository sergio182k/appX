import { Component } from '@angular/core';

import { Platform, MenuController } from 'ionic-angular';

import { StatusBar } from 'ionic-native';

import { InicioPage } from '../pages/inicio/inicio';
import { BusquedaPage } from '../pages/busqueda/busqueda';
import { PedidosRecibidos } from '../pages/pedidos-recibidos/pedidos-recibidos';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // @ViewChild(Nav) nav: Nav;

  rootPage: any;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

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
}
