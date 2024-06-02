import { Component } from '@angular/core';
import { ExtraActivity } from 'src/app/model/ExtraActivity.model';
import { Fair } from 'src/app/model/Fair.model';
import { Psychologist } from 'src/app/model/Psychologist.model';
import { FairService } from '../fair.service';
import { Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-fairs-by-user',
  templateUrl: './fairs-by-user.component.html',
  styleUrls: ['./fairs-by-user.component.css']
})
export class FairsByUserComponent {
  fairs: Fair[] = [];
  renderselectFaculty: boolean = false;
  selectFair: Fair | undefined;
  psychologists: Psychologist[] = []; // Globalna promenljiva za psihologe
  extraActivities: ExtraActivity[] = [];
  renderRate: boolean =true;

  constructor(private fairService: FairService, private router: Router) {
  }


  ngOnInit(): void {
    this.fairService.getAllFairsWithPsychologist().subscribe({
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

rateFair(extraActivityId: number | undefined):void{
  console.log("EXTRA ACIVITYYYYY:", extraActivityId)
  
  this.renderRate=false;
  this.router.navigate(['/feedback/',extraActivityId])
}


}
