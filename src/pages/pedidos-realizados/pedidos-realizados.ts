import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Vibration } from 'ionic-native';
import { ModalService } from '../../servicios/modal.service';
import { PedidosAService } from '../../providers/pedidosA-service'; 
import { BusquedaPage } from '../busqueda/busqueda';
import { AuthService } from '../../providers/auth-service'; 
import { InicioPage } from '../inicio/inicio';

@Component({
  templateUrl: 'pedidos-realizados.html',
  providers: [ModalService]
})

export class PedidosRealizados {
  afiliadoPedido:any;
  pedidosR:any;
  shownGroup:any;
  cargaInicial:any;
  //listaProducto:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _pedidoServ: PedidosAService, 
    public _modal: ModalService, private _service:AuthService ) {
    this.pedidosR = navParams.get('data');
    this.cargaInicial = true;
    this.buscarPedidosUsuario()
  }

  toggle(pedido){
      this.shownGroup = this.isGroupShown(pedido) ? null : pedido;
    }

    isGroupShown(pedido){
      return this.shownGroup === pedido;
    }

  buscarPedidosUsuario(){
    this._pedidoServ.pedidosA().subscribe(
    data => this._onBusquedaSucces(data),
    err => console.log(err),
      () => setTimeout(this.buscarPedidosUsuario.bind(this), 10000)
    );
    }

  _onBusquedaSucces(data){
    if (this.cargaInicial){
      this.pedidosR = data;  
      this.cargaInicial = false;
      console.log('carga: ', this.cargaInicial);
    }else{
      console.log('esta entrando');
      for(var i = 0; i < data.length; i++){
        if (this.pedidosR[i].procesosCompraActual.tipoProceso.idTipoProceso != data[i].procesosCompraActual.tipoProceso.idTipoProceso){
          this.pedidosR = data; 
          Vibration.vibrate(1000);
          break;
        }
      }
    }
  }

  logOut(){
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

    busqueda(){
      this.navCtrl.push(BusquedaPage);
    }

}