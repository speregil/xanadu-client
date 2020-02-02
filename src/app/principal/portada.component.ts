import { Component } from '@angular/core';
import { MusicService } from '../models/music.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'portada',
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.css']
})

/**
 * Componente para manejar la ventana de la portada principal
 */
export class PortadaComponent {

    //-------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------

    constructor( music: MusicService, private principal: AppComponent ) {
      music.setBg('snd_portada.mp3');
      principal.notifyBgChange();
    }
}