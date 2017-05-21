import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { InicioPage } from '../pages/inicio/inicio';
import { RegistroPage } from '../pages/registro/registro';
import { BusquedaPage } from '../pages/busqueda/busqueda';
import { ListaAfiliados } from '../pages/lista-afiliados/lista-afiliados';
import { ListaProductos } from '../pages/lista-productos/lista-productos';
import { Subcategories } from '../pages/subcategories/subcategories';
import { Compra } from '../pages/compra/compra';
import { PedidosRealizados } from '../pages/pedidos-realizados/pedidos-realizados';
import { PedidosRecibidos } from '../pages/pedidos-recibidos/pedidos-recibidos';
import { AuthService } from '../providers/auth-service';
import { RegisterService } from '../providers/register-service';
import { AfiliadoService } from '../providers/afiliado-service';
import { ProductoService } from '../providers/producto-service';
import { CompraService } from '../providers/compra-service';
import { PedidosAService } from '../providers/pedidosA-service';
import { PedidosRService } from '../providers/pedidosR-service';

import { Accordion, AccordionGroup} from '../pages/accordion';
import { Maps} from '../maps/maps';

@NgModule({
  declarations: [
    MyApp,
    InicioPage,
    RegistroPage,
    BusquedaPage,
    ListaAfiliados,
    ListaProductos,
    Accordion,
    AccordionGroup,
    Subcategories,
    Compra,
    PedidosRealizados,
    PedidosRecibidos,
    Maps
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InicioPage,
    RegistroPage,
    BusquedaPage,
    ListaAfiliados,
    ListaProductos,
    Accordion,
    AccordionGroup,
    Subcategories,
    Compra,
    PedidosRealizados,
    PedidosRecibidos,
    Maps
  ],
  providers: [AuthService, RegisterService, AfiliadoService, ProductoService, CompraService, PedidosAService,
    PedidosRService]
})
export class AppModule {}
