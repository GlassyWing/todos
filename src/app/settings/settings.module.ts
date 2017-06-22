import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SettingsComponent} from './settings/settings.component';
import {MdSelectModule, MdSlideToggleModule} from '@angular/material';
@NgModule({
  imports: [CommonModule, SharedModule, ReactiveFormsModule, MdSelectModule, MdSlideToggleModule],
  declarations: [SettingsComponent],
  exports: [SettingsComponent]
})
export class SettingsModule {

}
