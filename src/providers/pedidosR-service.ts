import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class PedidosRService {
	afiliadoPedido:any;
    pedidoAceptadoReq:any;
    pedidoCanceladoReq:any;

  	constructor(public http: Http) {
        this.afiliadoPedido = {};
        this.afiliadoPedido = {};
    	this.pedidoCanceladoReq = {};
        this.pedidoAceptadoReq = {};
  	}

    pedidosA(){
    	this.afiliadoPedido.pagina = '1';
        this.afiliadoPedido.token = window.localStorage.getItem('token');
		console.log(this.afiliadoPedido);
		var url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/buscarCompraSede/';
        var response = this.http.post(url, this.afiliadoPedido)
            .map(res => res.json());
        console.log(response, 'nada');
        return response;
    }

    pedidosAceptados(idCompra, time, valorDomicilio){
        this.pedidoAceptadoReq.token = window.localStorage.getItem('token');
        this.pedidoAceptadoReq.idCompra = idCompra;
        this.pedidoAceptadoReq.tiempoEntrega = time;
        this.pedidoAceptadoReq.valorDomicilio = valorDomicilio == null ? '0' : valorDomicilio;
        console.log(this.pedidoAceptadoReq);
        var url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/cambiarEstadoAceptado';
        var response = this.http.post(url, this.pedidoAceptadoReq)
            .map(res => {});
        console.log(response, 'nada');
        return response;
    }

    pedidosCancelados(idCompra, cancelado){
        this.pedidoCanceladoReq.token = window.localStorage.getItem('token');
        this.pedidoCanceladoReq.idCompra = idCompra;
        this.pedidoCanceladoReq.observacionRechazado = cancelado;
        console.log(this.pedidoCanceladoReq);
        var url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/cambiarEstadoRechazado';
        var response = this.http.post(url, this.pedidoCanceladoReq)
            .map(res => {});
        console.log(response, 'nada');
        return response;
    }

}
