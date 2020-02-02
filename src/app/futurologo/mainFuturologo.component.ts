import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { UserService } from '../models/user.service';
import { ChallengesService } from '../models/challenges.service';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'interacciones',
  templateUrl: './mainFuturologo.component.html',
  styleUrls: ['./mainFuturologo.component.css']
})
/**
 * Componente que controla la experiencia del Oráculo
 */
export class MainFuturologoComponent {

  //-------------------------------------------------------------------------------------------------
  // Atributos y Campos
  //-------------------------------------------------------------------------------------------------

  retoActual = "";                      // Campo que contiene el texto del reto que actualmente se está mostrando
  msnAceptar = "";                      // Campo que contiene el estado actual del procedimiento registrado

  masterChallenges = [];                // Atributo que modela la lista de retos hechos por el master
  cargando = true;                      // Bandera para indicar que la experiencia está cargando datos
  basico = true;                        // Bandera que determina que se pueden aceptar retos básicos
  basicAble = true;                     // Bandera que determina que es posible interactuar con el oraculo
  masterAble = false;                   // Bandera que determina si es posible aceptar retos del master
  acceptAble = false;                   // Bandera que determina si es posible aceptar el reto actual

  poolBasico = "selected";              // Determina si el usuario está usando los retos básicos
  poolMaster = "vidente-button";        // Determina si el usuario está usando los retos del master

  bgSound = null;                       // Atributo que modela el sonido de fondo

  //-------------------------------------------------------------------------------------------------
  // Constructor
  //-------------------------------------------------------------------------------------------------

  constructor(private userService: UserService, private router: Router, private http: HttpClient, private challenges: ChallengesService, music: MusicService, private principal: AppComponent) {
    this.msnAceptar = "Cargando";

    music.setBg("oraculo.mp3");
    principal.notifyBgChange(); 


    var user = this.userService.getUserLoggedIn();
    this.userService.getProgressState(user.username, 'videnteAsig').subscribe(response => {
        if(response['flag']){
          this.basicAble = false;
        }
        else{
          this.challenges.getMasterChallenges('oraculo').subscribe(response => {
            if(response['mensaje'] == null){
              this.masterChallenges = response['list'];
              this.masterAble = true;
            }
          });
        }
        this.cargando = false;
        this.msnAceptar = '';
    });
  }
  
  //-------------------------------------------------------------------------------------------------
  // Funciones
  //-------------------------------------------------------------------------------------------------

  /**
   * Procedimiento para mostrar un reto al azar del pool seleccionado
   * Coloca eb retoActual el texto del reto recuperado
   */
  onOracleClick() {
    if(!this.cargando){
      if(this.userService.isUserLogged() && this.basicAble) {
        this.retoActual = "Procesando...";
        this.acceptAble = false;
        if(this.basico)
          this.getBasicChallenge();
        else
          this.getMasterChallenge();
      }
      else
        this.retoActual = 'Ya tienes un reto asignado o ya lo completaste';
    }
  }

  /**
   * Procedimiento para buscar en el sistema un reto del pool basico
   */
  getBasicChallenge(){
    this.http.get('assets/static/oraculo/config.json', {responseType: 'json'}).subscribe(data => {
      var len = parseInt(data["num"]);
      var i = Math.floor(Math.random() * len) + 1;
      this.http.get('assets/static/oraculo/oraculo' + i + '.txt', {responseType: 'text'}).subscribe(txt => {
        this.retoActual = txt
        this.acceptAble = true;
      });
    });
  }

  /**
   * Procedimiento para buscar en el sistema un reto del pool del master
   */
  getMasterChallenge(){
    var i = Math.floor(Math.random() * this.masterChallenges.length);
    var challenge = this.masterChallenges[i];
    this.retoActual = challenge.text;
    this.acceptAble = true;
  }

  /**
   * Procedimeinto para aceptar el reto actual y registrarlo en al lista de retos del usuario actual
   * El reto solo se acepta si no se ha aceptado un reto del mismo tipo previamente
   */
  onAccept() {
    if(this.basicAble && !this.cargando) {
      var user = this.userService.getUserLoggedIn();
      this.msnAceptar = "Guardando...";
      this.cargando = true;
      this.userService.addChallenge(user.username, 'vidente', this.retoActual).subscribe(response => {
        if(response['mensaje'])
          this.msnAceptar = response['mensaje'];
        else {
          this.userService.saveProgress(user.username, "videnteAsig").subscribe(response => { 
            this.msnAceptar = "Reto Aceptado"
            this.basicAble = false;
            this.masterAble = false;
            this.acceptAble = false;
            this.cargando = false;
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
      this.poolMaster = "vidente-button";
      this.basico = true;
    }
    else {
      this.poolBasico = "vidente-button";
      this.poolMaster = "selected";
      this.basico = false;
    }
  }

  /**
   * Navega hacia el menu principal
   */
  onContinue() {  
    this.router.navigate(["roles"]);
  }
}