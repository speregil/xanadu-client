import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../models/user.service';

@Component({
  selector: 'arqueologia-deliberatorium',
  templateUrl: './deliberatorium.arqueologia.html',
  styleUrls: ['./arqueologo.component.css']
})
export class DeliberatoriumComponent {
 
  constructor(private userService: UserService, private router: Router) {}

  onContinue() {
    if(this.userService.isUserLogged()) {
      var user = this.userService.getUserLoggedIn();
      this.userService.saveProgress(user.username, "d").subscribe(response => {
        if(response["status"] == 0) {
          this.router.navigate(["roles"]);
        }
      });
    }
  }
}