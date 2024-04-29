import { Component } from '@angular/core';
import { Fair } from '../../model/Fair.model';
import { FairService } from '../fair.service';

@Component({
  selector: 'app-all-fairs',
  templateUrl: './all-fairs.component.html',
  styleUrls: ['./all-fairs.component.css']
})
export class AllFairsComponent {
  fairs: Fair[] = [];

  constructor(private fairService: FairService) {}

  ngOnInit(): void {
    this.fairService.getAllFairs().subscribe({
      next: (result: Fair[]) => {
        this.fairs = result;
        console.log(this.fairs);
        console.log("DONE WITH THIS")
      },
    });
  }
}
