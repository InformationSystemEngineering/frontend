import { Component, OnInit } from '@angular/core';
import { FairService } from '../fair.service';
import { Router } from '@angular/router';
import { Fair } from 'src/app/model/Fair.model';
import { Psychologist } from 'src/app/model/Psychologist.model';
import { ExtraActivity } from 'src/app/model/ExtraActivity.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-publish-fairs',
  templateUrl: './publish-fairs.component.html',
  styleUrls: ['./publish-fairs.component.css']
})
export class PublishFairsComponent implements OnInit {
  fairs: Fair[] = [];
  unpublishedFairs: Fair[] = [];
  publishedFairs: Fair[] = [];

  constructor(private fairService: FairService, private router: Router) { }

  ngOnInit(): void {
    this.fairService.getAllFairsWithPsychologist().subscribe({
      next: (result: Fair[]) => {
        this.fairs = result;

        this.fairs.forEach(fair => {
          this.fairService.getExtraActivitesForFair(fair?.id || 0).subscribe({
            next: (activities: ExtraActivity[]) => {
              fair.activites = activities;
            }
          });

          this.fairService.getPsychologistsForFair(fair?.id || 0).subscribe({
            next: (psychologists: Psychologist[]) => {
              fair.psychologists = psychologists;
              // Filter out fairs without psychologists
              this.filterFairs();
            }
          });
        });
      }
    });
  }

  filterFairs() {
    this.unpublishedFairs = this.fairs.filter(fair => !fair.publish && fair.psychologists && fair.psychologists.length > 0);
    this.publishedFairs = this.fairs.filter(fair => fair.publish && fair.psychologists && fair.psychologists.length > 0);
  }

  drop(event: CdkDragDrop<Fair[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updatePublishState(event.container.id, event.container.data[event.currentIndex]);
    }
  }

  updatePublishState(containerId: string, fair: Fair) {
    if (containerId === 'publishedFairs') {
      fair.publish = true;
    } else {
      fair.publish = false;
    }

    this.fairService.publishFair(fair).subscribe({
      next: () => {
        this.fairService.getAllFairsWithPsychologist().subscribe({
          next: (result: Fair[]) => {
            this.fairs = result;

            this.fairs.forEach(fair => {
              this.fairService.getExtraActivitesForFair(fair?.id || 0).subscribe({
                next: (activities: ExtraActivity[]) => {
                  fair.activites = activities;
                }
              });

              this.fairService.getPsychologistsForFair(fair?.id || 0).subscribe({
                next: (psychologists: Psychologist[]) => {
                  fair.psychologists = psychologists;
                  this.filterFairs();
                }
              });
            });
          }
        });
      }
    });
  }
}
