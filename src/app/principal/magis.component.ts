import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';
import { HttpClient } from '@angular/common/http';
import { DownloadService } from '../models/downloads.service';
import { MusicService } from '../models/music.service';

@Component({
  selector: 'magis',
  templateUrl: './magis.component.html',
  styleUrls: ['./magis.component.css']
})

/**
 * Componente del menu final de la experienci
 */
export class MagisComponent {

    //---------------------------------------------------------------------------------------------
    // Constructor
    //---------------------------------------------------------------------------------------------

    constructor(private userService: UserService, private principal: AppComponent, private router: Router, private http: HttpClient, private download: DownloadService, music: MusicService) {
        music.setBg('snd_portada.mp3');
        principal.notifyBgChange();
    }

    onDownload(url){
        this.download.downloadFile(url).subscribe(response => {
          window.open(response.url, "_blank");
        }), error => console.log(error);
    }

    onPDFViewer(url){
      window.open(url, "_blank");
    }

    onContinue( route ) {
        this.router.navigate([route]);
    }
}