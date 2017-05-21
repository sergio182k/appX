import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductoService } from '../../providers/producto-service'; 
import { AfiliadoService } from '../../providers/afiliado-service'; 
import { CompraService } from '../../providers/compra-service'; 
import { ModalService } from '../../servicios/modal.service';
import { ListaProductos } from '../lista-productos/lista-productos';
import { InicioPage } from '../inicio/inicio';
import { BusquedaPage } from '../busqueda/busqueda';
import { PedidosRealizados } from '../pedidos-realizados/pedidos-realizados';
import { PedidosAService } from '../../providers/pedidosA-service'; 
import { AuthService } from '../../providers/auth-service'; 


@Component({
  inputs : ["aceptaVaciarCarro"],
  templateUrl: 'lista-afiliados.html',
  providers: [ModalService]
})

export class ListaAfiliados {
	afiliados:any;
  afiliado:any;
  producto:any;
  pedidoMinimo:any;
  compraActiva:any;
  borrar: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public _producto: ProductoService, 
    public _modal: ModalService, public _afiliado: AfiliadoService, public _compra: CompraService, 
    public _pedidoServ: PedidosAService, private _service:AuthService) {

  	 	this.afiliados = navParams.get('data');
      this.borrar = false; 
  	 	for (var i = this.afiliados.length - 1; i >= 0; i--) {
  	 		this.afiliados[i].abierto = this.afiliados[i].abierto == 'N' ? false: true;
  	 	}
  	 	console.log(this.afiliados);
      this.producto = {};
	}


    ionViewWillEnter() {
      this.afiliados = this.navParams.get('data');
    } 


  buscarProducto(){
    console.log(this.borrar, ' borrar');
    if(this.borrar){
      this._compra.borrarCompra();
    }
    this._afiliado.afiliadoGuardar(this.afiliado);
    console.log('nada');
    console.log(this.afiliado);
    localStorage.setItem('idSede', this.afiliado.sede.idSede);
    this.pedidoMinimo = this.afiliado.sede.valorPedidoMin;
    this.producto.idSede = this.afiliado.sede.idSede;
    this.producto.parametroBusqueda = ''; 
    this.producto.pagina = '1';
    this._producto.buscarProducto(this.producto).subscribe(
      data => this._onBusquedaSucces(data),
      err => {
        console.log(err);
        this._modal.showAlert('Error', 'Producto no disponible');
      },
      () => console.log('End')
    );  

  }

  antesDeBuscar(afiliado){
    if( localStorage.getItem('idSede') == 'vacio'){
      localStorage.setItem('idSede', afiliado.sede.idSede); 
    }
    this.afiliado = afiliado;
    if (afiliado.abierto || !afiliado.abierto){
      this.compraActiva = localStorage.getItem('compraActiva');
      if (this.compraActiva == 'true'){
        console.log('compraActiva', localStorage.getItem('idSede'), afiliado.sede.idSede  );
        if(localStorage.getItem('idSede') != afiliado.sede.idSede){
          console.log('entro');
          this._modal.showAlertBotones('Alerta', 'Ya tienes productos en el carro de compras, Deseas continuar y borrar los productos', this.buscarProducto.bind(this));  
          this.borrar = true;
        }else{
          this.borrar = false;
          this.buscarProducto();
        }
      }else{
        this.borrar = false;
        this.buscarProducto();
      }
    }else{
      this._modal.showAlert('Lo sentimos', 'Establecimiento Cerrado');
    }
  }
  
  _onBusquedaSucces(data){
    this.afiliados = data.results; 
    console.log(data);
    this.navCtrl.push(ListaProductos, {data : data, pedidoMinimo:this.pedidoMinimo});
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
