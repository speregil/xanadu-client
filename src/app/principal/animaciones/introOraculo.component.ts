import { Component} from '@angular/core';
import { Router } from "@angular/router";
import { MusicService } from 'src/app/models/music.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'animacion-intro-oraculo',
  templateUrl: './introOraculo.component.html',
  styleUrls: ['./primera.component.css']
})

/**
 * Componente para controlar la animacion de introduccion a la experiencia del oraculo
 */
export class IntroOraculoComponent {

  constructor(private router: Router, music: MusicService, private principal: AppComponent) {
    music.setBg("");
    principal.notifyBgChange(); 
  }

  /**
   * Navega hacia el componente del oraculo
   */
  onContinue() {
    this.router.navigate(["arqueologo/oraculo"]);
  }
}