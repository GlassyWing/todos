import {
  Component, EventEmitter, Inject, OnDestroy, OnInit, Output,
} from '@angular/core';
import {TaskService} from '../task.service';
import {dispatcher, state} from '../../shared/stateAndDispatcher';
import {Observable} from 'rxjs/Observable';
import {AppState, AppStateVariant} from '../../state/state.model';
import {Subject} from 'rxjs/Subject';
import {Action, AddTaskAction, SetGroupStrategy} from '../../shared/actions';
import {Project, Task, TaskGroup} from '../task.model';
import {DecideDate} from '../../utils/DecideDate';
import {GroupStrategy} from '../../contracts/GroupStrategy';
import {Subscription} from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';
import {Clock, Instant} from 'js-joda';
import {TaskDetailPanelComponent} from '../task_detail_panel/task.detail.panel.component';

@Component({
  moduleId: module.id,
  selector: 'task-content',
  templateUrl: './task-content-panel.component.html',
  styleUrls: ['./task-content-panel.component.css']
})
export class TaskContentPanel implements OnInit, OnDestroy {

  @Output() toggle = new EventEmitter();

  // 是否开启回收模式
  recycleModal: boolean = false;

  // 详情面板引用
  detailPanel: TaskDetailPanelComponent;

  // 系统状态
  appStateVariant: AppStateVariant;

  title: string = '所有';

  project: string = '收集箱';

  currentProjectUuid: string;

  // 工具栏是否可用
  editable: boolean = true;

  // 已回收的任务
  recycledTasks: Task[];

  // 任务添加部件
  addTaskInput: FormControl = new FormControl('');

  private subscriptionForAppState: Subscription;

  ngOnInit(): void {
    this.subscriptionForAppState = this.filteredAndGrouped.subscribe(appState => {
      console.log('new action fired');
      this.appStateVariant = appState;
    });
  }


  ngOnDestroy(): void {
    this.subscriptionForAppState.unsubscribe();
  }


  constructor(private taskService: TaskService
    , @Inject(state) private state: Observable<AppState>
    , @Inject(dispatcher) private dispatcher: Subject<Action>) {

  }

  public setRecycleModelOn() {
    this.recycleModal = true;
  }

  /**
   * 重置
   */
  public reset() {
    this.recycleModal = false;
    this.editable = true;
  }

  /**
   * 添加任务
   */
  public addTask() {
    if (this.addTaskInput.value && !this.addTaskInput.value.match(/^\s+$/)) {
      let newTask = new Task(this.addTaskInput.value);
      console.log(this.currentProjectUuid);
      if (this.currentProjectUuid) {
        newTask.groupUuid = this.currentProjectUuid;
      } else {
        newTask.groupUuid = this.appStateVariant.inboxId;
      }
      console.log(newTask);
      this.taskService.addTask(newTask).subscribe(result => {
        if (result && result.result) {
          this.dispatcher.next(new AddTaskAction(result.burden));
          this.addTaskInput.reset();
        }
      });
    }
  }

  // 切换侧边栏
  public switch() {
    this.toggle.emit();
  }

  /**
   * 载入已回收的日程
   */
  public loadRecycledTask() {
    this.taskService.getAllRecycledTasks()
      .subscribe(result => {
        if (result && result.burden) {
          this.recycledTasks = result.burden;
        }
      });
  }

  /**
   * 显示任务详情
   * @param taskId
   */
  public showDetail(taskId: string) {
    this.detailPanel.loadTaskDetail(taskId);
  }

  public setTitleAndInfo(title: string, projectInfo: string) {
    this.title = title;
    this.project = projectInfo;
  }

  /**
   * 按分组策略分组
   * @param groupStrategy
   */
  public group(groupStrategy: number) {
    this.dispatcher.next(new SetGroupStrategy(groupStrategy));
  }

