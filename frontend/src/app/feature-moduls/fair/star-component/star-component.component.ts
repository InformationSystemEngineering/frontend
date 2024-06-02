import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-component',
  templateUrl: './star-component.component.html',
  styleUrls: ['./star-component.component.css']
})
export class StarComponentComponent {
  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  stars: number[] = [1, 2, 3, 4, 5];

  setRating(newRating: number) {
    this.rating = newRating;
    this.ratingChange.emit(this.rating);
  }
}
