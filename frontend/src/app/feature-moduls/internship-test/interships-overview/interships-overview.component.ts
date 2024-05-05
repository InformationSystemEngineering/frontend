import { Component, OnInit } from '@angular/core';
import { InternshipDto } from 'src/app/model/internship.model';
import { InternshipTestService } from '../internship-test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interships-overview',
  templateUrl: './interships-overview.component.html',
  styleUrls: ['./interships-overview.component.css']
})
export class IntershipsOverviewComponent implements OnInit{
    internships: InternshipDto[] = [];

    constructor(private service: InternshipTestService, private router: Router) {}

    ngOnInit(): void {
      this.getInternships();
    }

    getInternships() : void {
      this.service.getAllInternships().subscribe({
        next: (internships: InternshipDto[]) => {
          this.internships = internships;
        }
      })
    }

    onCardClicked(id: number) : void {
      this.router.navigate(['/internship-details/' + id]);
    }
}
