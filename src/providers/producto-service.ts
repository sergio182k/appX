import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductoService {
	private productos:any;
  private afiliado:any;
  private producto:any;

  constructor(public http: Http) {
    console.log('Hello AfiliadoService Provider');
    this.productos = {};
    this.afiliado = {};
    this.producto = {};
  }

  	buscarProducto(afiliado): any {
       console.log(afiliado, 'nuevo');
      this.producto = afiliado;
      console.log(this.producto);
      const url = 'https://clicpedidos.co:8443/clicpedidos/api/producto/buscarProducto/';
      const response = this.http.post(url, this.producto)
            .map(res => res.json()
            );
        console.log(response, 'nada');
        return response;
    }

}
