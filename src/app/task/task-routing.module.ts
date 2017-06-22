import {RouterModule, Routes} from '@angular/router';
import {ControlPanelComponent} from './control_panel/control.panel.component';
import {NgModule} from '@angular/core';
import {TaskDetailPanelComponent} from './task_detail_panel/task.detail.panel.component';
import {TaskContentPanel} from './task_content_panel/task-content-panel.component';

export const taskRoutes: Routes = [
  {path: 'tasks', component: ControlPanelComponent},
  {path: 'tasks/:id', component: ControlPanelComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(taskRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TaskRoutingModule {

}
