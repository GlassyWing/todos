import {MdDialog, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {ProjectEditDialog} from './control_panel/project-edit-dialog.component';
import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Project} from './task.model';
import {ConfirmDialog} from './control_panel/comfirm-dialog.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) {
  }

  public addProject(projectTitle?: string, projectId?: string): Observable<Project> {

    let dialogRef: MdDialogRef<ProjectEditDialog>;

    dialogRef = this.dialog.open(ProjectEditDialog);
    dialogRef.componentInstance.title = '添加清单';
    dialogRef.componentInstance.editInput = new FormControl(projectTitle);
    dialogRef.componentInstance.projectId = projectId;

    return dialogRef.afterClosed();
  }

  public editProject(projectTitle?: string, projectId?: string): Observable<Project> {

    let dialogRef: MdDialogRef<ProjectEditDialog>;

    dialogRef = this.dialog.open(ProjectEditDialog);
    dialogRef.componentInstance.title = '编辑清单';
    dialogRef.componentInstance.editInput = new FormControl(projectTitle);
    dialogRef.componentInstance.projectId = projectId;

    return dialogRef.afterClosed();
  }

  public deleteProject(projectTitle?: string): Observable<boolean> {
    let dialogRef: MdDialogRef<ConfirmDialog>;

    dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.title = '删除清单';
    dialogRef.componentInstance.message = '你确定要删除 \''
      + projectTitle + '\' 吗?其下的所有任务都将被删除';

    return dialogRef.afterClosed();
  }
}
