import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { LoginObserver } from '../models/loginObserver.interface';
import { HttpClient } from '@angular/common/http';
import { DownloadService } from '../models/downloads.service';
import { MusicService } from '../models/music.service';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})

/**
 * Componente del menu principal y progreso de la aplicación
 */
export class RolesComponent implements LoginObserver {

  //----------------------------------------------------------------------------------------------------------
  // Campos y Atributos
  //----------------------------------------------------------------------------------------------------------

  isLogged : boolean;           // Atributo que determina si hay un usuario en sesión

  // Visor del avatar
  currentRol = 'cargando';      // Atributo que guarda el rol actual del usuario
  currentText = "";             // Atributo que guard el tecto descriptivo del rol actual

  // Flags para el progreso de las expansiones
  basico = false;              
  intermedio = false;
  experto = false;
  master = false;

  // Flags para el progreso de los elementos de colección
  jar = false;
  cronica = false;
  comic2 = false;
  comic3 = false;
  novela = false;
  ensayo = false;
  final = false;

  // Sección de retos
  msnRetos = "Cargando...";     // Atributo para mostrar el estado de carga de los retos del usuario
  txtReto = "";                 // Atributo que guarda el texto descriptivo del reto actual seleccionado
  retos = [];                   // Atributo que guarda la lista de retos del usuario en sesión

  bgSound = null;               // Atributo que controla la música de fondo

  //----------------------------------------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------------------------------------

  constructor(private userService: UserService, private principal: AppComponent, private router: Router, private http: HttpClient, private download: DownloadService, music: MusicService) {
    this.isLogged = this.userService.isUserLogged();
    this.principal.addLoginObserver(this);
    music.setBg('snd_portada.mp3');
    principal.notifyBgChange();
    this.showRoleProgress();
    this.getCurrentRol();
    this.getChallenges();
  }

  //----------------------------------------------------------------------------------------------------------
  // Funciones
  //----------------------------------------------------------------------------------------------------------

  /**
   * Función que se llama cuando se notifica la entrada o salida del sistema de un usuario
   * @param logged Determina si el usuario entró o salió de la sesión
   */
  notifyLogin(logged: boolean): void {
    this.isLogged = logged;
    this.showRoleProgress();
    this.getCurrentRol();
  }

  /**
   * Recupera el rol actual del usuario en sesión y los ajusta al género del avatar seleccionado
   */
  getCurrentRol() {
    if(this.isLogged){
      var user = this.userService.getUserLoggedIn();
      this.currentRol = user.currentGender + '-' + user.currentRol.toLowerCase();
      this.http.get('assets/static/avatar/' + user.currentRol.toLowerCase() + '.txt', {responseType: 'text'}).subscribe(data => this.currentText = data);
    }
  }

  /**
   * Actualiza las flags de progeso basado en la información del usuario en sesión
   */
  showRoleProgress() {
    if(this.isLogged) {
      var user = this.userService.getUserLoggedIn();
      this.userService.getProgressProfile(user.username).subscribe(response => {
        if(response["status"] == 0) {
          var progress = response["progOb"];
          this.basico = progress["vidente"] && progress["juglar"];
          this.jar = progress["vidente"] && progress["juglar"];
          this.comic2 = progress["vidente"] && progress["juglar"];
          this.intermedio = progress["taller"];
          this.experto =  progress["arqueologo"];
          this.comic3 = progress["arqueologo"];
          this.cronica = progress["periodistaAsig"];
          this.master =  progress["periodista"];
          this.novela =  progress["periodista"];
          this.ensayo =  progress["criticoAsig"];
          this.final = progress["critico"];
        }
      });
    }
  }

  /**
   * Navega hacia la página que entra por parámetro
   * @param route Página a la que se desea navegar
   */
  onContinue( route ) {
    this.router.navigate([route]);
  }

  /**
   * Recupera los retos asignados al usuario en sesión y los carga en la ventana
   */
  getChallenges() {
    if(this.isLogged) {
      var user = this.userService.getUserLoggedIn();
      this.userService.getChallenges(user.username).subscribe(response => {
        if(response['mensaje'])
          this.msnRetos = response['mensaje'];
        else {
          this.msnRetos = '';
          this.retos = response['list'];
        }
      });
    }
  }

  /**
   * Asigna el texto que entra por parámetro al atributo del texto descriptivo del reto seleccionado
   * @param text Texto descriptivo del reto seleccionado
   */
  onChallenge( text ) {
    this.txtReto = text;
  }

  /**
   * Navega hacia el componente del comic, ajustando la secuencia de paginas dependiendo del numero que entra por parámetro
   * @param chapter Capitulo que determina la secuecia de páginas en el componente del comic
   */
  onComic(chapter){
    switch( chapter ) {
      case 1:
        this.userService.setInitComic("1");
        this.userService.setLastComic("15");
        this.userService.setComicBg(1);
        this.router.navigate(['comic']);
        break;
      case 2:
        this.userService.setInitComic("16");
        this.userService.setLastComic("28");
        this.userService.setComicBg(2);
        this.router.navigate(['comic']);
        break;
      case 3:
        this.userService.setInitComic("29");
        this.userService.setLastComic("45");
        this.userService.setComicBg(3);
        this.router.navigate(['comic']);
        break;  
    }
  }

  /**
   * Controla el proceso de descarga del archivo cuya dirección url entra por parámetro
   * @param url Dirección del archivo que se desea descargar
   */
  onDownload(url){
    this.download.downloadFile(url).subscribe(response => {
      window.open(response.url, "_blank");
    }), error => console.log(error);
  }

  onPDFViewer(url){
    window.open(url, "_blank");
  }
}