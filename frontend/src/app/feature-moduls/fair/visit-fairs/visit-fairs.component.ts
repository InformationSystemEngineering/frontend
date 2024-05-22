import { Component } from '@angular/core';
import { Psychologist } from '../../model/Psychologist.model';
import { ExtraActivity } from '../../model/ExtraActivity.model';
import { Fair } from '../../model/Fair.model';
import { FairService } from '../fair.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentExtraActivity } from '../../model/StudentExtraActivity.model';

@Component({
  selector: 'app-visit-fairs',
  templateUrl: './visit-fairs.component.html',
  styleUrls: ['./visit-fairs.component.css']
})
export class VisitFairsComponent {
  fairs: Fair[] = [];
  renderselectActivity: boolean = false;
  renderApplyButton: boolean = true;
  selectActivity: ExtraActivity | undefined;
  psychologists: Psychologist[] = []; // Globalna promenljiva za psihologe
  extraActivities: ExtraActivity[] = [];
  eventForm: FormGroup | undefined;


  constructor(private fairService: FairService, private router: Router, private formBuilder: FormBuilder) {
  }


  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      name: [''],
      lastName: [''],
      email: ['']
    });

    this.fairService.getAllFairsWithPsychologistPublish().subscribe({
        next: (result: Fair[]) => {
            this.fairs = result;
            console.log(this.fairs);
            console.log("DONE WITH THIS");

            this.fairs.forEach(fair => {
                this.fairService.getExtraActivitesForFair(fair?.id || 0).subscribe({
                    next: (activities: ExtraActivity[]) => {
                        fair.activites = activities;
                    }
                });

                this.fairService.getPsychologistsForFair(fair?.id || 0).subscribe({
                    next: (psychologists: Psychologist[]) => {
                        fair.psychologists = psychologists;
                    }
                });
            });
        }
    });
}

applyForActivity(extraActivity: ExtraActivity): void{
  this.renderselectActivity = true;
  this.selectActivity = extraActivity;
}

applyExtraActivity(extraActivity: ExtraActivity) : void{
  this.renderselectActivity = false;
  const studentExtraActivity: StudentExtraActivity = {
    userId: 4 || 0,
    extraActivityId: this.selectActivity?.id || 0,
  };
  this.renderApplyButton = false;
  this.fairService.applyForActivity(extraActivity).subscribe({
    
    next : () => {
      this.fairService.createStudentExtraActivity(studentExtraActivity).subscribe({
        next: () => {
          this.fairService.getAllFairsWithPsychologistPublish().subscribe({
            next: (result: Fair[]) => {
                this.fairs = result;
                console.log(this.fairs);
                console.log("DONE WITH THIS");
    
                this.fairs.forEach(fair => {
                    this.fairService.getExtraActivitesForFair(fair?.id || 0).subscribe({
                        next: (activities: ExtraActivity[]) => {
                            fair.activites = activities;
                        }
                    });
    
                    this.fairService.getPsychologistsForFair(fair?.id || 0).subscribe({
                        next: (psychologists: Psychologist[]) => {
                            fair.psychologists = psychologists;
                        }
                    });
                });
            }
        });
        },
      });
    }
  })
}
}
