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

  /**
   *
   * @param metodo
   * @param placeholderInput
   * @param title
   * @param subTitle
   * @param @optional valoresExtra
   */
  public presentPrompt(metodo, placeholderInput, title, subTitle, valoresExtra?): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      inputs: [{
        name: 'texto',
        placeholder: placeholderInput,
        type: 'text'
      }],
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Cancelar',
          handler: data => {
            if(valoresExtra) {
              metodo(data['texto'], valoresExtra);
            } else {
              metodo(data['texto']);
            }
          }
        }
      ]
    });
    alert.present();
  }
}
