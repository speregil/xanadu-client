import { Component, ViewChild, ElementRef} from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../../models/user.service';
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'animacion-primera',
  templateUrl: './primera.component.html',
  styleUrls: ['./primera.component.css']
})

/**
 * Componente para manejar el comportamiento de la animación de portada
 */
export class PrimeraAnimacionComponent {

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
  }

  //----------------------------------------------------------------------
  // Funciones
  //----------------------------------------------------------------------

  /**
   * Navega hacia el componente del comic, capitulos 1 a 15
   */
  onContinue() {
    this.userService.setInitComic("1");
    this.userService.setLastComic("15");
    this.userService.setComicBg(1);
    this.router.navigate(['comic']);
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