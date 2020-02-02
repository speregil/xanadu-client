import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../registro/registro.service';
import { UserService } from '../../models/user.service';
import { MusicService } from '../../models/music.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'logros',
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.css']
})

/**
 * Componente que controla el listado de logros del usuario en sesion
 */
export class LogrosComponent {
    
    //--------------------------------------------------------------------------------
    // Campos y Atributos
    //--------------------------------------------------------------------------------

    achivements = [];       // Atributo que guarda la lista de logros del usuario en sesion
    isLogged = false;       // Atributo que determina si hay usuario en sesion

    //--------------------------------------------------------------------------------
    // Constructor
    //--------------------------------------------------------------------------------

    constructor(private registro: RegistroService, private userService: UserService, private principal: AppComponent, music: MusicService){
        var loggedUser = this.userService.getUserLoggedIn();
        music.setBg('');
        principal.notifyBgChange();
        if(loggedUser) {
            this.isLogged = true;
            this.userService.getAchivements(loggedUser.username).subscribe(response => this.achivements = response["list"]);
        }
    }
    
    //--------------------------------------------------------------------------------
    // Funciones
    //--------------------------------------------------------------------------------

    /**
     * Calcula el total de puntos acumulados en logros
     * @return Totanl actual de puntos
     */
    calcularPuntos(): number {
        var puntos = 0;
        for(var achivement of this.achivements) {
            puntos += Number.parseInt(achivement["points"]);
        }
        return puntos;
    }
}