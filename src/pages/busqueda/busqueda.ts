import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service'; 
import { AlertController } from 'ionic-angular';
import { ModalService } from '../../servicios/modal.service';
import { InicioPage } from '../inicio/inicio';
import { ListaAfiliados } from '../lista-afiliados/lista-afiliados';
import { PedidosRealizados } from '../pedidos-realizados/pedidos-realizados';
import { AfiliadoService } from '../../providers/afiliado-service'; 
import { PedidosAService } from '../../providers/pedidosA-service'; 


@Component({
  templateUrl: 'busqueda.html',
  providers: [ModalService]
})

export class BusquedaPage {

	name: any;
	userToken: any;
	parmBusqueda: any;
  afiliados:any;

  	constructor(private navCtrl: NavController, private _service:AuthService, private navParams: NavParams, private _modal:ModalService, private _afiliado: AfiliadoService, public _pedidoServ: PedidosAService) {
		  this.userToken = navParams.get('user');
		  this.parmBusqueda = {};
      this.parmBusqueda.parametroBusqueda = "";
      this.parmBusqueda.idCiudad = "86";
      localStorage.setItem('compraActiva', 'false');
      localStorage.setItem('idSede', 'vacio');
  	}

    buscarAfiliado(parmBusqueda){
      this.parmBusqueda = parmBusqueda;
      console.log(this.parmBusqueda);
    	this._afiliado.buscarAfiliados(this.parmBusqueda).subscribe(
        data => this._onBusquedaSucces(data),
        err => {
          console.log(err);
          this._modal.showAlert('Error', 'Afiliado o producto no disponible');
        },
        () => console.log('End')
      );
    }

    _onBusquedaSucces(data){
      this.afiliados = data.results; 
      console.log(data);
      this.navCtrl.push(ListaAfiliados, {data : data});
    }
 	
    logout(event){
      if(window.localStorage.getItem('token') === "undefined" || window.localStorage.getItem('token') === null){  
            console.log('error');
          }else {
            let userSend = window.localStorage.getItem('token');
              console.log(userSend);
              this._service.logout(userSend).subscribe(
              data => this._onLogoutSucces(),
              err => {
                  console.log(err);
              },
              () => console.log('End')
           );
          }  
    }

    _onLogoutSucces(){
      this._modal.showAlert('Exito', 'LogOut');
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('tipoUsuario');
      this.navCtrl.push(InicioPage);
    }

    pedidosRealizados(){
      this._pedidoServ.pedidosA().subscribe(
      data => this._onBusquedaSuccesRea(data),
      err => {
        console.log(err);
        this._modal.showAlert('Error', 'No hay pedidos disponibles');
      },
        () => console.log('End')
      );
    }

    _onBusquedaSuccesRea(data){
        console.log(data);
        this.navCtrl.push(PedidosRealizados, {data : data});
    }
}


