import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { DownloadService } from '../models/downloads.service';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'arqueologia-taller',
  templateUrl: './taller.arqueologia.html',
  styleUrls: ['./arqueologo.component.css']
})
/**
 * Componente que controla la asignación del taller del arqueología al usuario
 */
export class TallerComponent {
 
  //------------------------------------------------------------------------------------------
  // Campos y Atributos
  //------------------------------------------------------------------------------------------

  basicAble = true;                                       // Determina si es posible aceptar el taller o no
  cargando = true;                                        // Determina si la pagina está cargando contenido o no
  msn = "Para comenzar la activdad, presiona ACEPTAR";    // Campo que guarda el estado del procedimiento actual

  //------------------------------------------------------------------------------------------
  // Constructor
  //------------------------------------------------------------------------------------------

  constructor(private userService: UserService, private router: Router, private download: DownloadService, music: MusicService, private principal: AppComponent) {
    this.msn = "Cargando";
    music.setBg("");
    principal.notifyBgChange();

    var user = this.userService.getUserLoggedIn();
    this.userService.getProgressState(user.username, 'tallerAsig').subscribe(response => {
        if(response['flag']){
          this.basicAble = false;
        }
        this.cargando = false;
        this.msn = "Para comenzar la actividad, presiona ACEPTAR";

        this.userService.updateRole(user.username, "Arqueologo").subscribe(response => {
          if(response["status"] == 0) {
            user.currentRol = "Arqueologo";
            userService.setUserLoggedIn(user);
            principal.updateLogin();
          }
        });
    });
  }

  //------------------------------------------------------------------------------------------
  // Funciones
  //------------------------------------------------------------------------------------------

  /**
   * Procedimiento para descargar el taller de exploración y crear el reto en la lista del usuario en sesion
   * Reporta el estado del procedimiento en el campo msn
   */
  onAccept(){
    if(this.basicAble && !this.cargando) {
      var user = this.userService.getUserLoggedIn();
      this.msn = "Espera un momento por favor...";
      this.cargando = true;
      this.userService.addChallenge(user.username, 'taller', "Debes explorar los contenidos digitales rescatados de unos antiguos servidores que se creian perdidos").subscribe(response => {
        if(response['mensaje'])
          this.msn = response['mensaje'];
        else {
          this.userService.saveProgress(user.username, "tallerAsig").subscribe(response => { 
            this.onDownload();
            
          });
        }
      });
    }
    else{
      this.msn = "Ya aceptaste o completaste este reto";
    }
  }

  /**
   * Procedimiento para descargar el documento con las instrucciones del taller
   * Reporta el estado del procedimiento en el campo msn
   */
  onDownload(){
    var url = 'assets/static/laboratorio/taller.pdf';
    this.msn = "Reto Aceptado"
    this.basicAble = false;
    this.cargando = false;
    this.download.downloadFile(url).subscribe(response => {
      window.open(response.url, "_blank");
		}), error => this.msn = error
  }

  /**
   * Navega al menu principal
   */
  onContinue(){
    this.router.navigate(['roles']);
  }
}