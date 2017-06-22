import {ModuleWithProviders, NgModule} from '@angular/core';
import {UserService} from './user.service';
import {CommonModule} from '@angular/common';
import {UserLoginComponent} from './user_login/user.login.component';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {UserRegistryComponent} from './user_registry/user.registry.component';
import {UserRoutingModule} from './user-routing.module';
@NgModule({
  imports: [CommonModule
    , SharedModule
    , ReactiveFormsModule
    , UserRoutingModule
  ],
  declarations: [UserLoginComponent, UserRegistryComponent],
  exports: [UserLoginComponent, UserRegistryComponent]
})
export class UserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserModule,
      providers: [UserService]
    };
  }
}
