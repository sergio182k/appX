import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PedidosRService {
  private afiliadoPedido: any;
  private pedidoAceptadoReq: any;
  private pedidoCanceladoReq: any;

  constructor(public http: Http) {
    this.afiliadoPedido = {};
    this.afiliadoPedido = {};
    this.pedidoCanceladoReq = {};
    this.pedidoAceptadoReq = {};
  }

  pedidosA(): any {
    this.afiliadoPedido.pagina = '1';
    this.afiliadoPedido.token = window.localStorage.getItem('token');
    console.log(this.afiliadoPedido);
    const url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/buscarCompraSede/';
    const response = this.http.post(url, this.afiliadoPedido)
      .map(res => res.json());
    console.log(response, 'nada');
    return response;
  }

  pedidosAceptados(idCompra, time, valorDomicilio): any {
    this.pedidoAceptadoReq.token = window.localStorage.getItem('token');
    this.pedidoAceptadoReq.idCompra = idCompra;
    this.pedidoAceptadoReq.tiempoEntrega = time;
    this.pedidoAceptadoReq.valorDomicilio = valorDomicilio == null ? '0' : valorDomicilio;
    console.log(this.pedidoAceptadoReq);
    const url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/cambiarEstadoAceptado';
    const response = this.http.post(url, this.pedidoAceptadoReq)
      .map(res => {
      });
    console.log(response, 'nada');
    return response;
  }

  pedidosCancelados(idCompra, cancelado): any {
    this.pedidoCanceladoReq.token = window.localStorage.getItem('token');
    this.pedidoCanceladoReq.idCompra = idCompra;
    this.pedidoCanceladoReq.observacionRechazado = cancelado;
    console.log(this.pedidoCanceladoReq);
    const url = 'https://clicpedidos.co:8443/clicpedidos/api/compra/cambiarEstadoRechazado';
    const response = this.http.post(url, this.pedidoCanceladoReq)
      .map(res => {
      });
    console.log(response, 'nada');
    return response;
  }

}
