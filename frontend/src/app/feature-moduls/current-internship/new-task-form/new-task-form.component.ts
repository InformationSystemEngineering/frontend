import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.css']
})
export class NewTaskFormComponent {
  title: string = '';
  priority: string = 'medium';
  description: string = '';

  @Output() taskCreated = new EventEmitter<any>();

  priorities = [
    { value: 'high', display: 'High' },
    { value: 'medium', display: 'Medium' },
    { value: 'low', display: 'Low' }
  ];

  submitForm() {
    const newTask = {
      title: this.title,
      priority: this.priority,
      description: this.description
    };
    this.taskCreated.emit(newTask);
    this.clearForm();
  }

  clearForm() {
    this.title = '';
    this.priority = 'medium';
    this.description = '';
  }
}
