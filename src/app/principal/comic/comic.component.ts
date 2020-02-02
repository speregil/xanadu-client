import { Component, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import { MusicService } from '../../models/music.service';
import { UserService } from '../../models/user.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'comic',
  templateUrl: './comic.component.html',
  styleUrls: ['./comic.component.css']
})

/**
 * Componente que maneja el visor configurable del comic
 */
export class ComicComponent {
  
  //----------------------------------------------------------------------------------------------------------
  // Campos y Atributos
  //----------------------------------------------------------------------------------------------------------

  currentComic = "0";             // Atributo que identifica la pagina que se esta mostrando
  initComic = "0";                // Atributo que identifica la primera pagina de la secuencia
  lastComic = "0";                // Atributo que identifica la ultima pagina de la secuencia
  onLast = false;                 // Determina si el lector se encuetra en la última página o no
  onFirst = true;                 // Determina si el lector se encuetra en la primera página o no
  currentBg = "";                 // Atributo que identifica la musica de fondo que suena durante la secuencia
  bgSound = null;                 // Atributo que controla la musica de fondo

  //----------------------------------------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------------------------------------

  constructor(private userService: UserService, private router: Router, private app: AppComponent, music: MusicService){
    this.initComic = this.userService.getInitComic();
    this.lastComic = this.userService.getLastComic();
    this.currentComic = this.initComic;
    var currentBg = this.userService.getComicBg();
    music.setBg('/comic/' + currentBg);
    app.notifyBgChange();
  }

  //----------------------------------------------------------------------------------------------------------
  // Funciones
  //----------------------------------------------------------------------------------------------------------

  /**
   * Cambia la pagina actual a la siguiente en la secuencia y mueve la vista al ancla que entra por parametro
   * @param $element Ancla en el DOM hacia donde se mueve la ventana
   */
  onSig($element) {
    var current = Number(this.currentComic);
    var last = Number(this.lastComic);
    current++;
    if(current <= last) {
      this.currentComic = current + "";
    }

    if(current == last)
      this.onLast = true
    else
      this.onLast = false;

    this.onFirst = false

    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  /**
   * Cambia la pagina actual a la anterior en la secuencia
   */
  onPrev() {
    var current = Number(this.currentComic);
    var first = Number(this.initComic);
    this.onLast = false;
    current--;
    if(current >= first) {
      this.currentComic = current + "";
    }

    if(current == first) {
      this.onFirst = true;
    }
  }

  /**
   * Controla la asignación del logro por leer el comic basandose en la pagina inicial reportada
   */
  onContinue() {
    var initComic = this.userService.getInitComic();
    switch (initComic) {
      case '1' : {
        this.setAchivement(1);
        break;
      }
      case '17' : {
        this.setAchivement(2);
        break;
      }
      case '30' : {
        this.setAchivement(3);
        break;
      }
      default : {
        this.setRoute();
        break;
      }
    }
  }

  /**
   * Asigna el logro correspondiente basandose en el numero que recibe por parametro
   * @param achivementNum Version del logro que se va aasignar
   */
  setAchivement(achivementNum) {
    var text = '';
    var points = 0;
    var currentUser = this.userService.getUserLoggedIn();
    if(currentUser) {
      if(achivementNum == 1) {
          text = 'Has leído la primera parte del Cómic';
          points = 20;
          this.saveAchivement(currentUser, text, points);
      }
      else if(achivementNum == 2) {
        text = 'Has leído los capitulos centrales del Cómic';
        points = 20;
        this.saveAchivement(currentUser, text, points);
      }
      else if(achivementNum == 3) {
        text = 'Has leído el desenlace del cómic';
        points = 20;
        this.saveAchivement(currentUser, text, points);
      }
      else {
        this.setRoute();
      }
    }
    else
      this.setRoute();
  }

  /**
   * Salva el logro al usuario en sesión con los datos que entran por parámetro
   * @param user Usuario en la sesión
   * @param text Texto del logro a guardar
   * @param points Puntos del logro a guardar
   */
  saveAchivement(user, text, points){
    if(this.userService.checkUserAchivements(user, text)){
      this.userService.setAchivement(user.username, text, points).subscribe(response => {
        if(response['status'] > 0) {
          alert(response['mensaje']);
          this.setRoute();
        }
        else {
          alert("Logro obtenido: " + text);
          this.userService.localUpdateAchivemets(user, text, points);
          this.userService.checkLevel(user, updated => {
            if(updated){
              alert("Aumentaste de nivel");
              this.app.updateLogin();
            }
          });
          this.setRoute();
        }
      });  
    }
    else
    this.setRoute();
  }

  /**
   * Navega a la página pricipal
   */
  setRoute() {
    this.router.navigate(["roles"]);
  }
}