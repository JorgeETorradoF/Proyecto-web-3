import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratosArrendadorComponent } from './arrendador/contratos-arrendador/contratos-arrendador.component';
import { LoginRegisterComponent } from './Landing-Page/login-register/login-register.component';
import { ContratosArrendatarioComponent } from './arrendatario/contratos-arrendatario/contratos-arrendatario.component';
import { PrincipalArrendadorComponent } from './arrendador/principal-arrendador/principal-arrendador.component';
import { PrincipalArrendatarioComponent } from './arrendatario/principal-arrendatario/principal-arrendatario.component';
import { PropiedadesArrendadorComponent } from './arrendador/propiedades-arrendador/propiedades-arrendador.component';
import { CrearPropiedadComponent } from './arrendador/propiedades-arrendador/crear-propiedad/crear-propiedad.component';
import { DetallePropiedadComponent } from './arrendador/propiedades-arrendador/detalle-propiedad/detalle-propiedad.component';
import { EditarPropiedadComponent } from './arrendador/propiedades-arrendador/editar-propiedad/editar-propiedad.component';
import { SolicitarArriendoComponent } from './arrendatario/solicitar-arriendo/solicitar-arriendo.component';
import { CalificarArrendadorComponent } from './arrendatario/calificar-arrendador/calificar-arrendador.component';
import { CalificarArrendatarioComponent } from './arrendador/calificar-arrendatario/calificar-arrendatario.component';
import { PaginaPrincipalComponent } from './Landing-Page/pagina-principal/pagina-principal.component';
import { DetallePropiedadArrendatarioComponent } from './arrendatario/detalle-propiedad-arrendatario/detalle-propiedad-arrendatario.component';

const routes: Routes = [
  { path: '', component: PaginaPrincipalComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'arrendador/contratos', component: ContratosArrendadorComponent },
  { path: 'arrendatario/contratos', component: ContratosArrendatarioComponent },
  { path: 'arrendador', component: PrincipalArrendadorComponent },
  { path: 'arrendatario', component: PrincipalArrendatarioComponent },
  { path: 'arrendador/propiedades', component: PropiedadesArrendadorComponent },
  { path: 'arrendador/propiedades/crear-propiedad', component: CrearPropiedadComponent },
  { path: 'arrendador/propiedades/detalle-propiedad/:idPropiedad', component: DetallePropiedadComponent },
  { path: 'arrendador/propiedades/editar-propiedad/:idPropiedad', component: EditarPropiedadComponent },
  { path: 'arrendatario/solicitar-arriendo/:idPropiedad', component: SolicitarArriendoComponent },
  { path: 'arrendatario/calificar', component: CalificarArrendadorComponent },
  { path: 'arrendador/calificar', component: CalificarArrendatarioComponent },
  { path: 'arrendatario/detalle-propiedad/:idPropiedad', component: DetallePropiedadArrendatarioComponent },
  { path: 'detalle-propiedad/:idPropiedad', component: DetallePropiedadArrendatarioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
