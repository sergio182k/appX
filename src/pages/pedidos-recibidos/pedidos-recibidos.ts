import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Vibration} from 'ionic-native';
import {ModalService} from '../../servicios/modal.service';
import {PedidosRService} from '../../providers/pedidosR-service';
import {AuthService} from '../../providers/auth-service';
import {InicioPage} from '../inicio/inicio';
import {LocalNotifications} from 'ionic-native';
import {BackgroundMode} from 'ionic-native';

@Component({
  templateUrl: 'pedidos-recibidos.html',
  providers: [ModalService]
})

export class PedidosRecibidos implements OnInit, OnDestroy {

  private backgroundState: boolean;
  pedidosRecibidos: any;
  conteoNuevosPedidos: number;
  shownGroup: any;
  time: number = 0;
  cargaInicial: boolean;
  intervalHandle = null;
  noMostrarUltimoMenError = true;
  mostrarVentanaNuevosPedidos = true;

  constructor(private navCtrl: NavController, public _pedidoServ: PedidosRService, public _modal: ModalService,
              private platform: Platform, private _service: AuthService) {
    this.buscarPedidos();
    this.conteoNuevosPedidos = 0;
    this.cargaInicial = true;
    this.backgroundState = false;
  }

  ngOnDestroy(): void {
    document.removeEventListener('pause', this._cambiarEstado, false);
    document.removeEventListener('resume', this._cambiarEstado, false);
    LocalNotifications.clearAll();
    this._deshabilitarBackgroundMode();
  }

  ngOnInit(): void {
    this._deshabilitarBackgroundMode();
    document.addEventListener('pause', this._cambiarEstado.bind(this), false);
    document.addEventListener('resume', this._cambiarEstado.bind(this), false);
  }

  private _cambiarEstado(): void {
    const EXECUTE = () => {
      this.backgroundState = !this.backgroundState;
      if (this.backgroundState) {
        BackgroundMode.enable();
      } else {
        BackgroundMode.disable();
      }
    }
    setTimeout(EXECUTE.bind(this), 0);
  }

  private _deshabilitarBackgroundMode(): void {
    BackgroundMode.disable();
  }

  buscarPedidos() {
    console.log('llego a buscarpedidos');
    this._pedidoServ.pedidosA().subscribe(
      data => this._onBusquedaSucces(data),
      err => {
        console.log(err);
        if (this.noMostrarUltimoMenError) {
          this._modal.showAlert('Error', 'No hay pedidos disponibles');
        }
      },
      () => setTimeout(this.buscarPedidos.bind(this), 10000)
    );
  }

  _onBusquedaSucces(data) {
    if (this.cargaInicial) {
      this.pedidosRecibidos = data;
      this.cargaInicial = false;
    } else {
      if (this.pedidosRecibidos.length != data.length) {
        if (this.backgroundState || this.mostrarVentanaNuevosPedidos) {
          this.conteoNuevosPedidos = data.length - this.pedidosRecibidos.length;
          if (this.backgroundState) {
            this._showNotification('Hola tienes nuevos pedidos');
          } else {
            this._modal.showAlert('Hola', 'tienes nuevos pedidos');
          }
          this.mostrarVentanaNuevosPedidos = false;
        } else {
          this.conteoNuevosPedidos++;
        }
        Vibration.vibrate(1000);
        this.pedidosRecibidos = data;
      }
    }
  }

  private _showNotification(text: string): void {
    LocalNotifications.schedule({
      id: 1,
      led: 'FF0000',
      text: text
      // TODO add a sound file
      // ,sound: this.platform.is('android') ? 'file://sound.mp3': 'file://beep.caf',
    });
  }

  toggle(pedido) {
    this.shownGroup = this.isGroupShown(pedido) ? null : pedido;
  }

  isGroupShown(pedido) {
    return this.shownGroup === pedido;
  }

  pedidoAceptado(idCompra, valorDomicilio) {
    this.mostrarVentanaNuevosPedidos = true;
    this._pedidoServ.pedidosAceptados(idCompra, this.time, valorDomicilio).subscribe(
      data => this._onBusquedaSuccesAceptados(data, idCompra),
      err => {
        this._modal.showAlert('Error', 'No Acepto');
      },
      () => {
      }
    );
  }

  _onBusquedaSuccesAceptados(data, idCompra) {
    if (this.conteoNuevosPedidos != 0) {
      this.conteoNuevosPedidos--;
    }
    for (var i = 0; i <= this.pedidosRecibidos.length - 1; i++) {
      if (this.pedidosRecibidos[i].compra.idCompra == idCompra) {
        this.pedidosRecibidos[i].procesosCompraActual.tipoProceso.idTipoProceso = 2;
      }
    }
  }

  pedidoCancelado(idCompra, cancelado) {
    this.mostrarVentanaNuevosPedidos = true;
    this._pedidoServ.pedidosCancelados(idCompra, cancelado).subscribe(
      data => this._onBusquedaSuccesCancelados(data, idCompra),
      err => {
        console.log(err);
        this._modal.showAlert('Error', 'No Cancelo');
      },
      () => console.log('End-PedidoAceptado')
    );
  }

  _onBusquedaSuccesCancelados(data, idCompra) {
    if (this.conteoNuevosPedidos != 0) {
      this.conteoNuevosPedidos--;
    }
    for (var i = 0; i <= this.pedidosRecibidos.length - 1; i++) {
      if (this.pedidosRecibidos[i].compra.idCompra == idCompra) {
        this.pedidosRecibidos[i].procesosCompraActual.tipoProceso.idTipoProceso = 3;
      }
    }
  }

  logout(event) {
    if (window.localStorage.getItem('token') === "undefined" || window.localStorage.getItem('token') === null) {
      console.log('error');
    } else {
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

  _onLogoutSucces() {
    this._modal.showAlert('Exito', 'LogOut');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('tipoUsuario');
    this.navCtrl.push(InicioPage);
    this.noMostrarUltimoMenError = false;
  }
}
