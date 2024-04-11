import { Company } from "./company.model";
import { User } from "./user.model";

export interface CompanyAdministrator extends User{
    id:number,
    company: Company | null
}