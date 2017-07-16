import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavParams, ViewController} from 'ionic-angular';
import {ModalService} from '../../servicios/modal.service';
import {PedidosRService} from '../../providers/pedidosR-service';
import {Maps} from '../../maps/maps';


@Component({
  templateUrl: 'pedidos-recibidos-detalle.html',
  providers: [ModalService]
})
export class PedidosRecibidosDetalle implements OnInit, OnDestroy {
  private conteoNuevosPedidos: number;
  public pedido: any;
  public time: number = 0;

  constructor(private _modalCtrl: ModalController, private _modal: ModalService, private _navParams: NavParams,
              private _pedidoServ: PedidosRService, private _viewCtrl: ViewController) {
    this.pedido = _navParams.get('pedido');
    this.conteoNuevosPedidos = _navParams.get('conteoNuevosPedidos');
    console.log(JSON.stringify(this.pedido.compra));
    _navParams = null;
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.pedido.compra.valorDomicilio = this.pedido.compra.valorDomicilio === 0 ? null : this.pedido.compra.valorDomicilio;
  }

  private _borrarCantidadPedidos(cantidad: number): void {
    this.conteoNuevosPedidos = this.conteoNuevosPedidos > 0 ? this.conteoNuevosPedidos - cantidad : this.conteoNuevosPedidos;
  }

  private _close(cancel: boolean): void {
    if (cancel) {
      this._viewCtrl.dismiss({});
    } else {
      this.pedido.procesosCompraActual.tiempoEntrega = this.time;
      this._viewCtrl.dismiss({
        conteoNuevosPedidos: this.conteoNuevosPedidos,
        pedido: this.pedido
      });
    }
  }

  private _onSuccessPedidoAceptado(data, idCompra): void {
    data = null;
    this._borrarCantidadPedidos(1);
    for (let i = 0; i <= this.pedido.length - 1; i++) {
      if (this.pedido[i].compra.idCompra == idCompra) {
        this.pedido[i].procesosCompraActual.tipoProceso.idTipoProceso = 2;
      }
    }
    this._close(false);
  }

  private _onSuccesPedidoCancelado(data, idCompra): void {
    data = null;
    this._borrarCantidadPedidos(1);
    for (let i = 0; i <= this.pedido.length - 1; i++) {
      if (this.pedido[i].compra.idCompra == idCompra) {
        this.pedido[i].procesosCompraActual.tipoProceso.idTipoProceso = 3;
      }
    }
    this._close(false);
  }

  private _pedidoCancelado(textoCancela: string, idCompra: any): void {
    if (textoCancela) {
      this._pedidoServ.pedidosCancelados(idCompra.idCompra, textoCancela).subscribe(
        data => this._onSuccesPedidoCancelado(data, idCompra.idCompra),
        err => {
          console.log(err);
          this._modal.showAlert('Error', 'No Cancelo');
        },
        () => console.log('End-PedidoAceptado')
      );
    }
  }

  public cancelar(idCompra): void {
    this._modal.presentPrompt(this._pedidoCancelado.bind(this), 'Razones para cancelar', 'Cancelar',
      'Ingrese razones para cancelar', {idCompra: idCompra});
  }

  public close(): void {
    this._close(true);
  }

  public mostrarMapa(direccion: string): void {
    console.log(direccion);
    // TODO mock fine address
    direccion = 'Iglesia de San Francisco';

    // startLat: 211,
    // destLat: this._afiliado.retornoLatLong().sede.latitud,
    // startLong: 411,
    // destLong: this._afiliado.retornoLatLong().sede.longitud,

    let mapsModal = this._modalCtrl.create(Maps, {
      address: direccion
      // destLat: direccion.latitud,
      // destLong: direccion.longitud,
      // onlyDest: false
    });
    mapsModal.present();
    // this.onlyDest = navParams.get('onlyDest');
    // this.isAfiliado = navParams.get('isAfiliado');
  }

  public pedidoAceptado(idCompra, valorDomicilio): void {
    this._pedidoServ.pedidosAceptados(idCompra, this.time, valorDomicilio).subscribe(
      data => this._onSuccessPedidoAceptado(data, idCompra),
      err => {
        this._modal.showAlert('Error', 'No Acepto');
      },
      () => {}
    );
  }
}
