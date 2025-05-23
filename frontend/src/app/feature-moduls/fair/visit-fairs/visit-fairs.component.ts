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

  navigateToMyFairs(): void {
    this.router.navigate(['/my-fairs']);
  }
}
