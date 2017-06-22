import {
  Component, Inject, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import {dispatcher, state} from '../../shared/stateAndDispatcher';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../state/state.model';
import {Subject} from 'rxjs/Subject';
import {Action, AddProjectAction, ResetStateAction, SetVisibilityFilter, UpdateProjectAction} from '../../shared/actions';
import {Subscription} from 'rxjs/Subscription';
import {UserService} from '../../user/user.service';
import {AppStateService} from '../../app.service';
import {TaskDetailPanelComponent} from '../task_detail_panel/task.detail.panel.component';
import {DialogService} from '../dialog.service';
import {TaskContentPanel} from '../task_content_panel/task-content-panel.component';
import {Project} from '../task.model';
import {ProjectService} from '../project.service';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'control-panel',
  templateUrl: './control.panel.component.html',
  styleUrls: ['./control.panel.component.css']
})
export class ControlPanelComponent implements OnInit, OnDestroy {

  // 任务展示面板引用
  @ViewChild(TaskContentPanel) contentPanel: TaskContentPanel;

  // 详情面板引用
  @ViewChild(TaskDetailPanelComponent) detailPanel: TaskDetailPanelComponent;

  // 系统状态
  appState: AppState;

  username: string = '';

  title: string = '所有';

  project: string = '收集箱';

  private subscriptionForAppState: Subscription;

  ngOnInit(): void {
    let user = this.userService.currentUser();
    console.log('current user', user);
    if (user.nickname && !user.nickname.match(/^\s+$/)) {
      this.username = user.nickname;
    } else {
      this.username = user.email;
    }

    this.subscriptionForAppState = this.state.subscribe(
      state => this.appState = state
    );

    // 重置系统状态
    this.appStateService.appState(0).subscribe(result => {
      if (result && result.result) {
        let newAppState = result.burden;
        this.dispatcher.next(new ResetStateAction(newAppState));
      }
    });

    this.contentPanel.detailPanel = this.detailPanel;
    this.detailPanel.contentPanel = this.contentPanel;
  }


  ngOnDestroy(): void {
    this.subscriptionForAppState.unsubscribe();
  }


  constructor(private userService: UserService
    , private appStateService: AppStateService
    , private dialogService: DialogService
    , private projectService: ProjectService
    , @Inject(state) private state: Observable<AppState>
    , @Inject(dispatcher) private dispatcher: Subject<Action>
    , private router: Router) {

  }

  public reset() {
    this.detailPanel.reset();
    this.contentPanel.reset();
  }

  /**
   * 添加清单
   */
  public addProject(event: any) {
    event.stopPropagation();
    this.dialogService.addProject()
      .flatMap(project => {
        if (project) {
          return this.projectService.addProject(project);
        }
        return Observable.of(null);
      })
      .subscribe(result => {
        if (result && result.result) {
          this.dispatcher.next(new AddProjectAction(result.burden));
        }
      });

  }

  /**
   * 编辑清单
   * @param project
   */
  public editProject(project: Project, event: any) {
    event.stopPropagation();
    this.dialogService.editProject(project.title, project.projectUuid)
      .flatMap(project => {
        if (project) {
          return this.projectService.updateProject(project);
        }
        return Observable.of(null);
      })
      .subscribe(result => {
        if (result && result.result) {
          this.dispatcher.next(new UpdateProjectAction(result.burden));
        }
      });
  }

  /**
   * 删除清单
   * @param project
   * @param event
   */
  public deleteProject(project: Project, event: any) {
    event.stopPropagation();
    this.dialogService.deleteProject(project.title)
      .subscribe(result => {
        if (result) {
          this.projectService.deleteProject(project.projectUuid)
            .subscribe(result => {
              if (result && result.result) {
                this.appStateService.appState(0)
                  .subscribe(result => {
                    if (result && result.result) {
                      this.dispatcher.next(new ResetStateAction(result.burden));
                    }
                  });
              }
            });
        }
      });
  }

  /**
   * 载入已回收的任务
   */
  public loadRecycledTasks() {
    this.contentPanel.loadRecycledTask();
    this.contentPanel.setRecycleModelOn();
    this.detailPanel.setRecycleModalOn();
  }

  /**
   * 显示任务，根据过滤器过滤任务
   * @param filter
   */
  public show(filter: string) {
    this.dispatcher.next(new SetVisibilityFilter(filter));
    this.detailPanel.hidden();
    this.detailPanel.reset();
  }

  public setEditable(editable: boolean) {
    this.contentPanel.editable = editable;
  }

  /**
   * 设置信息
   * @param title
   * @param projectInfo
   */
  public setContentInfo(title: string, projectInfo: string) {
    this.contentPanel.setTitleAndInfo(title, projectInfo);
  }

  public setCurrentProject(projectId: string) {
    this.contentPanel.currentProjectUuid = projectId;
  }

  /**
   * 退出登录
   */
  public exit() {
    this.userService.signOut();
    this.router.navigate(['/login']);
  }

  public setting() {
    this.router.navigate(['/settings']);
  }

}
