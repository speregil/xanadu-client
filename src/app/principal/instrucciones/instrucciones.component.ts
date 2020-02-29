import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Router } from "@angular/router";
import { UserService } from '../../models/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})

/**
 * Componente que controla la vizualización de las instrucciones del portal
 */
export class InstruccionesComponent {
  
  constructor(private userService: UserService, private principal: AppComponent, private router: Router, private http: HttpClient) {
    if(this.userService.isUserLogged()){
      var user = this.userService.getUserLoggedIn();
      this.saveAchivement(user, "Has leido las instrucciones", 5);
    }
  }

  saveAchivement(user, text, points){
    if(this.userService.checkUserAchivements(user, text)){
      this.userService.setAchivement(user.username, text, points).subscribe(response => {
        if(response['status'] > 0) {
          alert(response['mensaje']);
        }
        else {
          alert("Logro obtenido: " + text);
          this.userService.localUpdateAchivemets(user, text, points);
          this.userService.checkLevel(user, updated => {
            if(updated){
              alert("Aumentaste de nivel");
              this.principal.updateLogin();
            }
          });
        }
      });  
    }
  }

  onContinue(){
    window.open("assets/static/instrucciones.pdf", "_blank");
  }
}