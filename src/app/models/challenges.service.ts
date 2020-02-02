import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Servicio para recuperar los retos creados por los Master
 */
@Injectable()
export class ChallengesService {

    //------------------------------------------------------------------------------------
    // Atributos
    //------------------------------------------------------------------------------------

    host = 'localhost:3100';        // Host u puerto de escucha del servidor

    //------------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------------

    constructor( private http: HttpClient ) {}

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