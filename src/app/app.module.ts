import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './app.component';
import {HttpModule} from '@angular/http';
import {UserModule} from './user/user.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {TaskModule} from './task/task.module';
import {AppStateService} from './app.service';
import {AppRoutingModule} from './app-routing.module';
import {SettingsModule} from './settings/settings.module';

@NgModule({
  imports: [
    BrowserModule
    , HttpModule
    , BrowserAnimationsModule
    , SettingsModule
    , SharedModule.forRoot()
    , UserModule.forRoot()
    , TaskModule.forRoot()
    , AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [AppStateService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
