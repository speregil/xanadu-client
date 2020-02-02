import { Component, ViewChild, ElementRef} from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../../models/user.service';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'animacion-intro-interprete',
  templateUrl: './introInterprete.component.html',
  styleUrls: ['./primera.component.css']
})

/**
 * Componente para manejar el comportamiento de la animación de introduccion al critico
 */
export class IntroInterpreteComponent {

  //----------------------------------------------------------------------
  // Atributos
  //----------------------------------------------------------------------

  @ViewChild('vid') video: ElementRef;    // Referencia al vide en el documento

  //----------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------

  constructor(private userService: UserService,  private router: Router, music: MusicService, private principal: AppComponent) {
    var user = userService.getUserLoggedIn();
    music.setBg("");
    principal.notifyBgChange();  
    userService.updateRole(user.username, "Critico").subscribe(response => {
      if(response["status"] == 0) {
        user.currentRol = "Critico";
        userService.setUserLoggedIn(user);
        principal.updateLogin();
      }
    });
  }

  //----------------------------------------------------------------------
  // Funciones
  //----------------------------------------------------------------------
  
  /**
   * Navega hacia el componente del critico
   */
  onContinue() {
    this.router.navigate(["interprete"]);
  }

  /**
   * Reinicia el video
   */
  onAgain() {
    this.video.nativeElement.pause();
    this.video.nativeElement.currentTime = 0;
    this.video.nativeElement.load();
  }
}