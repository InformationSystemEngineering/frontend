import { Component, OnInit } from '@angular/core';
import { FairService } from '../fair.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Fair } from 'src/app/model/Fair.model';
import { FairPsychology } from 'src/app/model/FairPsychology.model';
import { ExtraActivity } from 'src/app/model/ExtraActivity.model';

@Component({
  selector: 'app-all-fairs',
  templateUrl: './all-fairs.component.html',
  styleUrls: ['./all-fairs.component.css']
})
export class AllFairsComponent implements OnInit {
  fairs: Fair[] = [];
  renderselectFaculty: boolean = false;
  selectFair: Fair | undefined;
  eventForm: FormGroup;

  constructor(private fairService: FairService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: [''],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      activityType: [''],
      classroom: [''],
      capacity: ['']
    });
  }


  selectedFair(fair: Fair): void {
    this.renderselectFaculty = true;
    this.selectFair = fair;

    const fairPsychology: FairPsychology = {
      psychologistId: 1 || 0,
      fairId: this.selectFair?.id || 0,
    };

    this.fairService.createFairPsychology(fairPsychology).subscribe({
      next: () => {
        console.log("JEL DODJES?");
        console.log(fairPsychology);
      },
    });
  }

  ngOnInit(): void {
    this.fairService.getAllFairs().subscribe({
      next: (result: Fair[]) => {
        this.fairs = result;
        console.log(this.fairs);
        console.log("DONE WITH THIS")
      },
    });
  }

  createExtraActivity(): void {
    this.renderselectFaculty = false;
    const extraActivity: ExtraActivity = {
      name: this.eventForm.value.name || '',
      activityType: this.eventForm.value.activityType || '',
      startTime: this.eventForm.value.startTime || '',
      endTime: this.eventForm.value.endTime || '',
      date: this.eventForm.value.date || '',
      fairPsychologyId: 1,
      classroom: this.eventForm.value.classroom || '',
      capacity: this.eventForm.value.calendar || 0
    };
   
    if (!this.eventForm.valid) {
      return;
    }
   
    this.fairService.createExtraActivity(extraActivity).subscribe({
      next: () => {
        console.log("JEL DODJES?");
        console.log(extraActivity);
      },
      error: (error) => {
        console.error("Greška prilikom kreiranja dodatne aktivnosti:", error);
      },
      complete: () => {
        console.log("Završena pretplata na kreiranje dodatne aktivnosti.");
      }
    });
    console.log("Ovo je posle poziva createExtraActivity");
    
    
  }
}

