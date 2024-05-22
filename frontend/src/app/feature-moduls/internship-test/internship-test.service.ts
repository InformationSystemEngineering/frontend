import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { HallDto } from 'src/app/model/hall.model';
import { InternshipDto, InternshipTest } from 'src/app/model/internship.model';
import { Student } from 'src/app/model/student.model';
import { StudentTest } from 'src/app/model/studentTest.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class InternshipTestService {

  constructor(private http: HttpClient) { }

  getAllStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(environment.apiHost + 'students')
  }

  getBestStudents(id: number) : Observable<StudentTest[]>{
    return this.http.get<StudentTest[]>(environment.apiHost + 'students/student-test/get-best-students/'+id)
  }

  getInternshipTest(id: number) : Observable<InternshipTest>{
    return this.http.get<InternshipTest>(environment.apiHost + 'internships/test/'+id);
  }

  getStudentsByInternshipTest(id: number) : Observable<Student[]>{
    return this.http.get<Student[]>(environment.apiHost + 'internships/students/'+id);
  }

  getStudentTestsByInternshipTest(id: number) : Observable<StudentTest[]>{
    return this.http.get<StudentTest[]>(environment.apiHost + 'internships/student-test/by-internship-test-id/'+id);
  }

  getAllHalls() : Observable<HallDto[]>{
    return this.http.get<HallDto[]>(environment.apiHost + 'halls')
  }

  updateTest(internshipTest: InternshipTest | undefined) : Observable<void>{
    return this.http.put<void>(environment.apiHost + 'internships/test', internshipTest)
  }

  updateStudentTest(studentTest: StudentTest): Observable<void>{
    return this.http.put<void>(environment.apiHost + 'students/student-test', studentTest)
  }

  getAllInternships() : Observable<InternshipDto[]> {
    return this.http.get<InternshipDto[]>(environment.apiHost + 'internships')
  }

  getAllInternshipTests() : Observable<InternshipTest[]> {
    return this.http.get<InternshipTest[]>(environment.apiHost + 'internships/test')
  }


  getByStudentId(id: number) : Observable<StudentTest> {
    return this.http.get<StudentTest>(environment.apiHost + 'internships/student-test/'+ id);
  }

}
