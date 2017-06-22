import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {Task} from '../task.model';
import {TaskService} from '../task.service';
import {Subject} from 'rxjs/Subject';
import {Action, AddTaskAction, DeleteTaskAction, UpdateTaskAction} from '../../shared/actions';
import {dispatcher} from '../../shared/stateAndDispatcher';
import {MdCheckboxChange} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskDetailPanelComponent} from '../task_detail_panel/task.detail.panel.component';

@Component({
  moduleId: module.id,
  selector: 'task-list',
  templateUrl: './task.list.component.html',
  styleUrls: ['./task.list.component.css']
})
export class TaskListComponent {

  @Input() editable: boolean = true;

  @Input() title: string = '';

  @Input() tasks: Task[] = [];

  @Input() isCollapsed: boolean = false;

  @Output() detail = new EventEmitter<string>();

  constructor(private taskService: TaskService
    , @Inject(dispatcher) private dispatcher: Subject<Action>
    , private router: Router) {
  }

  onStateChange(event: MdCheckboxChange, taskId: string) {
    console.log(event);
    if (event.checked) {
      this.taskService.completeTask(taskId).subscribe(result => {
        if (result && result.result) {
          this.dispatcher.next(new UpdateTaskAction(result.burden));
        }
      });
    } else {
      this.taskService.incompleteTask(taskId).subscribe(result => {
        if (result && result.result) {
          this.dispatcher.next(new UpdateTaskAction(result.burden));
        }
      });
    }
  }

  stopEvent(event: any) {
    event.stopPropagation();
  }

  showDetail(taskId: string) {
    this.detail.emit(taskId);
  }

}
