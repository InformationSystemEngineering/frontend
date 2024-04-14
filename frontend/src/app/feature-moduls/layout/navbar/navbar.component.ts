import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { LoginComponent } from 'src/app/infrastructure/auth/login/login.component';
import { AuthServiceService } from 'src/app/infrastructure/auth/register/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
    private loginSource = new BehaviorSubject<boolean>(false);
    userClaims: any = null;
    userRole: string = '';
    
    constructor(private jwtHelper: JwtHelperService, private authService: AuthServiceService) {
       this.userClaims = this.jwtHelper.decodeToken();
       if (this.userClaims != null){
         console.log(this.userClaims.role[0].authority);
         this.userRole = this.userClaims.role[0].authority;
    }
    }

  ngOnInit(): void {
    this.userRole = this.userClaims.role[0].authority;
   /* this.authService.isLoggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.userRole = this.userClaims.role[0].authority;
      } else {
        this.userRole = '';
      }
    });*/
  }

    logout(): void {
      localStorage.clear();
      
      this.userRole = '';
      this.loginSource.next(false);
    }

    

}
