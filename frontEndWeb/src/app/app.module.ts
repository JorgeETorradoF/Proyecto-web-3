import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor'

import { AppComponent } from './app.component';
import { ContratosArrendadorComponent } from './arrendador/contratos-arrendador/contratos-arrendador.component';
import { ContratosArrendatarioComponent } from './arrendatario/contratos-arrendatario/contratos-arrendatario.component';
import { PropiedadesArrendadorComponent } from './arrendador/propiedades-arrendador/propiedades-arrendador.component';
import { CrearPropiedadComponent } from './arrendador/propiedades-arrendador/crear-propiedad/crear-propiedad.component';
import { LoginRegisterComponent } from './Landing-Page/login-register/login-register.component';
import { DetallePropiedadComponent } from './arrendador/propiedades-arrendador/detalle-propiedad/detalle-propiedad.component';
import { EditarPropiedadComponent } from './arrendador/propiedades-arrendador/editar-propiedad/editar-propiedad.component';
import { PrincipalArrendatarioComponent } from './arrendatario/principal-arrendatario/principal-arrendatario.component';
import { CalificarArrendadorComponent } from './arrendatario/calificar-arrendador/calificar-arrendador.component';
import { CalificarArrendatarioComponent } from './arrendador/calificar-arrendatario/calificar-arrendatario.component';
import { PaginaPrincipalComponent } from './Landing-Page/pagina-principal/pagina-principal.component';
import { NavbarComponent } from './Landing-Page/navbar/navbar.component';
import { HomeComponent } from './Landing-Page/home/home.component';
import { AboutUsComponent } from './Landing-Page/about-us/about-us.component';
import { FooterComponent } from './Landing-Page/footer/footer.component'
import { DetallePropiedadArrendatarioComponent } from './arrendatario/detalle-propiedad-arrendatario/detalle-propiedad-arrendatario.component';
import { SolicitarArriendoComponent } from './arrendatario/solicitar-arriendo/solicitar-arriendo.component';
import { WikiGroupComponent } from './Landing-Page/wiki-group/wiki-group.component';
import { NavbarArrendadorComponent } from './arrendador/navbar-arrendador/navbar-arrendador.component';
import { FooterArrendadorComponent } from './arrendador/footer-arrendador/footer-arrendador.component';
import { PrincipalArrendadorComponent } from './arrendador/principal-arrendador/principal-arrendador.component';
import { NavbarArrendatarioComponent } from './arrendatario/navbar-arrendatario/navbar-arrendatario.component';
import { FooterArrendatarioComponent } from './arrendatario/footer-arrendatario/footer-arrendatario.component';


@NgModule({
  declarations: [
    AppComponent,
    ContratosArrendadorComponent,
    ContratosArrendatarioComponent,
    CrearPropiedadComponent,
    PropiedadesArrendadorComponent,
    LoginRegisterComponent,
    DetallePropiedadComponent,
    EditarPropiedadComponent,
    PrincipalArrendatarioComponent,
    CalificarArrendadorComponent,
    CalificarArrendatarioComponent,
    PaginaPrincipalComponent,
    NavbarComponent,
    HomeComponent,
    AboutUsComponent,
    FooterComponent,
    DetallePropiedadArrendatarioComponent,
    SolicitarArriendoComponent,
    WikiGroupComponent,
    FooterArrendadorComponent,
    PrincipalArrendadorComponent,
    NavbarArrendadorComponent,
    NavbarArrendatarioComponent,
    FooterArrendatarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
