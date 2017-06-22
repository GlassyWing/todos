import {UserRegistryComponent} from './user_registry/user.registry.component';
import {UserLoginComponent} from './user_login/user.login.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
export const userRoutes: Routes = [
  {path: 'login', component: UserLoginComponent},
  {path: 'signup', component: UserRegistryComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule {

}
