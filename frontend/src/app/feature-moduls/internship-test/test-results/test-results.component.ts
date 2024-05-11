import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipTestService } from '../internship-test.service';
import { InternshipTest } from 'src/app/model/internship.model';
import { Student } from 'src/app/model/student.model';
import { StudentTest } from 'src/app/model/studentTest.model';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/busy-hall-dialog.component';
import { BestStudentsDialogComponent } from '../best-students-dialog/best-students-dialog.component';


interface ExtendedStudentTest extends StudentTest {
  showInput?: boolean;
}

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css']
})


export class TestResultsComponent implements OnInit{

  internshipTestId: number = 0;
  internshipTest: InternshipTest | undefined;
  allStudentTests: ExtendedStudentTest[] = [];
  reviewedStudentTests: ExtendedStudentTest[] = [];
  notReviewedStudentTests: ExtendedStudentTest[] = [];
  isClicked: boolean = false;
  anyChanges: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private service: InternshipTestService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idString = params.get('id');
      if (idString !== null) {
        this.internshipTestId = parseInt(idString);
      }
    });
    this.getInternshipTest();
    this.getStudentTests();
    
  }
  
  getInternshipTest(): void {
    this.service.getInternshipTest(this.internshipTestId).subscribe({
      next: (test: InternshipTest) =>{
        this.internshipTest = test;
      }
    })
  }

  getStudentTests(): void {
    this.service.getStudentTestsByInternshipTest(this.internshipTestId).subscribe({
      next: (studentTests: ExtendedStudentTest[]) => {
        this.allStudentTests = studentTests;
        this.allStudentTests.forEach(st => {
          st.showInput = false
        });
        this.allStudentTests.forEach(test => {
          if(test.reviewed){
            this.reviewedStudentTests.push(test);
          }
          else{
            this.notReviewedStudentTests.push(test);
          }
        });
        if(this.notReviewedStudentTests.length == 0){
            this.service.getBestStudents(this.internshipTestId).subscribe({
              next: (students: StudentTest[])=> {
                this.openDialogForBestStudents(students);
              }
            })
        }
      }
    })

  }

  openDialogForBestStudents(students: StudentTest[]): void {
    this.dialog.open(BestStudentsDialogComponent, {
      width: '500px', 
      data: students 
    });
    
    this.router.navigate(['/test-history']);
  }

  showInputPoints(testid: number): void{
    const test = this.notReviewedStudentTests.find(test => test.id === testid);
    if (test) {
      test.showInput = !test.showInput;
      this.anyChanges = true;
    }
  }

  done(): void {
    this.notReviewedStudentTests.forEach(st => {
        if(st.showInput == true){
          this.service.updateStudentTest(st).subscribe({
            next: () => {
              this.notReviewedStudentTests = [];
              this.reviewedStudentTests = [];
              this.anyChanges = false;
              this.getStudentTests();
            }
          });
        }
    });
  }
  
}
