import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Project} from '../task.model';
@Component({
  selector: 'project-edit-dialog',
  template: `
    <h2 md-dialog-title>{{title}}</h2>
    <md-dialog-content>
      <md-input-container>
        <input class="edit-line" [formControl]="editInput" mdInput placeholder="请输入清单名称" required/>
        <md-error *ngIf="editInput.hasError('required')" align="end">
          清单名称不能为空
        </md-error>
      </md-input-container>
    </md-dialog-content>
    <md-dialog-actions class="right-align">
      <button type="button" md-raised-button [disabled]="editInput.invalid" (click)="resolve()">
        确认
      </button>
      <button type="button" md-button md-dialog-close>
        取消
      </button>
    </md-dialog-actions>
  `,
  styles: [
      `
      .edit-line {
        width: 300px;
      }

      .right-align {
        justify-content: flex-end;
      }
    `
  ]
})
export class ProjectEditDialog {

  public projectId: string;

  public title: string;

  public editInput: FormControl;

  constructor(public dialogRef: MdDialogRef<ProjectEditDialog>) {

  }

  resolve() {
    if (this.editInput.valid) {
      let project: Project = new Project(this.editInput.value);
      project.projectUuid = this.projectId;
      this.dialogRef.close(project);
    }
  }
}
