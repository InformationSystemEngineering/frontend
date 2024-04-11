import { Company } from "./company.model";

export interface Appointment{
    id:number,
    adminName:string,
    adminLastName:string,
    date:Date,
    duration: number,
    company: Company
}