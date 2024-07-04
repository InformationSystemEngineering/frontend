import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class VisitFairsComponent implements OnInit {
  @ViewChild('scrollableContainer', { read: ElementRef }) scrollableContainer!: ElementRef;

  fairs: { [key: string]: Fair[] } = {};
  renderselectActivity: boolean = false;
  renderApplyButton: boolean = true;
  selectActivity: ExtraActivity | undefined;
  psychologists: Psychologist[] = []; // Globalna promenljiva za psihologe
  extraActivities: ExtraActivity[] = [];
  eventForm: FormGroup | undefined;
  renderButton: boolean = true;

  constructor(private fairService: FairService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      name: [''],
      lastName: [''],
      email: ['']
    });

    this.fairService.getAllFairsWithPsychologistPublish().subscribe({
      next: (result: Fair[]) => {
        // Fetch psychologists and extra activities for each fair before filtering
        result.forEach(fair => {
          this.fairService.getPsychologistsForFair(fair?.id || 0).subscribe({
            next: (psychologists: Psychologist[]) => {
              fair.psychologists = psychologists;

              this.fairService.getExtraActivitesForFair(fair?.id || 0).subscribe({
                next: (activities: ExtraActivity[]) => {
                  fair.activites = activities.map(activity => ({
                    ...activity,
                    applied: false
                  }));

                  // Once all fairs have their psychologists and activities, filter and group them
                  if (result.every(f => f.psychologists !== undefined && f.activites !== undefined)) {
                    const filteredFairs = result.filter(fair => fair.psychologists && fair.psychologists.length > 0);

                    // Group fairs by month
                    this.fairs = filteredFairs.reduce((acc, fair) => {
                      const monthYear = new Date(fair.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                      if (!acc[monthYear]) {
                        acc[monthYear] = [];
                      }
                      acc[monthYear].push(fair);
                      return acc;
                    }, {} as { [key: string]: Fair[] });

                    console.log(this.fairs);
                  }
                }
              });
            }
          });
        });
      }
    });
  }

  scrollLeft(): void {
    this.scrollableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  applyForActivity(extraActivity: ExtraActivity): void {
    this.renderselectActivity = true;
    this.selectActivity = extraActivity;
  }

  applyExtraActivity(extraActivity: ExtraActivity): void {
    this.renderselectActivity = false;

    const studentExtraActivity: StudentExtraActivity = {
      userId: 4, // Ovde bi trebalo staviti pravi ID korisnika
      extraActivityId: this.selectActivity?.id || 0,
    };

    this.fairService.applyForActivity(extraActivity).subscribe({
      next: () => {
        this.fairService.createStudentExtraActivity(studentExtraActivity).subscribe({
          next: () => {
            // Ažuriramo stanje samo za određeni extraActivity unutar specifičnog fair
            if (this.selectActivity) {
              Object.keys(this.fairs).forEach(month => {
                this.fairs[month] = this.fairs[month].map(fair => {
                  return {
                    ...fair,
                    activites: fair.activites ? fair.activites.map(activity => {
                      if (activity.id === this.selectActivity?.id) {
                        return {
                          ...activity,
                          applied: true
                        };
                      }
                      return activity;
                    }) : []
                  };
                });
              });
            }
            this.selectActivity = undefined;
          },
        });
      }
    });
  }

  openModal(extraActivity: ExtraActivity): void {
    this.selectActivity = extraActivity;
    this.renderselectActivity = true;
  }

  closeModal(): void {
    this.selectActivity = undefined;
    this.renderselectActivity = false;
  }
}
