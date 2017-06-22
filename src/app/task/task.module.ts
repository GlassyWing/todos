import {ModuleWithProviders, NgModule} from '@angular/core';
import {TaskService} from './task.service';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ControlPanelComponent} from './control_panel/control.panel.component';
import {CollapseModule} from 'ngx-bootstrap';
import {TaskListComponent} from './task_list/task.list.component';
import {TaskDetailPanelComponent} from './task_detail_panel/task.detail.panel.component';
import {HumanReadableDatePipe} from './human.readable.date.pipe';
import {TaskRoutingModule} from './task-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MdDialogModule} from '@angular/material';
import {ProjectEditDialog} from './control_panel/project-edit-dialog.component';
import {DialogService} from './dialog.service';
import {TaskContentPanel} from './task_content_panel/task-content-panel.component';
import {ProjectService} from './project.service';
import {ConfirmDialog} from './control_panel/comfirm-dialog.component';
@NgModule({
  imports: [CommonModule
    , ReactiveFormsModule
    , MdDialogModule
    , SharedModule
    , TaskRoutingModule
    , CollapseModule.forRoot()],
  declarations: [ControlPanelComponent
    , TaskListComponent
    , TaskContentPanel
    , TaskDetailPanelComponent
    , HumanReadableDatePipe
    , ProjectEditDialog
    , ConfirmDialog
  ],
  exports: [ControlPanelComponent, ProjectEditDialog, ConfirmDialog],
  providers: [DialogService],
  entryComponents: [
    ProjectEditDialog,
    ConfirmDialog
  ]
})
export class TaskModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TaskModule,
      providers: [TaskService, ProjectService]
    };
  }
}
