import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { PortadaComponent } from './principal/portada.component';
import { RolesComponent } from './principal/roles.component';
import { AjustesComponent } from './principal/registro/ajustes.component';
import { CreditosComponent } from './principal/creditos/creditos.component';
import { InstruccionesComponent } from './principal/instrucciones/instrucciones.component';
import { ComicComponent } from './principal/comic/comic.component';
import { LogrosComponent } from './principal/logros/logros.component';
import { LaboratorioComponent } from './arqueologo/laboratorio.arqueologia';
import { TallerComponent } from './arqueologo/taller.arqueologia';
import { DeliberatoriumComponent } from './arqueologo/deliberatorium.arqueologia';
import { JuglarComponent } from './juglar/juglar.component';
import { MainFuturologoComponent } from './futurologo/mainFuturologo.component';
import { InvestigadorComponent } from './investigador/investigador.component';
import { InterpreteComponent } from './interprete/interprete.component';

import { AppRoutingModule } from './/app-routing.module';

import { PrimeraAnimacionComponent } from './principal/animaciones/primera.component';
import { IntroFuturologoComponent } from './principal/animaciones/introFuturologo.component';
import { IntroOraculoComponent } from './principal/animaciones/introOraculo.component';
import { IntroLaboratorioComponent } from './principal/animaciones/introLaboratorio.component';
import { IntroDeliberatoriumComponent } from './principal/animaciones/introDeliberatorium.component';
import { IntroJuglarComponent } from './principal/animaciones/introJuglar.component';
import { IntroInvestigadorComponent } from './principal/animaciones/introInvestigador.component';
import { IntroInterpreteComponent } from './principal/animaciones/introInterprete.component';

import { UserService } from './models/user.service';
import { MusicService } from './models/music.service';
import { ChallengesService } from './models/challenges.service';
import { DownloadService } from './models/downloads.service';
import { RegistroService } from './principal/registro/registro.service';
import { ConfigurationService } from './models/configuration.service';

@NgModule({
  declarations: [
    AppComponent,
    AjustesComponent,
    PortadaComponent,
    RolesComponent,
    CreditosComponent,
    InstruccionesComponent,
    ComicComponent,
    LogrosComponent,
    LaboratorioComponent,
    TallerComponent,
    DeliberatoriumComponent,
    JuglarComponent,
    MainFuturologoComponent,
    InvestigadorComponent,
    InterpreteComponent,
    PrimeraAnimacionComponent,
    IntroFuturologoComponent,
    IntroOraculoComponent,
    IntroLaboratorioComponent,
    IntroDeliberatoriumComponent,
    IntroJuglarComponent,
    IntroInvestigadorComponent,
    IntroInterpreteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    UserService,
    MusicService,
    ChallengesService,
    DownloadService,
    RegistroService,
    ConfigurationService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
