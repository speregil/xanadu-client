/**
 * Modelo para el usuario
 */
export class User {
    
    username: string;           // Nombre de usuario
    shownName: string;          // Nombre a mostrar en interfaz del usuario
    currentRol: string;         // Rol actual del usuario
    currentGender: string;      // Género seleccionado del avatar del usuario
    level: string;              // Nivel actual del usuario
    achivements: [];            // Lista con los textos de los logros obtenidos por el usuario

    //------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------
    
    constructor () {
        this.achivements = [];
        this.currentGender = 'chico';
    }
}