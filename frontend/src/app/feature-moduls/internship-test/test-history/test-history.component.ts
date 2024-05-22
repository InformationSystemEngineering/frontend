import { Component, OnInit } from '@angular/core';
import { InternshipTestService } from '../internship-test.service';
import { InternshipTest } from 'src/app/model/internship.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-history',
  templateUrl: './test-history.component.html',
  styleUrls: ['./test-history.component.css']
})
export class TestHistoryComponent implements OnInit{

  tests: InternshipTest[] = [];

  constructor(private service: InternshipTestService, private router: Router) {}

  ngOnInit(): void {
    this.getTests();
  }

  getTests() : void {
    this.service.getAllInternshipTests().subscribe({
      next: (tests: InternshipTest[]) => {
        tests.sort((a, b) => {
          if (a.testReviewed === b.testReviewed) {
            return 0;
          } else if (a.testReviewed && !b.testReviewed) {
            return 1;
          } else {
            return -1;
          }
        });

        this.tests = tests;
      }
    })
  }

  handleClick(test: InternshipTest) : void {
    this.router.navigate(['/test-results/' + test.id]);
  }
}
