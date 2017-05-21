import { Component} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ProductoService } from '../../providers/producto-service'; 
import { ModalService } from '../../servicios/modal.service';
import { Accordion, AccordionGroup} from '../accordion';
import { Subcategories } from '../subcategories/subcategories';
import { AfiliadoService } from '../../providers/afiliado-service'; 
import { Compra } from '../compra/compra';
import { CompraService } from '../../providers/compra-service'; 
import { InicioPage } from '../inicio/inicio';
import { BusquedaPage } from '../busqueda/busqueda';
import { PedidosRealizados } from '../pedidos-realizados/pedidos-realizados';
import { PedidosAService } from '../../providers/pedidosA-service'; 
import { AuthService } from '../../providers/auth-service'; 


@Component({
  templateUrl: 'lista-productos.html',
  providers: [ModalService, Accordion, AccordionGroup]
})

export class ListaProductos {
	dataIn:any;
	productos:any;
	categorias:any;
	mostrarProductos:any;
	producto:any;
  listCategory: any;
  mostrarSub:any;
  shownGroup:any;
  verBarra = false;
  cantidad: any;
  pedidoMinimo:any;
  total = 0;

  	constructor(public navCtrl: NavController, public navParams: NavParams, private _producto: ProductoService, 
      public _modal: ModalService, private accordion: Accordion, private accordionGroup: AccordionGroup, 
      private _afiliado: AfiliadoService, public _compra: CompraService, public _pedidoServ: PedidosAService, 
      private _service:AuthService) {
  	  	this.dataIn = navParams.get('data');
        this.pedidoMinimo = navParams.get('pedidoMinimo');
        console.log(this.dataIn, 'data');
  	  	this.listCategory = this.dataIn.categorias;
  	  	this.mostrarProductos = false;
  	  	this.producto = {}; 
        this.mostrarSub = false; 		
        this.producto.cantidad = 1;
  	}

  	buscarProducto(categoriaNombre){
  		this.producto.idSede = localStorage.getItem('idSede');
    	this.producto.parametroBusqueda = categoriaNombre.nombre; 
    	this.producto.pagina = '1';
      	this._producto.buscarProducto(this.producto).subscribe(
	        data => {
            console.log('llegaron los regalos ' + data);
            this._onBusquedaSucces(data, categoriaNombre)
        },
	        err => {
	          console.log(err);
	          this._modal.showAlert('Error', 'Producto no disponible');
	        },
	        () => console.log('End')
	    );
  	}

  	_onBusquedaSucces(data, categoriaNombre){
  		this.productos = data.productos; 
      for (var i=0; i<this.productos.length; i++){
        this.productos[i].cantidad = 1;
      }
      this._toggle(categoriaNombre);           
    }

    _toggle(pedido){
      this.shownGroup = this.isGroupShown(pedido) ? null : pedido;
    }

    isGroupShown(pedido){
      return this.shownGroup === pedido;
    }

    agregar(producto){
      this.verBarra = true;
      localStorage.setItem('compraActiva', 'true');
      console.log(producto.cantidad, 'antesProd');
      console.log(this.cantidad, 'antes');
      this.cantidad = producto.cantidad;
      console.log(this.cantidad, 'despues');
      if (this.cantidad == 1){
        console.log('cantidad igual');
        this.total += producto.precio;
      } else {
        console.log('cantidad diferente');
        for (var i = 0; i < this.cantidad; i++){
          this.total += producto.precio; 
        }
      } 
      this._compra.agregar(producto);
      console.log(producto.cantidad, 'Final'); 
      console.log(this.total, 'final');     
    }

    confirmaCompra(){
        console.log(this.total, 'final');
        if( this.total < this.pedidoMinimo){
          this._modal.showAlert('Error', 'Valor de pedido inferior al permitido');
        } else{
          this.navCtrl.push(Compra);
        }
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
