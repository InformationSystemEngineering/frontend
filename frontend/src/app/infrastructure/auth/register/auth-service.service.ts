import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { User } from 'src/app/feature-moduls/model/User';
import { Register } from 'src/app/feature-moduls/model/register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private access_token = null;
  userClaims: any = null;
  //private loggedIn = new BehaviorSubject<boolean>(false);
  //isLoggedIn$ = this.loggedIn.asObservable();

  private loginSource = new BehaviorSubject<boolean>(false);
  public loginObserver = this.loginSource.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.userClaims = this.jwtHelper.decodeToken();
    if (this.userClaims) this.loginSource.next(true);
  }

  signUp(user: Register): Observable<Register> {
    return this.http.post<Register>(
      'http://localhost:8081/api/auth/register',
      user
    );
  }

  login(loginRequest: Credential): Observable<boolean> {
    
    //this.loggedIn.next(true);
    console.log(loginRequest);
    return this.http
      .post<any>('http://localhost:8081/api/auth/login', loginRequest)
      .pipe(
        map((res) => {
          console.log('anka');
          console.log(res);
          localStorage.setItem('token', res.accessToken);
          this.userClaims = this.jwtHelper.decodeToken();
          this.access_token = res.token;
          console.log(this.access_token);
          this.loginSource.next(true);
          return true;
        })
      );
  }

  logout(): void {
    localStorage.clear();
    this.loginSource.next(false);
  }

  getUserRole(): string {
    return this.userClaims.role;
  }

  isLogged(): boolean {
    if (!this.jwtHelper.tokenGetter()) return false;
    return true;
  }
}
