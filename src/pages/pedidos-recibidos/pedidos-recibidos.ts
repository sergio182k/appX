import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavController, Platform} from 'ionic-angular';
import {Vibration} from 'ionic-native';
import {ModalService} from '../../servicios/modal.service';
import {PedidosRService} from '../../providers/pedidosR-service';
import {PedidosRecibidosDetalle} from './pedidos-recibidos-detalle';
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
  private pedidoSeleccionado: number = -1;
  conteoNuevosPedidos: number;
  time: number = 0;
  cargaInicial: boolean;
  noMostrarUltimoMenError = true;
  mostrarVentanaNuevosPedidos = true;

  constructor(private _authService: AuthService, private _modalCtrl: ModalController,
    private _modal: ModalService, private _pedidoServ: PedidosRService, private _navCtrl: NavController, private _platform: Platform) {
    this.buscarPedidos(false);
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
    // this._platform.registerBackButtonAction(this._onBackButton.bind(this), 1);
  }

  // private _onBackButton(): void {
  //   console.log('nothing');
  // }

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

  private _onBusquedaSucces(data) {
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

  private _onLogoutSucces() {
    this._modal.showAlert('Exito', 'LogOut');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('tipoUsuario');
    this._navCtrl.push(InicioPage);
    this.noMostrarUltimoMenError = false;
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

  /**
   * @param oneTime : boolean => true if require execute just one time, false for continuos execution
   */
  public buscarPedidos(oneTime?: boolean) {
    this._pedidoServ.pedidosA().subscribe(
      data => this._onBusquedaSucces(data),
      err => {
        console.log(err);
        if (this.noMostrarUltimoMenError) {
          this._modal.showAlert('Error', 'No hay pedidos disponibles');
        }
      },
      () => {
        if (!oneTime) { setTimeout(this.buscarPedidos.bind(this), 10000) }
      }
    );
  }

  public logout(event) {
    if (window.localStorage.getItem('token') === "undefined" || window.localStorage.getItem('token') === null) {
      console.log('error');
    } else {
      let userSend = window.localStorage.getItem('token');
      console.log(userSend);
      this._authService.logout(userSend).subscribe(
        data => this._onLogoutSucces(),
        err => {
          console.log(err);
        },
        () => console.log('End')
      );
    }
  }

  public open(pedido: any, index: number): void {
    this.pedidoSeleccionado = index;
    const PEDIDODETALLE = this._modalCtrl.create(PedidosRecibidosDetalle, {
      conteoNuevosPedidos: this.conteoNuevosPedidos,
      pedido: pedido
    });
    PEDIDODETALLE.onDidDismiss(data => {
      this.buscarPedidos(true);
      try {
        if(data.pedido) {
          this.conteoNuevosPedidos = data.conteoNuevosPedidos;
          this.pedidosRecibidos[this.pedidoSeleccionado] = data.pedido;
        }
      } catch (e) {
        console.log(e);
      }
      console.log(data);
    });
    PEDIDODETALLE.present();
  }
}
