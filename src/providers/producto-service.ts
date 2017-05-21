import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the AfiliadoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductoService {
	productos:any;
  afiliado:any;
  producto:any;

  constructor(public http: Http) {
    console.log('Hello AfiliadoService Provider');
    this.productos = {};
    this.afiliado = {};
    this.producto = {};
  }

  	buscarProducto(afiliado) {
       console.log(afiliado, 'nuevo');
      this.producto = afiliado;
      console.log(this.producto);
        var url = 'https://clicpedidos.co:8443/clicpedidos/api/producto/buscarProducto/';
        var response = this.http.post(url, this.producto)
            .map(res => res.json() 
            );
        console.log(response, 'nada');
        return response;
    }

}
