import { Component } from '@angular/core';
import { Fair } from '../../model/Fair.model';
import { FairService } from '../fair.service';
import { forkJoin } from 'rxjs';
import { Psychologist } from '../../model/Psychologist.model';
import { ExtraActivity } from '../../model/ExtraActivity.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publish-fairs',
  templateUrl: './publish-fairs.component.html',
  styleUrls: ['./publish-fairs.component.css']
})
export class PublishFairsComponent {
  fairs: Fair[] = [];
  renderselectFaculty: boolean = false;
  selectFair: Fair | undefined;
  psychologists: Psychologist[] = []; // Globalna promenljiva za psihologe
  extraActivities: ExtraActivity[] = [];


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

publishFair(fair: Fair): void {
  console.log('jel dodje dovde?');
  console.log(fair);
  this.fairService.publishFair(fair).subscribe({
    
    next : () => {
      this.router.navigate(['/publishfair']);
    }
  })
}
}