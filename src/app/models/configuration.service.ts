import { Injectable } from '@angular/core';

/**
 * Servicio para manejar las constantes de configuración del app
 */
@Injectable()
export class ConfigurationService{

    readonly serverhost: string = 'localhost:3100';     // Dirección del host del servidor del API

    constructor () {}
}