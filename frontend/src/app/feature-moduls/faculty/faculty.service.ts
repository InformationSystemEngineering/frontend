import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Faculty } from 'src/app/model/Faculty.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private backendUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  getAllFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(environment.apiHost + 'faculties/getAll');
  }

  getFacultyById(id: number) :Observable<Faculty> {
    console.log(id)
    return this.http.get<Faculty>(environment.apiHost + 'faculties/getById/' + id);
  } 
}
