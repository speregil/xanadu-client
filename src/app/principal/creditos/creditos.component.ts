import { Component } from '@angular/core';
import { UserService } from '../../models/user.service';
import { Router } from "@angular/router";
import { AppComponent } from '../../app.component';

@Component({
  selector: 'creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css']
})
export class CreditosComponent {
  
  constructor(private userService: UserService, private router: Router, private app: AppComponent){
    if(this.userService.isUserLogged()){
      var user = this.userService.getUserLoggedIn();
      this.saveAchivement(user, "Has visto los créditos", 5);
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
              this.app.updateLogin();
            }
          });
        }
      });  
    }
  }
}