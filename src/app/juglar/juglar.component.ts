import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { ChallengesService } from '../models/challenges.service';
import { HttpClient } from '@angular/common/http';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'juglar',
  templateUrl: './juglar.component.html',
  styleUrls: ['./juglar.component.css']
})
/**
 * Componente que controla la experiencia del juglar
 */
export class JuglarComponent {
  
  //---------------------------------------------------------------------------------------------
  // Atributos y Campos
  //---------------------------------------------------------------------------------------------

  perfilActual = "";                        // Campo que guarda el texto del perfil actual seleccionado
  retoActual = "";                          // Campo que guarda el texto del reto actual seleccionado
  msnAceptar = "";                          // Campo que guarda el estado del procedimiento actual

  masterChallenges = [];                    // Atributo que determina la lista de retos hechos por el master
  cargando = true;                          // Bandera para determinar que la expericia está cargando algo
  basico = true;                            // Bandera que determina si es posible seleccionar retos en la experiencia
  basicAble = true;                         // Bandera que determina si es posible seleccionar retos del basicos
  masterAble = false;                       // Bandera que determina si es posible seleccionar retos del master
  acceptAble = false;                       // Bandera que determina si es posible aceptar el reto actual

  poolBasico = "selected";                  // Atributo que determina si se estan seleccionado retos del pool básico 
  poolMaster = "juglar-button";             // Atributo que determina si se están seleccionado retos del pool del master

  //---------------------------------------------------------------------------------------------
  // Constructor
  //---------------------------------------------------------------------------------------------

  constructor(private userService: UserService, private router: Router, private http: HttpClient, private challenges: ChallengesService, music: MusicService, private principal: AppComponent) {
    
    this.msnAceptar = "Cargando";
    music.setBg("mosca.mp3");
    principal.notifyBgChange();  
    
    var user = this.userService.getUserLoggedIn();
    this.userService.getProgressState(user.username, 'juglarAsig').subscribe(response => {
        if(response['flag']){
          this.basicAble = false;
        }
        else{
          this.challenges.getMasterChallenges('juglar').subscribe(response => {
            if(response['mensaje'] == null && response['list'].length > 0){
              this.masterChallenges = response['list'];
              this.masterAble = true;
            }
          });
        }
        this.cargando = false;
        this.msnAceptar = '';
    });
  }

  //---------------------------------------------------------------------------------------------
  // Funciones
  //---------------------------------------------------------------------------------------------

  /**
   * Muestra un reto al azar del la lista de retos del folder que entra por parámetro
   * @param folder Personaje del que se desea sacar un reto al azar
   * El texto del nuevo reto se guarda  en el campo retoActual
   */
  onFolderClick( folder ) {
    if(!this.cargando && this.basicAble) {
      this.retoActual = "Procesando...";
      this.acceptAble = false;
      if(this.basico)
        this.getBasicChallenge( folder );
      else
        this.getMasterChallenge();
    }
    else{
      this.perfilActual = " ";
      this.retoActual = "Ya aceptaste o completaste un reto en esta sección";
    }
  }

  /**
   * Recupera un reto basico del personaje que entra por parámetro
   * @param folder Personaje del que se desea recuperar el reto
   */
  getBasicChallenge( folder ){
    
    this.http.get('assets/static/juglar/' + folder + '/' + folder + '.txt', {responseType: 'text'}).subscribe(perfil => {
        this.perfilActual = perfil;
    });

    this.http.get('assets/static/juglar/config.json', {responseType: 'json'}).subscribe(data => {
      var len = parseInt(data["num"]);
      var i = Math.floor(Math.random() * len) + 1;
      this.http.get('assets/static/juglar/' + folder + '/' + folder + i + '.txt', {responseType: 'text'}).subscribe(txt => {
        this.retoActual = txt;
        this.acceptAble = true;
      });
    });
  }

  /**
   * Recupera un reto del pool de retos del master
   */
  getMasterChallenge(){
    var i = Math.floor(Math.random() * this.masterChallenges.length);
    var challenge = this.masterChallenges[i];
    this.retoActual = challenge.text;
    this.perfilActual = " ";
    this.acceptAble = true;
  }

  /**
   * Acepta el reto actual y lo agrega a la lista de retos del usuario en sesión
   * Reporta el resultado de la operación en el campo msnAceptar
   */
  onAccept() {
    if(this.basicAble && !this.cargando) {
      this.msnAceptar = "Guardando...";
      var user = this.userService.getUserLoggedIn();
      this.userService.addChallenge(user.username, 'juglar', this.retoActual).subscribe(response => {
        if(response['mensaje'])
          this.msnAceptar = response['mensaje'];
        else {
          this.userService.saveProgress(user.username, "juglarAsig").subscribe(response => { 
            this.msnAceptar = "Reto Aceptado"
            this.basicAble = false;
            this.masterAble = false;
            this.acceptAble = false;
            this.cargando = false;

            this.userService.setInitComic("16");
            this.userService.setLastComic("28");
            this.userService.setComicBg(2);
            this.router.navigate(['comic']);
          });
        }
      });
    }
  }

  /**
   * Cambia el pool del retos a elegir por aquel que entra por parametro
   * @param nPool Nuevo pool a elegir basico o master
   */
  changePool(nPool){
    if(nPool == 'basico'){
      this.poolBasico = "selected";
      this.poolMaster = "juglar-button";
      this.basico = true;
    }
    else {
      this.poolBasico = "juglar-button";
      this.poolMaster = "selected";
      this.basico = false;
    }
  }

  /**
   * Navega al menu principal
   */
  onContinue() {
    this.router.navigate(["roles"]);
  }
}