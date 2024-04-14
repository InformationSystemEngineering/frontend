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
  userClaims: any = null;
  userRole: string = '';

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.authService.loginStatus$.subscribe(loggedIn => {
      if (loggedIn) {
        const token = localStorage.getItem('token');
        this.userClaims = this.authService.decodeToken();
        this.userRole = this.userClaims.role[0].authority; // Adjust according to actual token structure
      } else {
        this.userRole = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}