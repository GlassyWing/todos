import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {Project, Task} from '../task.model';
import {dispatcher, state} from '../../shared/stateAndDispatcher';
import {AppState} from '../../state/state.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {Action, AddTaskAction, DeleteTaskAction, UpdateTaskAction} from '../../shared/actions';
import {TaskContentPanel} from '../task_content_panel/task-content-panel.component';
import * as moment from 'moment';
@Component({
  moduleId: module.id,
  selector: 'task-detail-panel',
  templateUrl: './task.detail.panel.component.html',
  styleUrls: ['./task.detail.panel.component.css']
})
export class TaskDetailPanelComponent implements OnInit, OnDestroy {

  private hasModel: boolean = false;

  // 是否开启回收模式
  public recycleModal: boolean = false;

  private task: Task;

  private projects: Project[] = [];

  private currentProject: Project;

  private appStateSubscription: Subscription;

  private datePicker = new FormControl('');

  private taskTitle = new FormControl('');

  private taskContent = new FormControl('');

  contentPanel: TaskContentPanel;

  // 输入组
  private formGroup: FormGroup;

  private inboxId: string;

  constructor(private taskService: TaskService
    , @Inject(state) public appState: Observable<AppState>
    , @Inject(dispatcher) private dispatcher: Subject<Action>
    , private fb: FormBuilder) {

    this.formGroup = this.fb.group({
      startTime: this.datePicker,
      title: this.taskTitle,
      content: this.taskContent
    });
  }

  public reset() {
    this.recycleModal = false;
    this.datePicker.reset({value: '', disabled: false});
    this.taskTitle.reset({value: '', disabled: false});
    this.taskContent.reset({value: '', disabled: false});
  }

  /**
   * 设置为回收模式
   */
  public setRecycleModalOn() {
    this.recycleModal = true;
    this.datePicker.disable();
    this.taskTitle.disable();
    this.taskContent.disable();
  }

  ngOnInit(): void {
    this.appStateSubscription = this.appState.subscribe(state => {
      this.projects = state.projects;
      this.inboxId = state.inboxId;
      if (this.task) {
        this.currentProject = this.getProject(this.task);
      }
    });
    // 当输入项目变更时，更新任务
    this.formGroup.valueChanges
      .debounceTime(400)
      .switchMap(term => {
        if (this.task) {
          if (term.startTime) {
            term.startTime = moment(term.startTime).toISOString();
          }
          this.task = Object.assign({}, this.task, term);
          return this.taskService.updateTask(this.task);
        }
        return Observable.of(null);
      }).subscribe(result => {
      if (result && result.result) {
        this.dispatcher.next(new UpdateTaskAction(result.burden));
      }
    });
  }

  ngOnDestroy(): void {
    this.appStateSubscription.unsubscribe();
  }

  /**
   * 载入任务详情
   * @param taskId
   */
  public loadTaskDetail(taskId: string) {
    this.taskService.getTask(taskId)
      .subscribe(result => {
        if (result && result.result) {
          this.task = result.burden;
          this.currentProject = this.getProject(this.task);
          this.taskTitle.setValue(this.task.title);
          this.datePicker.setValue(moment(this.task.startTime));
          this.taskContent.setValue(this.task.content);
          this.show();
        }
      });
  }

  /**
   * 显示详情
   */
  public show() {
    this.hasModel = true;
  }

  /**
   * 隐藏详情
   */
  public hidden() {
    this.hasModel = false;
    this.task = null;
  }

  public setProject(projectId: string) {
    console.log('set project: ', projectId);
    this.task.groupUuid = projectId;
    this.taskService.updateTask(this.task)
      .subscribe(result => {
        if (result && result.result) {
          this.dispatcher.next(new UpdateTaskAction(result.burden));
        }
      });
  }

  /**
   * 回收任务
   */
  public recycle() {
    if (this.task) {

      // 如果不是彻底删除，就回收
      if (!this.recycleModal) {
        this.taskService.recycleTask(this.task.scheduleUuid)
          .subscribe(result => {
            if (result && result.result) {
              this.dispatcher.next(new DeleteTaskAction(this.task));
              this.contentPanel.loadRecycledTask();
              this.hidden();
            }
          });
      } else {
        this.taskService.deleteTask(this.task.scheduleUuid)
          .subscribe(result => {
            if (result && result.result) {
              this.contentPanel.loadRecycledTask();
              this.hidden();
            }
          });
      }
    }
  }

  /**
   * 恢复任务
   */
  public restore() {
    if (this.task) {
      this.taskService.restoreTask(this.task.scheduleUuid)
        .subscribe(result => {
          if (result && result.result) {
            this.dispatcher.next(new AddTaskAction(this.task));
            this.contentPanel.loadRecycledTask();
            this.hidden();
          }
        });
    }
  }

  /**
   * 获得任务所属清单
   * @param task
   * @returns {any}
   */
  private getProject(task: Task): Project {
    let result: Project;
    this.projects.forEach(project => {
      if (project.projectUuid === task.groupUuid) {
        result = project;
      }
    });
    if (!result) {
      return {projectUuid: task.groupUuid, title: '收集箱'};
    }
    return result;
  }
}
