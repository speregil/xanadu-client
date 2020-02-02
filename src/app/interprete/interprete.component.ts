import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { DownloadService } from '../models/downloads.service';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'interprete',
  templateUrl: './interprete.component.html',
  styleUrls: ['./interprete.component.css']
})

/**
 * Componente que controla el cuestionario del Critico
 */
export class InterpreteComponent {

  //------------------------------------------------------------------------------------------------------
  // Campos y Atributos
  //------------------------------------------------------------------------------------------------------

  msn = "";                                                                                       // Campo donde se guarda el estado del proceso actual
  selectedAnswers = ["a","a","a","a","a","a","a","a"];                                            // Campo que guarda las respuestas seleccionadas por el usuario
  questionState = ["normal","normal","normal","normal","normal","normal","normal","normal"];      // Campo que guarda el estado de las preguntas verificadas

  correctAnswers = ["c","a","c","a","b","b","c","c"];                                             // Atributo que guarda las respuesta correctas del cuestionario
  basicAble = true;                                                                               // Atributo que determina si es posible realizar la actividad o no
  cargando = true;                                                                                // Atributo que determina si la pagina esta cargando algo o no

  //------------------------------------------------------------------------------------------------------
  // Constructor
  //------------------------------------------------------------------------------------------------------

  constructor(private userService: UserService, private router: Router, private download: DownloadService, music: MusicService, private principal: AppComponent) {
    this.msn = "Cargando...";
    music.setBg("");
    principal.notifyBgChange(); 
    var user = this.userService.getUserLoggedIn();
    this.userService.getProgressState(user.username, 'criticoAsig').subscribe(response => {
        if(response['flag']){
          this.basicAble = false;
        }
        this.cargando = false;
        this.msn = "";
    });
  }
  
  //------------------------------------------------------------------------------------------------------
  // Funciones
  //------------------------------------------------------------------------------------------------------

  /**
   * Compara las respuestas del usuario con las correctas y guarda el logro en caso de ser todas correctas
   * Reporta en el campo msn si hay respuestas incorrectas dado el caso
   */
  verify(){
    if(this.basicAble && !this.cargando){  
      var allCorrect = true;
      for(var i = 0; i < this.selectedAnswers.length; i++){
        if(this.selectedAnswers[i] == this.correctAnswers[i])
          this.questionState[i] = "correct";
        else{
          this.questionState[i] = "incorrect";
          allCorrect = false;
        }
      }

      if(allCorrect){
        this.msn = 'Respuestas Correctas';
        this.setAchivement();
        this.setChallange();
      }
      else
        this.msn = "Hay respuestas incorrectas";
    }
    else{
      this.msn = "Ya completaste este reto";
    }
  }

  /**
   * Guarda el logro correspondiente al usuario que se encuentra en sesion
   * Alerta del estado del proceso
   */
  private setAchivement(){
    var user = this.userService.getUserLoggedIn();
    if(this.userService.checkUserAchivements(user, "Has contestado el cuestionario sobre la novela")){
      this.userService.setAchivement(user.username, "Has contestado el cuestionario sobre la novela", 20).subscribe(response => {
        if(response['mensaje'])
          alert(response['mensaje']);
        else {
          this.userService.localUpdateAchivemets(user, "Has contestado el cuestionario sobre la novela", 20);
          this.userService.checkLevel(user, function(updated){});
          alert("Logro desbloqueado: Has contestado el cuestionario sobre la novela");  
        }
      });
    }
  }

  /**
   * Guarda el nuevo reto asociado al critico si se contestaron todas las preguntas correctamente
   * Reporta el estado del proceso en el campo msn
   */
  setChallange(){
    this.msn = "No te vayas todavia...";
    var user = this.userService.getUserLoggedIn();
    this.userService.addChallenge(user.username, 'critico', "Como crítico, vas a analizar los eventos descubiertos por J'Martín y sus compañeros para escribir un ensayo que explore las implicaciones eticas y sociales de los planes de Xanadú.").subscribe(response => {
      if(response['mensaje'])
        this.msn = response['mensaje'];
      else {
        this.userService.saveProgress(user.username, "criticoAsig").subscribe(response => { 
          this.onDownload();
        });
      }
    });
  }

  /**
   * Navega al menu principal
   */
  onContinue() {
    this.router.navigate(["roles"]); 
  }

  /**
   * Reinicia todas las respuestas del usuario
   */
  onReset() {
    this.selectedAnswers = ["a","a","a","a","a","a","a","a"];
    this.questionState = ["normal","normal","normal","normal","normal","normal","normal","normal"];
  }

  /**
   * Procedimiento que descarga la plantilla del ensayo
   * Reporta el estado del proceso en el campo msn
   */
  onDownload(){
    var url = './assets/static/critico/ensayo.pdf';
    this.msn = "Tienes un nuevo reto";
    this.basicAble = false;
    this.cargando = false;
    this.download.downloadFile(url).subscribe(response => {
      window.location.href = response.url;
		}), error => this.msn = error
  }
}