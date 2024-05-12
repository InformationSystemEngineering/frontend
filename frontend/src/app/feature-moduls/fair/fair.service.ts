import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fair } from '../model/Fair.model';
import { environment } from 'src/env/environment';
import { ExtraActivity } from '../model/ExtraActivity.model';
import { FairPsychology } from '../model/FairPsychology.model';
import { Psychologist } from '../model/Psychologist.model';

@Injectable({
  providedIn: 'root'
})
export class FairService {
  private backendUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  getAllFairs(): Observable<Fair[]> {
    return this.http.get<Fair[]>(environment.apiHost + 'fairs/getAll');
  }

  getAllFairsWithPsychologist(): Observable<Fair[]> {
    return this.http.get<Fair[]>(environment.apiHost + 'fairs/getAllFairsWithPsychologist');
  }

  createFair(fair: Fair): Observable<void> {
    console.log("DODJES OVDE?");
    console.log(fair);
    return this.http.post<void>(environment.apiHost + 'fairs', fair);
  }

  createExtraActivity(extraActivity: ExtraActivity): Observable<void> {
    console.log("DODJES OVDE?");
    console.log(extraActivity);
    return this.http.post<void>(environment.apiHost + 'extraactivities', extraActivity);
  }

  createFairPsychology(fairPsychology: FairPsychology): Observable<void> {
    console.log("DODJES OVDE?");
    return this.http.post<void>(environment.apiHost + 'fairpsychology', fairPsychology);
  }

  getPsychologistsForFair(fairId: number): Observable<Psychologist[]> {
    return this.http.get<Psychologist[]>(environment.apiHost + 'fairs/' + fairId + '/psychologists');
  }

  getExtraActivitesForFair(fairId: number): Observable<ExtraActivity[]> {
    return this.http.get<ExtraActivity[]>(environment.apiHost + 'fairs/' + fairId + '/extraActivities');
  }

  publishFair(fair: Fair | undefined) : Observable<void>{
    console.log('a ovde?');
    console.log(fair);
    return this.http.put<void>(environment.apiHost + 'fairs/fair', fair);
  }

  getAllFairsWithPsychologistPublish(): Observable<Fair[]> {
    return this.http.get<Fair[]>(environment.apiHost + 'fairs/getAllFairsWithPsychologistPublish');
  }

  applyForActivity(extraActivity: ExtraActivity) : Observable<void>{
    return this.http.put<void>(environment.apiHost + 'extraactivities/extraactivity', extraActivity);
  }

}
