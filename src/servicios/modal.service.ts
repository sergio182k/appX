import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';


@Injectable()
export class ModalService{

	constructor(private alertCtrl: AlertController) {}

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
