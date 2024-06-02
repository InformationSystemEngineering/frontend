import { Component } from '@angular/core';
import { FairService } from '../fair.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Fair } from 'src/app/model/Fair.model';
import { ExtraActivity } from 'src/app/model/ExtraActivity.model';
import { Psychologist } from 'src/app/model/Psychologist.model';
import { StudentExtraActivity } from 'src/app/model/StudentExtraActivity.model';

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
  renderButton: boolean = true;


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
  this.renderButton = false;
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
  this.closeModal();
}

openModal(extraActivity: any) {
  this.selectActivity = extraActivity;
}

closeModal() {
  this.selectActivity = undefined;
}

}
