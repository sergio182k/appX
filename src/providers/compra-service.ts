import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class CompraService {
	newUserSend:any;
	productos:any;
	total:any;
	paquete:any;
	idProductos:any;

  	constructor(public http: Http) {
    	this.productos = [];
    	this.total = 0;
    	this.paquete = {};
    	this.idProductos = [];
  	}

	agregar(producto){
    if (this.productos.length == 0){
        this.productos.push(producto);
        this.idProductos.push(producto.idProducto);
        this.total = (producto.precio * producto.cantidad);
    }else{
        for (var i = 0; i < this.productos.length; i++){
            if (this.productos[i].nombre == producto.nombre && this.productos[i].precio == producto.precio){
                this.total = (producto.precio * producto.cantidad);
            }else{
                this.productos.push(producto);
                this.idProductos.push(producto.idProducto);
                this.total += producto.precio;
            }
            break;
        }
    }
	}



	devolverProductos(){
        return this.productos;
    }

    devolverTotal(){
    	return this.total;
    }


    compra(infoCompra){
    	this.paquete.token = window.localStorage.getItem('token');
 		this.paquete.idSede = localStorage.getItem('idSede');
    	this.paquete.longitud = 0;
    	this.paquete.latitud = 0;
    	this.paquete.idsProductosComprados = this.idProductos;
    	this.paquete.observacion = infoCompra.observacion == null ? '' : infoCompra.observacion;
   		this.paquete.recogerCompra = infoCompra.recogerCompra == false ? 'N' : 'S';
        if(infoCompra.direccion == null){
           this.paquete.direccion =  '';
        }else{
            this.paquete.direccion = infoCompra.direccion;
            window.localStorage.setItem('direccion', infoCompra.direccion);
        }
        if(infoCompra.desDireccion == null){
           this.paquete.desDireccion =  '';
        }else{
            this.paquete.direccion = infoCompra.direccion;
            window.localStorage.setItem('desDireccion', infoCompra.desDireccion);
        }

		console.log(this.paquete)
		const url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/recibirCompra/';
        const response = this.http.post(url, this.paquete)
            .map((res) => {});
        console.log(response, 'nada');
        return response;

    }

    borrarCompra(){
        this.productos = [];
        this.total = 0;
        this.paquete = {};
        this.idProductos = [];
    }

    agregarQuitar(producto, funcion){
        for (var i = 0; i < this.productos.length; i++){
            if (this.productos[i].nombre == producto.nombre && this.productos[i].precio == producto.precio){
                console.log('inside', funcion);
                if (funcion){
                    this.productos[i].cantidad += 1;
                    console.log(this.total, ' l ', producto.precio);
                    this.total += producto.precio;
                    console.log(this.total);
                }else{
                    console.log('llego a funcion resta');
                    this.productos[i].cantidad -= 1;
                    this.total -= producto.precio;
                    if(this.productos[i].cantidad <= 0){
                        this.productos.splice([i],1);
                    }
                }
                break;
            }
        }
    }

    quitar(producto){
        for (var i = 0; i < this.productos.length; i++){
            if (this.productos[i].nombre == producto.nombre && this.productos[i].precio == producto.precio){
                this.productos.splice([i],1);
                this.total -= (producto.precio * producto.cantidad);
                break;
            }
        }
    }


}
