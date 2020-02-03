import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

/**
 * Servicio para recuperar los retos creados por los Master
 */
@Injectable()
export class ChallengesService {

    //------------------------------------------------------------------------------------
    // Atributos
    //------------------------------------------------------------------------------------

    host = '';      // Guarda localmente la dirección configurada del host del API

    //------------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------------

    constructor( private http: HttpClient, private config: ConfigurationService ) {
        this.host = config.serverhost;
    }

    //------------------------------------------------------------------------------------
    // Servicios
    //------------------------------------------------------------------------------------

    /**
     * Retorna una lista con todos los retos del maestro hechos para un reto en particular
     * @param type Tipo de reto del que se desea recuperar la lista de retos
     */
    getMasterChallenges( type ){
        return this.http.get<{}>('http://' + this.host + '/challenges/master/list/' + type);
    }
}