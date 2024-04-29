import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fair } from '../model/Fair.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class FairService {
  private backendUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  getAllFairs(): Observable<Fair[]> {
    return this.http.get<Fair[]>(environment.apiHost + 'fairs/getAll');
  }
}
