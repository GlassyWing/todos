import {MdDialogRef} from '@angular/material';
import {Component} from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  template: `
    <h2 md-dialog-title>{{title}}</h2>
    <md-dialog-content>
      <p>{{ message }}</p>
    </md-dialog-content>
    <md-dialog-actions class="right-align">
      <button type="button" md-raised-button
              (click)="dialogRef.close(true)">OK
      </button>
      <button type="button" md-button
              (click)="dialogRef.close(false)">Cancel
      </button>
    </md-dialog-actions>
  `,
  styles: [
      `
      .right-align {
        justify-content: flex-end;
      }`
  ]
})
export class ConfirmDialog {

  public title: string;
  public message: string;

  constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {

  }
}
