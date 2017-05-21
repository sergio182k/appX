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
export class AfiliadoService {
	afiliado:any;
  afiliadoDatosCompletos:any;

  constructor(public http: Http) {
    this.afiliado = {};
  }

  	buscarAfiliados(afiliado) {
  		this.afiliado.idCiudad = afiliado.idCiudad;
  		this.afiliado.parametroBusqueda = afiliado.parametroBusqueda; 
      this.afiliado.latitud = afiliado.latitud;
      this.afiliado.longitud = afiliado.longitud;
        var url = 'https://clicpedidos.co:8443/clicpedidos/api/sede/buscarSedes/';
        var response = this.http.post(url, this.afiliado).map(res => res.json());
        return response;
    }

    retornoBusqueda(){
      return this.afiliado.parametroBusqueda;
    }

    retornoLatLong(){
      return this.afiliadoDatosCompletos;
    } 

    afiliadoGuardar(afiliado){
      this.afiliadoDatosCompletos = afiliado;
    }

    retornoAfiliadoCompleto(){
      return this.afiliadoDatosCompletos;
    }

}
