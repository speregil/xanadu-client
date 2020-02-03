import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../models/configuration.service';

/**
 * Servicio para el acceso al API del servidor
 */
@Injectable()
export class RegistroService {
  
    host = '';      // Guarda localmente la dirección configurada del host del API

    constructor ( private http: HttpClient, private config: ConfigurationService) {
        this.host = config.serverhost;
    }

    register(pUser : string, pPassword : string, pName : String){
        return this.http.post<{}>('http://' + this.host + '/register/', {user : pUser, password : pPassword, shownName : pName, admin: false});
    }

    login(pUser : string, pPassword : string){
        return this.http.post<{}>('http://' + this.host + '/login/', {user : pUser, password : pPassword, admin: false});
    }
}