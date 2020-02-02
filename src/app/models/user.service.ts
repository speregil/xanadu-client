import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

/**
 * Servicio para las acciones del usuario
 */
@Injectable()
export class UserService {

  //------------------------------------------------------------------------
  // Atributos
  //------------------------------------------------------------------------

  private isUserLoggedIn;         // Determina si el usuario se a loggeado o no
  private currentInitComic;       // Guarda la pagina con la que inicia el comic actualmente
  private currentLastComic;       // Guarna la última página del comic actual
  private currentComicBg;         // Guarda la musica de fondo del lector actual del comic
 
  host = 'localhost:3100';        // Host y puerto del servidor

  //------------------------------------------------------------------------
  // Constructor
  //------------------------------------------------------------------------

  constructor( private http: HttpClient ) { 
    if(localStorage.getItem('currentUser'))
      this.isUserLoggedIn = true;
    else
      this.isUserLoggedIn = false;
    this.currentInitComic = 1;
    this.currentLastComic = 1;
  }

  //------------------------------------------------------------------------
  // Servicios
  //------------------------------------------------------------------------

  /**
   * Cambia el estado del usuario a loggeado
   * @param user Modelo del usuario que inició sesión
   */
  setUserLoggedIn(user:User) {
    this.isUserLoggedIn = true;
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Cambia el estado del usuario actual a fuera de la sesión
   */
  setUserLoggedOut() {
    this.isUserLoggedIn = false;
    localStorage.removeItem('currentUser');
  }

  /**
   * Retorna el modelo del usario en sesión guardado en el almacenamiento local
   */
  getUserLoggedIn() {
  	return JSON.parse(localStorage.getItem('currentUser'));
  }

  /**
   * Determina si hay un usuario en sesión o no
   */
  isUserLogged() {
    return this.isUserLoggedIn;
  }

  /**
   * Retorna la pagina con la que incia el lector de comics actual
   */
  getInitComic() {
    return this.currentInitComic;
  }

  /**
   * Coloca el comic inicial con el indice que entra por parámetro
   * @param init Comic con el que inciará el lector actual
   */
  setInitComic(init: string) {
    this.currentInitComic = init;
  }

  /**
   * Retorna el comic con el que termina el lector de comic actual
   */
  getLastComic() {
    return this.currentLastComic;
  }

  /**
   * Coloca el comic final del lectos de comic actual con el indice que entra por parámetro
   * @param last Comic con el que terminará el lector de comic actual
   */
  setLastComic(last: string) {
    this.currentLastComic = last;
  }

  /**
   * Coloca la musica de fondo del lector de comic actual con el identificador que entra por parámetro
   * @param bg Identificador del archivo de sonido
   */
  setComicBg(bg) {
    this.currentComicBg = bg;
  }

  /**
   * Retorna la musica de fondo actual del lector
   */
  getComicBg() {
    return this.currentComicBg;
  }

  /**
   * Retorna el modelo del progreso del usuario cuyo nombre de usuario entra por parametro
   * @param user Nombre de usuario del usuario en sesion
   */
  getProgressProfile(user: string) {
    return this.http.get<{}>('http://' + this.host + '/progress/profile/' + user);
  }

  /**
   * Retorna el estado de la bandera particular del progreso del usuario cuyo nombre entra por parametro
   * @param user Nombre de usuario actual
   * @param flag bandera de progreso de la que se desea saber el estado
   */
  getProgressState(user, flag){
    return this.http.get<{}>('http://' + this.host + '/progress/state/' + user + '/' + flag);
  }

  /**
   * Retorna la lista de logros del usuario cuyo nombre de usuario entra por parametro
   * @param user Nombre del usuario en sesión
   */
  getAchivements(user: string) {
    return this.http.get<{}>('http://' + this.host + '/progress/achivements/' + user);
  }

  /**
   * Crea y fuarda el nuevo logro en la lista de logros del usuario cuyo nombre entra por parametro
   * @param pUser Nombre de usuario que va a guardar el logro
   * @param pText Texto del nuevo logro
   * @param pPoints Cantidad de puntos del nuevo logros
   */
  setAchivement(pUser, pText, pPoints) {
    return this.http.post<{}>('http://' + this.host + '/progress/achivement', {user : pUser, text : pText, points: pPoints});
  }

  /**
   * Verifica que en la lista local de logros del usuario no existe el logro cuyo texto entra por parametro
   * @param user Modelo del usuario que se desea verificar
   * @param text Texto del logro a verificar
   */
  checkUserAchivements(user, text) : boolean {
    var achivements = user.achivements;
    for( var achivement of achivements) {
      if(achivement.text == text)
        return false;
    }
    return true;
  }

  /**
   * Guarda el logro cuyos datos entrar por parametro en la lista local del usuario que entra por parametro
   * @param user Modelo del usuario que se desea actualizar
   * @param pText Texto del logro que se desa guardar
   * @param pPoints Cantidad de puntos del logro que se desea guardar
   */
  localUpdateAchivemets(user, pText, pPoints) {
    var achivement = { _id: '', userID: '', text: pText, points : pPoints }
    user.achivements.push(achivement);
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Verifica el nivel alctual del usuario que entra por parametro y cambia el nivel si se da el caso
   * @param user Modelo del usuario que se desea verificar
   * @param callback Función de retorno
   */
  checkLevel(user, callback) {
    var achivements = user.achivements;
    var puntos = 0;
    for(var achivement of achivements) {
      puntos += Number.parseInt(achivement["points"]);
    }
    if(puntos >= 50 && puntos < 100 ){
      this.updateLevel(user, 'Practicante 1', function(updated){ callback(updated)});
    }
    else if(puntos >= 100 && puntos < 150){
      this.updateLevel(user, 'Practicante 2', function(updated){ callback(updated)});
    }
    else if(puntos >= 150 && puntos < 200){
      this.updateLevel(user, 'Experto', function(updated){ callback(updated)});
    }
    else if (puntos >= 200){
      this.updateLevel(user, 'Magis', function(updated){ callback(updated)});
    }
  }

  /**
   * Actualiza el rol del usuario cuyo username entra por parametro
   * @param pUser usuario a actualizar
   * @param pRole Nuevo rol del usuario
   */
  updateRole(pUser, pRole) {
    return this.http.post<{}>('http://' + this.host + '/progress/role', {user : pUser, role : pRole});
  }

  /**
   * Actualiza el avatar actual del usuario cuyo usrname entra por parametro
   * @param pUser Username del usuario a actualizar
   * @param pAvatar Nuevo avatar del usuario
   */
  updateAvatar(pUser, pAvatar){
    return this.http.post<{}>('http://' + this.host + '/progress/avatar', {username : pUser, avatar : pAvatar});
  }

  /**
   * Actualiza el nivel del usuario cuyo username entra por parametro
   * @param user Nombre de usuario que se desea actualizar
   * @param plevel Nuevo nivel del usuario
   * @param callback Función de retorno
   */
  updateLevel(user, plevel, callback){
    user.level = plevel;
    this.http.post<{}>('http://' + this.host + '/progress/level', {username : user.username, level : plevel}).subscribe(response =>{
      if(response['mensaje']){
        callback(false);
      }
      else{
        localStorage.removeItem('currentUser');
        localStorage.setItem('currentUser', JSON.stringify(user));
        callback(true);
      }
    });
  }

  /**
   * Recupera el avatar del usuario cuyo nombre entra por parámetro
   * @param pUser Nombre del usuario 
   */
  getAvatar(pUser){
    return this.http.get<{}>('http://' + this.host + '/progress/getavatar/' + pUser);
  }

  /**
   * Cambia la contrasela del usuario que entra por parametro
   * @param pUser Nombre del usuario
   * @param newPass Nueva contraseña
   */
  changePassword(pUser, newPass) {
    return this.http.post<{}>('http://' + this.host + '/changepass', {username : pUser, password : newPass});
  }

  /**
   * Guarda la bandera de progreso que entra por parametro al usuario cuyo nombre revibe por parampetro
   * @param pUser Nombre del usuario
   * @param pFlag bandera que se desea activar
   */
  saveProgress(pUser, pFlag) {
    return this.http.post<{}>('http://' + this.host + '/progress/save', {user : pUser, flag : pFlag});
  }

  /**
   * Crea y guarda un nuevo reto en la lista de retos del usuario cuyo nombre entra por parametro
   * @param pUser Nobre del usuario
   * @param pType Tipo de reto a guardar
   * @param pText Texto explicativo del reto que se está guardando
   */
  addChallenge(pUser, pType, pText) {
    return this.http.post<{}>('http://' + this.host + '/challenges/add', {user : pUser, type : pType, text : pText});
  }

  /**
   * Retorna la lista de todos los retos asociados al usuario cuyo nombre llega por parámetro
   * @param pUser Nombre del usuario
   */
  getChallenges(pUser) {
    return this.http.get<{}>('http://' + this.host + '/challenges/list/' + pUser);
  }

  /**
   * Retorna la lista de notificaciones del usuario cuyo nombre entra por parámetro
   * @param pUser Nombre del usuario
   */
  getNotifications(pUser){
    return this.http.get<{}>('http://' + this.host + '/notifications/list/' + pUser);
  }

  /**
   * Elimina todas las notificaciones del usuario cuyo nombre entra por parámetro
   * @param pUser Nombre de usuario
   */
  whipeNotifications(pUser){
    return this.http.post<{}>('http://' + this.host + '/notifications/whipe', {username : pUser});
  }
}