import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import {CustomFormValidates} from '../../customs/form.validate';
import {User} from '../user.model';
import {BaseResult} from '../../shared/result.model';
import {MdSnackBar, MdSnackBarRef, SimpleSnackBar} from '@angular/material';
import {Router} from '@angular/router';

/**
 * 用户注册组件
 */
@Component({
  moduleId: module.id,
  templateUrl: './user.registry.component.html',
  styleUrls: ['./user.registry.component.css']
})
export class UserRegistryComponent {

  nickname = new FormControl('');

  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  password = new FormControl('', [
    Validators.required
  ]);

  confirmPassword = new FormControl('', [
    CustomFormValidates.duplicatePassword
  ]);

  registryForm: FormGroup = this.fb.group({
    nickname: this.nickname,
    password: this.password,
    email: this.email,
    confirmPassword: this.confirmPassword
  });

  constructor(private fb: FormBuilder
    , private userService: UserService
    , private snackBar: MdSnackBar
    , private router: Router) {
  }

  registry() {
    this.userService.signUp(this.registryForm.value)
      .subscribe((result: BaseResult<User>) => {
        if (result.result) {
          console.log('registry success');
          console.log(result.burden);
          let snackBar: MdSnackBarRef<SimpleSnackBar> = this.snackBar.open('注册成功, 您现在可以登录！', '登录', {duration: 3000});
          snackBar.afterDismissed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          if (result.message.indexOf('email') !== -1) {
            let errorMsg = result.message.replace('email:', '');
            this.email.setErrors({'email-error': errorMsg});
          }
        }
      }, error2 => {
        if (error2.status === 0) {
          this.snackBar.open('看起来服务器君翘辫子了，请呼叫维护君！', '确认', {
            duration: 3000
          });
        }
      });
    console.log(this.registryForm.value);
  }
}
