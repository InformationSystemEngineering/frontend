import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/feature-moduls/model/User';
import { Register } from 'src/app/feature-moduls/model/register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private http: HttpClient) {}

  signUp(user: Register): Observable<Register> {
    return this.http.post<Register>(
      'http://localhost:8081/api/auth/register',
      user
    );
  }
}
