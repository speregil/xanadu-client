import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { ChallengesService } from '../models/challenges.service';
import { HttpClient } from '@angular/common/http';
import { DownloadService } from '../models/downloads.service';
import { MusicService } from '../models/music.service';

@Component({
  selector: 'magis',
  templateUrl: './magis.component.html',
  styleUrls: ['./magis.component.css']
})

/**
 * Componente del menu final de la experienci
 */
export class MagisComponent {
    //---------------------------------------------------------------------------------------------
    // Campos y Atributos
    //---------------------------------------------------------------------------------------------

    creando = false;        // Determina si el magis está creando un nuevo reto o no
    tipoSeleccionado = ""   // Campo para el tipo de reto seleccionado
    descripcion = ""        // Campo para la descripción del reto
    msn = ""                // Mensaje de la operación de crear reto
    listaRetos = []         // Lista de retos del Magis

    //---------------------------------------------------------------------------------------------
    // Constructor
    //---------------------------------------------------------------------------------------------

    constructor(private userService: UserService, private principal: AppComponent, private router: Router, private http: HttpClient, private download: DownloadService, music: MusicService, private challenges: ChallengesService) {
        music.setBg('menu/menu-6.mp3');
        principal.notifyBgChange();
        this.getRetos();
    }

    onDownload(url){
        this.download.downloadFile(url).subscribe(response => {
          window.open(response.url, "_blank");
        }), error => console.log(error);
    }

    onPDFViewer(url){
      window.open(url, "_blank");
    }

    onContinue( route ) {
        this.router.navigate([route]);
    }

    onCrear(){
      this.creando = !this.creando;
    }

    onLimpiar(){
      this.tipoSeleccionado = "";
      this.descripcion = "";
      this.msn = "";
    }
    
    onAccept(){
      if(this.tipoSeleccionado && this.descripcion){
        this.msn = "Creando..."
        var magis = this.userService.getUserLoggedIn();
        this.challenges.createChallenge(magis.username,this.tipoSeleccionado,this.descripcion).subscribe(response => {
          this.msn = response["mensaje"];
          this.getRetos()
        });
      }
      else
        this.msn = "Los campos no deben estar vacíos"
    }

    getRetos(){
      var magis = this.userService.getUserLoggedIn();
      this.challenges.getUserChallenges(magis.username).subscribe(response => {
        this.listaRetos = response["list"]
      });
    }
}