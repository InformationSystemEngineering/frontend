// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { CompanyProfile } from './model/companyProfile.model';
// import { Observable } from 'rxjs';
// import { CompanyAdmin } from './model/companyAdmin.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class RegisterCompanyService {

//   constructor(private http: HttpClient) {
//    }

//    createCompany(company:CompanyProfile): Observable<CompanyProfile> {
//     return this.http.post<CompanyProfile>( 'http://localhost:8081/api/companyProfile/save',company);
//   }

//   getAllCompanies(): Observable< CompanyProfile[]> {
//     return this.http.get<CompanyProfile[]>( 'http://localhost:8081/api/companyProfile/');
//   }
//   createCompanyAdmin(admin:CompanyAdmin): Observable<CompanyAdmin> {
//     return this.http.post<CompanyAdmin>( 'http://localhost:8081/api/companyAdministrators/save',admin);
//   }
// }
