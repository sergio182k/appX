import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CompraService } from '../../providers/compra-service'; 
import { ModalService } from '../../servicios/modal.service';
import { PedidosRealizados } from '../pedidos-realizados/pedidos-realizados';
import { PedidosAService } from '../../providers/pedidosA-service'; 
import { AfiliadoService } from '../../providers/afiliado-service'; 
import { Maps } from '../../maps/maps'; 
import { InicioPage } from '../inicio/inicio';
import { BusquedaPage } from '../busqueda/busqueda';
import { AuthService } from '../../providers/auth-service'; 

@Component({ 
  templateUrl: 'compra.html',
  providers: [ModalService]
})

export class Compra{
    imageCategory:any;
    nameCategory:any;
    subCategories:any;
    shownGroup:any;
    productos:any;
    total:any;
    infoCompra:any;
    pedidosR:any;
    afiliado:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public _compra: CompraService, 
      private _modal:ModalService, public _pedidoServ: PedidosAService, private _modalCtrl: ModalController, 
      private _afiliado: AfiliadoService, private _service:AuthService) {
      this.total = 0;
      this.productos = _compra.devolverProductos();
      this.total = _compra.devolverTotal();
      this.infoCompra = {};
      this.infoCompra.recogerCompra = false;
      this.infoCompra.direccion = window.localStorage.getItem('direccion');
      this.infoCompra.desDireccion = window.localStorage.getItem('desDireccion');     
    }

    isGroupShown(subCategory){
        return this.shownGroup === subCategory;
    }
    
    comprar(){
        this._compra.compra(this.infoCompra).subscribe(
        data => this._onCompraSucces(data),
        err => {
          console.log(err);
          this._modal.showAlert('Error', 'Lo sentimos no la compra no se realizo');
        },
        () => console.log('End')
      );
    }


    _onCompraSucces(data){
      this._modal.showAlert('Exito', 'Tu compra se realizo de manera correcta');
      localStorage.setItem('compraActiva', 'false');
      this._pedidoServ.pedidosA().subscribe(
      data => this._onBusquedaSucces(data),
      err => {
        console.log(err);
        this._modal.showAlert('Error', 'No hay pedidos disponibles');
      },
      () => console.log('End')
    );
      
    }

    _onBusquedaSucces(data){
        this.pedidosR = data.results; 
        console.log(data);
        this.navCtrl.push(PedidosRealizados, {data : data});
    }

    mostrarMapa(){
      let mapsModal = this._modalCtrl.create(Maps, {
        startLat: 211,
        destLat: this._afiliado.retornoLatLong().sede.latitud,
        startLong: 411,
        destLong: this._afiliado.retornoLatLong().sede.longitud, 
      });
      mapsModal.present();
    }

    agregarQuitar(producto, funcion){
      this._compra.agregarQuitar(producto, funcion);
      this.total = this._compra.devolverTotal();
    }

    quitar(producto){
      this._compra.quitar(producto);
      this.total = this._compra.devolverTotal();
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

