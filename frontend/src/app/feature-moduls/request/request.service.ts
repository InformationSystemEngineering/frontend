import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationDto } from 'src/app/model/ApplicationDto.model';
import { Classroom } from 'src/app/model/Classroom.model';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';
import { Message } from 'src/app/model/Message.model';
import { PsychologistDto } from 'src/app/model/PsychologistDto.model';
import { PsychologistWithTopicsDto } from 'src/app/model/PsychologistWithTopicsDto.model';
import { CustomRequest } from 'src/app/model/Request.model';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { Reservation } from 'src/app/model/Reservation.model';
import { Topic } from 'src/app/model/Topic.model';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
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

  getAllPublishedRequestDetails(): Observable<RequestDetailDto[]> {
    return this.http.get<RequestDetailDto[]>(environment.apiHost + 'requests/getAllAcceptedPublishedRequestDetails');
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


getTopicsWithDetails(requestId: number): Observable<TopicDetails[]> {
  return this.http.get<TopicDetails[]>(`${environment.apiHost}topics/topics-with-details/${requestId}`);
}

getTopicsWithDetailsNoPsychologist(requestId: number): Observable<TopicDetails[]> {
  return this.http.get<TopicDetails[]>(`${environment.apiHost}topics/topics-with-details-no-psychologist/${requestId}`);
}


getAllPsychologists(): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiHost}psychologists/psychologists`);
}

getMessages(topicId: number, psychologistId: number): Observable<Message[]> {
  return this.http.get<Message[]>(`${environment.apiHost}messages?topicId=${topicId}&psychologistId=${psychologistId}`);
}

addMessage(message: Message): Observable<Message> {
  console.log("Sending message:", message);
  return this.http.post<Message>(`${environment.apiHost}messages`, message);
}


readMessage(message: Message): Observable<void> {
  return this.http.put<void>(`${environment.apiHost}messages/${message.id}/read`, {});
}

getReservationById(reservationId: number): Observable<Reservation> {
  return this.http.get<Reservation>(`${environment.apiHost}reservations/${reservationId}`);
}

getClassroomById(classroomId: number): Observable<Classroom> {
  return this.http.get<Classroom>(`${environment.apiHost}classrooms/${classroomId}`);
}

getClassroomDateByTopicId(topicId: number): Observable<ClassroomDateDto> {
  return this.http.get<ClassroomDateDto>(`${environment.apiHost}classrooms/date/byTopic/${topicId}`);
}

updateTopicWithPsychologist(topicName: string, psychologistId: number): Observable<any> {
  return this.http.put(`${environment.apiHost}topics/update-psychologist`, { topicName, psychologistId });
}

getTopicsForPsychologist(psychologistId: number): Observable<TopicDetails[]> {
  return this.http.get<TopicDetails[]>(`${environment.apiHost}topics/psychologist?psychologistId=2`);
}

getAllPsychologistsWithTopics(): Observable<PsychologistWithTopicsDto[]> {
  return this.http.get<PsychologistWithTopicsDto[]>(`${environment.apiHost}psychologists/with-topics`);
}

getPsychologistByTopicId(topicId: number): Observable<PsychologistDto> {
  return this.http.get<PsychologistDto>(`${environment.apiHost}psychologists/${topicId}/psychologist`);
}

updateFairPublishStatus(fairId: number, isPublish: boolean): Observable<void> {
  return this.http.put<void>(`${environment.apiHost}fairs/${fairId}/publish?isPublish=${isPublish}`, {});
}

applyForTopic(applicationData: ApplicationDto): Observable<any> {
  return this.http.post(`${environment.apiHost}applications/apply`, applicationData);
}

getTopicsByStudentId(studentId: number): Observable<TopicDetails[]> {
  const url = `${environment.apiHost}applications/topics-by-student/${studentId}`;
  return this.http.get<TopicDetails[]>(url);
}

}
