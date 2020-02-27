import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { DownloadService } from '../models/downloads.service';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'investigador',
  templateUrl: './investigador.component.html',
  styleUrls: ['./investigador.component.css']
})

/**
 * Componente que controla el cuestionario del reportero
 */
export class InvestigadorComponent {

  //--------------------------------------------------------------------------------------------
  // Campos y Atributos
  //--------------------------------------------------------------------------------------------

  msn = "";                                                                                       // Campo que guarda el resultado del procedimiento actual
  selectedAnswers = ["a","a","a","a","a","a","a","a"];                                            // Arreglo que guarda la selección actual de las 8 preguntas

  correctAnswers = ["c","a","c","a","b","b","c","c"];                                             // Atributo que guarda las respuestas correctas de las 8 preguntas
  questionState = ["normal","normal","normal","normal","normal","normal","normal","normal"];      // Atributo que guarda el estado, correcto, incorrecto o sin contestas, de las 8 preguntas
  basicAble = true;                                                                               // Atributo que determina si es posible hacer la actividad o no
  cargando = true;                                                                                // Atributo que determina si la página está cargando algo o no

  //--------------------------------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------------------------------

  constructor(private userService: UserService, private router: Router, private download: DownloadService, music: MusicService, private principal: AppComponent) {
    this.msn = "Cargando...";
    music.setBg("");
    principal.notifyBgChange();
    var user = this.userService.getUserLoggedIn();
    this.userService.getProgressState(user.username, 'periodistaAsig').subscribe(response => {
        if(response['flag']){
          this.basicAble = false;
        }
        this.cargando = false;
        this.msn = "";
    });
  }
  
  //--------------------------------------------------------------------------------------------
  // Funciones
  //--------------------------------------------------------------------------------------------

  /**
   * Procedimiento que compara las respuestas actuales con el registro de respuestas correctas
   * Alerta de la cantidad de respuestas correctas. Lanza el procedimiento para guardar el avance si todo es correcto
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
      }
      else
        this.msn = "Hay respuestas incorrectas";
    }
  }

  /**
   * Procedimiento para guardar el logro asociado a completar el cuestionario
   * Alerta del resultado de la operación
   */
  private setAchivement(){
    var user = this.userService.getUserLoggedIn();
    if(this.userService.checkUserAchivements(user, "Has contestado el cuestionario sobre el cómic")){
      this.userService.setAchivement(user.username, "Has contestado el cuestionario sobre el cómic", 20).subscribe(response => {
        if(response['mensaje'])
          alert(response['mensaje']);
        else {
          this.userService.localUpdateAchivemets(user, "Has contestado el cuestionario sobre el cómic", 20);
          this.userService.checkLevel(user, function(updated){});
          this.setChallange();
          alert("Logro desbloqueado: Has contestado el cuestionario sobre el cómic");  
        }
      });
    }
  }

  /**
   * Agrega el nuevo reto de periodista al usuario actualmente en sesión y descarga el documento con instrucciones
   * guarda el error en el procedimeinto en el camo msn si se da el caso
   */
  setChallange(){
    var user = this.userService.getUserLoggedIn();
    this.msn = "No te vayas, espera un momento...";
    this.userService.addChallenge(user.username, 'periodista', "Como periodista cubriendo los hechos al redor del masivo complot que llevó a la caida de Xanadú. La crónica que vas a escribir describe los hechos detrás de esta conspiración.").subscribe(response => {
      if(response['mensaje'])
        this.msn = response['mensaje'];
      else {
        this.userService.saveProgress(user.username, "periodistaAsig").subscribe(response => { 
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
   * Reinicia las respuestas de todo el cuestionario
   */
  onReset() {
    this.selectedAnswers = ["a","a","a","a","a","a","a","a"];
    this.questionState = ["normal","normal","normal","normal","normal","normal","normal","normal"];
  }

  /**
   * Descarga la plantilla de la cronica
   */
  onDownload(){
    var url = './assets/static/reportero/cronica.pdf';
    this.msn = "Nuevo Reto Agregado";
    this.basicAble = false;
    this.cargando = false;
    window.open(url, "_blank");
  }
}