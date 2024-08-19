import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomRequest } from 'src/app/model/Request.model';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { Topic } from 'src/app/model/Topic.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private backendUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  createRequest(request: CustomRequest): Observable<void> {
    console.log("DODJES OVDE?");
    console.log(request);
    return this.http.post<void>(environment.apiHost + 'requests', request);
  }


  getAllRequestDetails(): Observable<RequestDetailDto[]> {
    return this.http.get<RequestDetailDto[]>(environment.apiHost + 'requests/getAllAcceptedRequestDetails');
  }

  getRequestDetails(id: number) :Observable<RequestDetailDto> {
    console.log(id)
    return this.http.get<RequestDetailDto>(environment.apiHost + 'requests/getRequestDetails/' + id);
  } 

  addTopic(requestId: number, name: string): Observable<Topic> {
    const topicData = {
      requestId: requestId,
      name: name,
      duration: 0, // ili neki drugi default value ako želite
      availableSpots: 0 // ili neki drugi default value
    };

    console.log("PRIKAZI MI OVO", topicData)

    return this.http.post<Topic>(`${environment.apiHost}topics/create`, topicData);
  }
}
