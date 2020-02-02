import { Injectable } from '@angular/core';

/**
 * Servicio para controlar la informacion de la musica de fondo guardada en el almacenamiento local
 */
@Injectable()
export class MusicService {

    //-------------------------------------------------------------------------
    // Atributos
    //-------------------------------------------------------------------------

    private isBgOn = true;      // Atributo que determina si el sonido esta encendido o no

    //-------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------

    constructor() { 
        localStorage.removeItem('currentBg');
        localStorage.setItem('currentBg', 'snd_portada.mp3');
    }

    //-------------------------------------------------------------------------
    // Funciones
    //-------------------------------------------------------------------------

    /**
     * Cambia la musica de fondo referenciada en el almacenamiento local
     * @param bg Nombre de la nueva muscia de fondo
     */
    setBg(bg) {
        localStorage.removeItem('currentBg');
        localStorage.setItem('currentBg', bg);
    }

    /**
     * Recupera el nombre del sonido actual en memoria local
     */
    getBg() {
        return localStorage.getItem('currentBg');
    }

    /**
     * Elimina la referencia a la musica de fondo del almacenamiento local
     */
    removeBg(){
        localStorage.removeItem('currentBg');
    }

    /**
     * Determina si la musica de fondo esta ecendia o no
     */
    isOn(){
        return this.isBgOn;
    }

    /**
     * Enciende la musica de fondo
     */
    setOn(){
        this.isBgOn = true;
    }

    /**
     * Apaga la musica de fondo
     */
    setOff(){
        this.isBgOn = false;
    }
}