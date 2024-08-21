import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomRequest } from 'src/app/model/Request.model';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { Reservation } from 'src/app/model/Reservation.model';
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

  addTopic(requestId: number, name: string, duration: number): Observable<Topic> {
    const topicData = {
        requestId: requestId,
        name: name,
        duration: duration, // Prosleđujemo duration
        availableSpots: 0 // ili neki drugi default value
    };

    console.log("PRIKAZI MI OVO", topicData);

    return this.http.post<Topic>(`${environment.apiHost}topics/create`, topicData);
}

createReservation(reservationData: { startTime: string, endTime: string, classroomId: number }): Observable<Reservation> {
  // Append ':00' to the startTime and endTime
  const modifiedReservationData = {
    startTime: reservationData.startTime + ':00',
    endTime: reservationData.endTime + ':00',
    classroomId: reservationData.classroomId
  };

  console.log("Sending reservation data:", modifiedReservationData);

  return this.http.post<Reservation>(`${environment.apiHost}reservations/create`, modifiedReservationData);
}

updateTopicWithReservation(topicName: string, reservationId: number): Observable<any> {
  return this.http.put(`${environment.apiHost}topics/update-reservation`, { topicName, reservationId });
}


getTopicsWithDetails(requestId: number): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiHost}topics/topics-with-details/${requestId}`);
}

getAllPsychologists(): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiHost}psychologists/psychologists`);
}



}
