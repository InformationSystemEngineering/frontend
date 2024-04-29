import { Injectable } from '@angular/core';
import { Faculty } from '../model/Faculty.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private backendUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  getAllFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(environment.apiHost + 'faculties/getAll');
  }
}
