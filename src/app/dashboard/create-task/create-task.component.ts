import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {Task} from '../../model/Task'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  @Input() selectedTask!: Task;
@ViewChild('taskForm', { static: false }) taskForm!: NgForm;

@Input() isEditMode: boolean = false;

  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  ngAfterViewInit(){
    setTimeout(() => {
      this.taskForm.form.patchValue(this.selectedTask);
    }, 0);
    
  }

  OnCloseForm(){
    this.CloseForm.emit(false);
  }

  OnFormSubmitted(form: NgForm){
    this.EmitTaskData.emit(form.value);
    this.CloseForm.emit(false);
  }
}
