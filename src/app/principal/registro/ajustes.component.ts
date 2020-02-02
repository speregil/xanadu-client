import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserService } from '../../models/user.service';
import { MusicService } from '../../models/music.service';

@Component({
  selector: 'ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./registro.component.css']
})

/**
 * Componente que controla las opciones de personalización del usuario en sesión
 */
export class AjustesComponent {

    //-------------------------------------------------------------------------------------------------
    // Campos y Atributos
    //-------------------------------------------------------------------------------------------------

    password = "";          // Campo para guardar la nueva clave del usuario
    confirmacion = "";      // Campo para guardar la confirmacion de la clave
    girlSelected = "";      // Campo que determina si el avatar del usuario actual es el femenino, y modelar la clase css correspondiente
    boySelected = "";       // Campo que determina si el avatar del usuario actual es el masculino, y modelar la clase css correspondiente
    msn = "";               // Campo que guarda los mensajes del estado de la operación de cambio de contraseña
    msn2 = "";              // Campo que guarfa los mensajes del estado de la operación de cambio de avatar

    achivement = { text: "Has seleccionado tu avatar", points: 5 };     // Atributo que modela el logro asociado a elegir el avatar por primera vez

    //-------------------------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------------------------

    constructor(private userService: UserService, music: MusicService, private principal: AppComponent){
        var user = this.userService.getUserLoggedIn();
        music.setBg('');
        principal.notifyBgChange();

        this.msn2 = 'Cargando datos...';
        this.userService.getAvatar(user.username).subscribe(response => {
            if(response["avatar"]) {
                this.msn2 = '';
                var seg = response["avatar"].split('-');
                user.currentGender = seg[0];
                if(seg[0] == 'chico')
                    this.changeAvatar('boy');
                else if(seg[0] == 'chica')
                    this.changeAvatar('girl');
            }
            else {
                this.msn2 = 'No se ha seleccionado un avatar';
            }
        });
    }

    //-------------------------------------------------------------------------------------------------
    // Funciones
    //-------------------------------------------------------------------------------------------------

    /**
     * Maneja el procedimiento de cambio de contraseña del usuario en base a la información en los campos correspondientes
     * password Campo con la nueva clave
     * confirmacion Campo con la confirmación de la nueva clave
     * Reporta el estado del procedimiento en el campo msn
     */
    changePassword(){
        if(confirm("¿Desea cambiar su clave?")) {
            if(this.password){
                if(this.confirmacion && (this.confirmacion == this.password)) {
                    this.msn = "Cambiando...";
                    var user = this.userService.getUserLoggedIn();
                    this.userService.changePassword(user.username, this.password).subscribe(response => {
                        if(response["mensaje"])
                            this.msn = response["mensaje"];
                        else {
                            this.msn = "Cambio exitoso";
                            this.password = "";
                            this.confirmacion = "";
                        }
                    });
                }
                else
                    this.msn = "Las claves no coinciden";
            }
            else
                this.msn = "Escribe una nueva clave";
        }
    }

    /**
     * Maneja el procedimiento de cambio de avatar basado en la imagen seleccionada
     * @param option girl o boy, dependiendo de la imagen seleccionada
     * Reporta el estado del procedimiento en el campo msn2
     */
    onClickAvatar(option){
        if(confirm("¿Desea cambiar su avatar?")) {
            this.msn2 = "cambiando...";
            var user = this.userService.getUserLoggedIn();
            if(option == 'girl'){
                this.userService.updateAvatar(user.username, 'chica-basico').subscribe(response => {
                    this.msn2 = "";
                    if(response["mensaje"])
                        this.msn2 = response["mensaje"];
                    else {
                        this.changeAvatar(option);
                        user.currentGender = 'chica';
                        this.userService.setUserLoggedIn(user);
                        this.setAchivement(user);
                    }
                });
            }
            else {
                this.userService.updateAvatar(user.username, 'chico-basico').subscribe(response => {
                    this.msn2 = "";
                    if(response["mensaje"])
                        this.msn2 = response["mensaje"];
                    else {
                        this.changeAvatar(option);
                        user.currentGender = 'chico';
                        this.userService.setUserLoggedIn(user);
                        this.setAchivement(user);
                    }
                });
            }
        }
    }

    /**
     * Agrega el logro correspondiente si es la primera vez que el usuario cambia su avatar
     * @param user  Usuario en sesión actualmente
     */
    private setAchivement( user ){
        if(this.userService.checkUserAchivements(user, this.achivement.text)){
            this.userService.setAchivement(user.username, this.achivement.text, this.achivement.points).subscribe(response => {
              if(response['mensaje'])
                alert(response['mensaje']);
              else {
                alert('Logro desbloqueado: ' + this.achivement.text);
                this.userService.localUpdateAchivemets(user, this.achivement.text, this.achivement.points);
                this.userService.checkLevel(user, function(updated){});
              }
            });
        }
    }

    /**
     * Cambia el estilo de la imagen del avatar que el usuario ha elegdo
     * @param option girl o boy, dependiendo de la selección del usuario
     */
    private changeAvatar(option){
        if(option == 'girl'){
            this.girlSelected = "selected";
            this.boySelected = "";
        }
        else {
            this.girlSelected = "";
            this.boySelected = "selected";
        }
    }
}