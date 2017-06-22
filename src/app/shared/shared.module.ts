import {ModuleWithProviders, NgModule} from '@angular/core';
import {LogoComponent} from './logo/logo.component';
import {CommonModule} from '@angular/common';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdDatepickerModule, MdDialogModule, MdIconModule, MdInputModule, MdListModule,
  MdMenuModule, MdSidenavModule,
  MdSnackBarModule, MdTabsModule, MdToolbarModule
} from '@angular/material';
import {stateAndDispatcher} from './stateAndDispatcher';
import {Md2Module} from 'md2';

@NgModule({
    imports: [CommonModule
      , MdCardModule
      , MdInputModule
      , MdButtonModule
      , MdIconModule
      , MdSnackBarModule
      , MdSidenavModule
      , MdToolbarModule
      , MdListModule
      , MdMenuModule
      , MdTabsModule
      , MdCheckboxModule
      , MdDialogModule
      , MdDatepickerModule
      , Md2Module
    ],
    declarations: [LogoComponent],
    exports: [LogoComponent
      , MdCardModule
      , MdInputModule
      , MdButtonModule
      , MdIconModule
      , MdSnackBarModule
      , MdSidenavModule
      , MdToolbarModule
      , MdListModule
      , MdMenuModule
      , MdTabsModule
      , MdCheckboxModule
      , MdDialogModule
      , MdDatepickerModule
      , Md2Module
    ]
  }
)
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: stateAndDispatcher
    };
  }
}
