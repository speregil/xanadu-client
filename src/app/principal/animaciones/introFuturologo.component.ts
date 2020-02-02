import { Component, ViewChild, ElementRef} from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../../models/user.service';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'animacion-instro-futurologo',
  templateUrl: './introFuturologo.component.html',
  styleUrls: ['./primera.component.css']
})

export class IntroFuturologoComponent {

  //----------------------------------------------------------------------
  // Atributos
  //----------------------------------------------------------------------

  @ViewChild('vid') video: ElementRef;    // Referencia al vide en el documento

  //----------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------

  constructor(private userService: UserService,  private router: Router, music: MusicService, private principal: AppComponent) {
    music.setBg("");
    principal.notifyBgChange();  
    var user = userService.getUserLoggedIn();
    userService.updateRole(user.username, "Vidente").subscribe(response => {
      if(response["status"] == 0) {
        user.currentRol = "Vidente";
        userService.setUserLoggedIn(user);
        principal.updateLogin();
      }
    });
  }

  //----------------------------------------------------------------------
  // Funciones
  //----------------------------------------------------------------------

  /**
   * Navega hacia el componente del comic, capitulos 1 a 15
   */
  onContinue() {
    this.router.navigate(["futurologo"]);
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