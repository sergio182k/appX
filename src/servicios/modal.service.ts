import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { InicioPage } from '../pages/inicio/inicio';
import { BusquedaPage } from '../pages/busqueda/busqueda';


@Injectable()
export class ModalService{

  private aceptaVaciarCarro: Boolean = false;

	constructor(private nav: NavController, private alertCtrl: AlertController) {
    
  	}

  showAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Acceptar']
    });
    alert.present();
  }

  showAlertBotones(title, subTitle, metodo) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [
        {
          text: 'Aceptar',
          handler: () =>  metodo()
        },
        {
          text: 'Cancelar'
        }
      ]
    });
    alert.present();
  }

}