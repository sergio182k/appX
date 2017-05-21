import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { BusquedaPage } from '../busqueda/busqueda';
import { PedidosRecibidos } from '../pedidos-recibidos/pedidos-recibidos';
import { ModalService } from '../../servicios/modal.service';
import { AuthService } from '../../providers/auth-service';


@Component({
  templateUrl: 'inicio.html',
  providers: [ModalService]
})

export class InicioPage {

  user:any;
  loginObject:any;

  constructor(public navCtrl: NavController, private _service:AuthService, private _modal:ModalService) {
  	this.user = {};
  }

  	login(event){
      let userSend = this.user;
      console.log(this.user);
      this._service.login(userSend).subscribe(
        data => this._onLoginSucces(data),
        err => {
          console.log(err);
          this._modal.showAlert('Error', 'Usuario o Contraseña Incorrectos');
        },
        () => console.log('End')
      );
    }

    _onLoginSucces(data){
      this.loginObject = data.results;
      console.log(data);
      window.localStorage.setItem('username', data.persona.email);
      window.localStorage.setItem('tipoUsuario', data.tipoUsuario);
      window.localStorage.setItem('token', data.token)
      if (data.tipoUsuario == "U"){
        this.navCtrl.push(BusquedaPage, {user : data.token});
      }else {
        this.navCtrl.push(PedidosRecibidos);
      }
    }

    next(event){
      this.navCtrl.push(RegistroPage);
    }


}
