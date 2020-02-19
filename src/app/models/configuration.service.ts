import { Injectable } from '@angular/core';

/**
 * Servicio para manejar las constantes de configuración del app
 */
@Injectable()
export class ConfigurationService{

    readonly serverhost: string = '34.229.146.9:3131';     // Dirección del host del servidor del API

    constructor () {}
}