  /**
   * 获得已过滤并分组后的系统状态
   * @returns {Observable<R>}
   */
  public get filteredAndGrouped(): Observable<AppStateVariant> {
    return this.state
      .map(s => {
        return {
          taskGroups: this.getTaskGroup(
            this.getVisibleTasks(s.tasks, s.visibilityFilter)
            , s.projects
            , s.groupStrategy
          ),
          projects: s.projects,
          visibilityFilter: s.visibilityFilter,
          groupStrategy: s.groupStrategy,
          inboxId: s.inboxId
        };
      });
  }

  /**
   * 获得任务组
   * @param taskList
   * @param projects
   * @param groupStrategy
   * @returns {Array<TaskGroup>}
   */
  private getTaskGroup(taskList: Array<Task>, projects: Array<Project>, groupStrategy: number): Array<TaskGroup> {
    let map: { [key: string]: Array<Task> } = {};
    switch (groupStrategy) {
      case GroupStrategy.BY_DATE:
        taskList.forEach(task => {
          this.groupByDate(task, map);
        });
        break;
      case GroupStrategy.BY_PROJECT:
        taskList.forEach(task => {
          this.groupByProject(task, map, projects);
        });
        break;
    }
    return this.mapToTaskGroup(map);
  }

  /**
   * 按日期分组
   * @param task
   * @param map
   */
  private groupByDate(task: Task, map: { [key: string]: Array<Task> }) {

    if (task.startTime == null) {
      if (!('无日期' in map)) {
        map['无日期'] = [];
      }
      map['无日期'].push(task);
    } else if (DecideDate.isToday(task.startTime)) {
      if (!('今天' in map)) {
        map['今天'] = [];
      }
      map['今天'].push(task);
    } else if (DecideDate.isTomorrow(task.startTime)) {
      if (!('明天' in map)) {
        map['明天'] = [];
      }
      map['明天'].push(task);
    } else if (DecideDate.isOutOfDate(task.startTime)) {
      if (!('已过期' in map)) {
        map['已过期'] = [];
      }
      map['已过期'].push(task);
    } else {
      if (!('以后' in map)) {
        map['以后'] = [];
      }
      map['以后'].push(task);
    }
  }

  /**
   * 按清单分组
   * @param task
   * @param map
   * @param projects
   */
  private groupByProject(task: Task, map: { [key: string]: Array<Task> }, projects: Array<Project>) {
    projects.forEach(project => {
      if (task.groupUuid === project.projectUuid) {
        if (!(project.title in map)) {
          map[project.title] = [];
        }
        map[project.title].push(task);
      }
    });

  }

  /**
   * 根据过滤器获得最终可见的任务
   * @param taskList
   * @param visibilityFilter
   * @returns {Array<Task>}
   */
  private getVisibleTasks(taskList: Array<Task>, visibilityFilter: string): Array<Task> {
    let items: Array<Task> = [];
    taskList.forEach(item => {
      let ok = false;
      switch (visibilityFilter) {
        case 'SHOW_ALL':
          ok = true;
          break;
        case 'SHOW_TODAY':
          ok = item.startTime != null && DecideDate.isToday(item.startTime);
          break;
        case 'SHOW_TOMORROW':
          ok = DecideDate.isTheDayAfterAnyDays(item.startTime, 1);
          break;
        case 'SHOW_INBOX':
          ok = item.groupUuid.indexOf('inbox') !== -1;
          break;
        case 'SHOW_COMPLETED':
          ok = item.status === 2;
          break;
        default:
          ok = visibilityFilter === item.groupUuid;
          break;
      }

      if (ok) {
        items.push(item);
      }

    });

    return items;
  }

  private mapToTaskGroup(map: { [key: string]: any }): Array<TaskGroup> {
    let result: Array<TaskGroup> = [];
    Object.keys(map).forEach(k => {
      let temp = new TaskGroup();
      temp.title = k;
      temp.tasks = map[k];
      result.push(temp);
    });
    return result;
  }
}
