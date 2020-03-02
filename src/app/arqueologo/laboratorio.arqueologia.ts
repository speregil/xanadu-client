import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { HttpClient } from '@angular/common/http';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'arqueologia-lab',
  templateUrl: './laboratorio.arqueologia.html',
  styleUrls: ['./arqueologo.component.css']
})
/**
 * Componente que maneja la experiencia del laboratorio
 */
export class LaboratorioComponent {
  
  //-------------------------------------------------------------------------------
  // Campos y Atributos
  //-------------------------------------------------------------------------------

  msn = '';                           // Campo que guarda el estado del proceso actual
  currentColors = [];                 // Campo que guarda los colores actuales de todas las imagenes
  currentImages = [];                 // Campo que guarda las imágenes actuales

  basicAble = true;                   // Atributo que determina si es posible realizar la actividad
  cargando = true;                    // Atributo que determina si la página está cargando algún elemento
  currentCursor = 'lab-container';    // Atributo que determina cual cursor muestra la página

  //-------------------------------------------------------------------------------
  // Constructor
  //-------------------------------------------------------------------------------

  constructor(private userService: UserService, private router: Router, private http: HttpClient, music: MusicService, private principal: AppComponent) {
    this.msn = "Cargando";
    music.setBg("");
    principal.notifyBgChange();
    var user = this.userService.getUserLoggedIn();
    this.userService.getProgressState(user.username, 'arqueologo').subscribe(response => {
        if(response['flag']){
          this.basicAble = false;
        }
        this.msn = '';
        this.cargando = false;
    });

    for(var i = 0; i < 9; i++){
      this.currentColors.push('img-container');
    }

    var source1 = this.getRandomImagesFrom('MyC');
    var source2 = this.getRandomImagesFrom('Gabriella');
    var source3 = this.getRandomImagesFrom('Golpe');
    this.populateTable(source1,source2, source3);
  }

  //-------------------------------------------------------------------------------
  // Funciones
  //-------------------------------------------------------------------------------
  
  /**
   * Recupera tres imagenes al azar del pool de imágenes que entra por parametro
   * @param source Fuente de las imágenes
   * @return Lista con las imagenes escogidas al azar
   */
  getRandomImagesFrom(source){
    var randNums = [];
    var randImages = [];
    var flag = 0;
    while(flag < 3){
      var i = Math.floor(Math.random() * 15) + 1;
      if(!randNums.includes(i)){
        randNums.push(i);
        flag++;
      }
    }

    for(var num of randNums){
      var imgSource = source + '/' + source + '-' + num;
      randImages.push(imgSource);
    }
    return randImages;
  }

  /**
   * Inserta en el campo de imagenes actuales imagenes al azar de las tres fuentes que entran por parametro
   * @param source1 Fuente No 1
   * @param source2 Fuente No 2
   * @param source3 Fuente No 3
   */
  populateTable(source1, source2, source3){
    while(source1.length > 0 || source2.length > 0 || source3.length > 0){
      var i = Math.floor(Math.random() * 3) + 1;
      if(i == 1 && source1.length > 0)
        this.currentImages.push(source1.pop());
      else if(i == 2 && source2.length > 0)
        this.currentImages.push(source2.pop());
      else if(i == 3 && source3.length > 0)
        this.currentImages.push(source3.pop());
    }
  }

  /**
   * Cambia el cursor al color que entra por parametro
   * @param color Nuevo color de cursor que se seleccionó
   */
  onResaltador( color ) {
    this.currentCursor = 'lab-' + color + 'container';
  }

  /**
   * Resalta con el color del cursor actual la imagen en la posición que entra por parámetro
   * @param pos Posición de la imagen en el campo currentImages
   */
  onImageClick(pos){
    var color = this.currentCursor.split('-');
    this.currentColors[pos] = 'img-' + color[1];
  }

  /**
   * Valida que el color de todas las imagenes coincida correctamente con la fuente de la que provienen
   * Salva el logro correspondiente si todas son correctas
   * Alerta del número de errores en caso contrario
   */
  validate(){
    if(this.basicAble && !this.cargando){
      var mistakes = 0;
      var correct = 0;
      for(var i = 0; i < this.currentImages.length; i++){
        var image = this.currentImages[i].split('/');
        var source = image[0];
        var color = this.currentColors[i];

        if(source == 'Gabriella' && color == 'img-Acontainer')
          correct++;
        else if(source == 'MyC' && color == 'img-Rcontainer')
          correct++;
        else if(source == 'Golpe' && color == 'img-Vcontainer')
          correct++;
        else
          mistakes++; 
      }

      if(mistakes > 0)
        alert("Hay " + mistakes + " datos que no coinciden. Vuelva a intentar");
      else{
        alert("Correcto");
        this.msn = "Espera un momento por favor...";
        this.cargando = true;
        this.saveAchivement();
        this.userService.setInitComic("29");
        this.userService.setLastComic("45");
        this.userService.setComicBg(3);
        this.router.navigate(["comic"]);
      }
    }
    else{
      alert('Ya completaste este reto previamente');
    }
  }

  /**
   * Salva el logro asociado a completar el laboratorio correctamente
   * Reporta el resultado de la operación en el campo msn
   */
  saveAchivement(){
    var user = this.userService.getUserLoggedIn();
    this.userService.setAchivement(user.username, 'Has desarrollado la misión del arqueólogo', 10).subscribe(response => {
      if(response['mensaje'])
        this.msn = response['mensaje'];
      else {
        this.userService.saveProgress(user.username, 'arqueologo').subscribe(response => {
          if(response["status"] == 0){
            this.msn = '';
            this.basicAble = false;
            alert('Logro desbloqueado: Has desarrollado la misión del arqueólogo');
            this.userService.localUpdateAchivemets(user, 'Has desarrollado la misión del arqueólogo', 10);
            this.userService.checkLevel(user, function(updated){});
          }
          else{
            this.msn = 'Cuidado, el usuario no se ha actualizado, vuelva a intentar'; 
          }
        }); 
      }
    });
  }

  /**
   * Quita todos los colores de las imágenes actuales
   */
  reset(){
    for(var i = 0; i < 9; i++){
      this.currentColors[i] = 'img-container';
    }
  }

  /**
   * Navega al menu principal
   */
  onContinue() {
    this.router.navigate(["roles"]);    
  }
}