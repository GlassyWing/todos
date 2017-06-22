import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import {BaseResult} from '../../shared/result.model';
import {User} from '../user.model';
import {MdSnackBar} from '@angular/material';
import {AppStateService} from '../../app.service';
import {Router} from '@angular/router';

/**
 * 用户登录组件
 */
@Component({
  moduleId: module.id,
  selector: 'user-login',
  templateUrl: './user.login.component.html',
  styleUrls: ['./user.login.component.css']
})
export class UserLoginComponent {

  emailMsg: string = '';

  passwordMsg: string = '';

  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  password = new FormControl('', [
    Validators.required
  ]);

  loginForm: FormGroup = this.fb.group({
    email: this.email,
    password: this.password
  });

  constructor(private fb: FormBuilder
    , private userService: UserService
    , private appStateService: AppStateService
    , private snackBar: MdSnackBar
    , private router: Router) {
  }

  login() {
    this.userService.login(this.loginForm.value)
      .subscribe((result: BaseResult<User>) => {

        // 登录成功
        if (result.result) {
          console.log(this.userService.currentUser());
          this.router.navigate(['/tasks/all']);
        } else {
          if (result.message.indexOf('email') !== -1) {
            this.emailMsg = result.message.replace('email:', '');
            this.email.setErrors({'email-error': this.emailMsg});
          }
          if (result.message.indexOf('password') !== -1) {
            this.passwordMsg = result.message.replace('password:', '');
            this.password.setErrors({'password-error': this.passwordMsg});
          }

        }
      }, error2 => {
        console.log(error2);
        if (error2.status === 0) {
          this.snackBar.open('看起来服务器君翘辫子了，请呼叫维护君！', '确认', {
            duration: 3000
          });
        }
      });
    console.log(this.loginForm.value);
  }

}
