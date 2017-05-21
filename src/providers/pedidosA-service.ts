import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class PedidosAService {
	usuarioPedido:any;


  	constructor(public http: Http) {
    	this.usuarioPedido = {};
  	}

    pedidosA(){
    	this.usuarioPedido.pagina = '1';
        this.usuarioPedido.token = window.localStorage.getItem('token');
		console.log(this.usuarioPedido);
		var url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/buscarCompraUsuario/';
        var response = this.http.post(url, this.usuarioPedido)
            .map(res => res.json());
        console.log(response, 'nada');
        return response;
    }

}
