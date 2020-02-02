import {Injectable} from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';

/**
 * Servicio para descargar archivos del servidor local al cliente
 */
@Injectable()
export class DownloadService {

    //------------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------------

    constructor(private http: Http) {}

    //------------------------------------------------------------------------------------
    // Servicios
    //------------------------------------------------------------------------------------

    /**
     * Descarga el archivo cuya url entra por parámetro
     * @param url Archivo que se desea descargar
     */
    downloadFile(url) {		
        return this.http.get(url, { responseType: ResponseContentType.Blob });
    }
}