import { Component} from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../../models/user.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'animacion-intro-deliberatorium',
  templateUrl: './introDeliberatorium.component.html',
  styleUrls: ['./primera.component.css']
})

export class IntroDeliberatoriumComponent {
  
  achivement = 'Viste las animaciones: Deliberatorium';

  constructor(private userService: UserService,  private router: Router, private app: AppComponent) {}

  onContinue() {
    
        this.router.navigate(["deliberatorium"]);

  }
}