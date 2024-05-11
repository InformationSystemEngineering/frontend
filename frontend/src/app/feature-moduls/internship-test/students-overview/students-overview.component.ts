import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { InternshipTestService } from '../internship-test.service';
import { Student } from 'src/app/model/student.model';
import { InternshipTest } from 'src/app/model/internship.model';
import { HallDto } from 'src/app/model/hall.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/busy-hall-dialog.component';

@Component({
  selector: 'app-students-overview',
  templateUrl: './students-overview.component.html',
  styleUrls: ['./students-overview.component.css']
})
export class StudentsOverviewComponent implements OnInit{
  students: Student[] = [];
  internshipTest: InternshipTest | undefined;
  title: string = '';
  halls: HallDto[] = [];
  selectedTime: string = '';
  selectedHall: HallDto | undefined;
  intershipId: number = 0;
  isDefined: boolean = false;
  duration: number = 0;

  constructor(public dialog: MatDialog, private service: InternshipTestService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
         const idString = params.get('id');
      if (idString !== null) {
        this.intershipId = parseInt(idString);
      }
    });
    this.getInternshipTest();
    this.getHalls();
  }

  getInternshipTest() : void {
    this.service.getInternshipTest(this.intershipId).subscribe({
      next: (internshipTest: InternshipTest) => {
        if(internshipTest.time != null){
          this.isDefined = true;
        }
        this.title = internshipTest.internshipTitle;
        this.internshipTest = internshipTest;

          this.service.getStudentsByInternshipTest(internshipTest.id || 0).subscribe({
            next : (students: Student[]) => {
              this.students = students;
            }
          });
      }
    })
  }

  getHalls() : void {
    this.service.getAllHalls().subscribe({
      next : (halls: HallDto[]) => {
        this.halls = halls;
      }
    })
  }

  onTimeSelected(value: string) {
    this.selectedTime = value;
  }

  done(): void {
    if(this.internshipTest){
      this.internshipTest.hall = this.selectedHall;
      this.internshipTest.time = this.selectedTime;
      this.internshipTest.duration = this.duration;
    }
    this.service.updateTest(this.internshipTest).subscribe({
      next : () => {
        this.router.navigate(['/internship-overview']);
      },
      error: (error) => {
        this.openErrorDialog('This hall is reserved in this time, try another date or hall');
     
      }
    })
  }

  openErrorDialog(errorMessage: string): void {
    this.dialog.open(InfoDialogComponent, {
      width: '250px',
      data: errorMessage
    });
  }  

}
