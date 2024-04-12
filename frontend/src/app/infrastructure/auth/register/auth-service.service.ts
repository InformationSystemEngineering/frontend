import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { User } from 'src/app/feature-moduls/model/User';
import { Register } from 'src/app/feature-moduls/model/register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private access_token = null;
  userClaims: any = null;

  private loginSource = new BehaviorSubject<boolean>(false);
  public loginObserver = this.loginSource.asObservable();

  constructor(private http: HttpClient) {}

  signUp(user: Register): Observable<Register> {
    return this.http.post<Register>(
      'http://localhost:8081/api/auth/register',
      user
    );
  }

  // login(loginRequest: Credential): Observable<boolean> {
  //   return this.http
  //     .post<any>('http://localhost:8081/api/authentication/login', loginRequest)
  //     .pipe(
  //       map((res) => {
  //         console.log('Login success');
  //         console.log(res);
  //         localStorage.setItem('token', res.token);
  //         this.userClaims = this.jwtHelper.decodeToken();
  //         this.access_token = res.token;
  //         this.loginSource.next(true);
  //         return true;
  //       })
  //     );
  // }

  // getUserRole(): string {
  //   return this.userClaims.role;
  // }
}
