/**
 * Interfaz para los componentes que desean poder observar el login en el componente principal
 */
export interface LoginObserver {

    /**
     * Recibe la notificación de un login al sistema
     * @param logged Determina si fue un login o un logout
     */
    notifyLogin( logged: boolean): void 
}