import {Component, OnInit} from '@angular/core';
import {User} from '../../user/user.model';
import {UserService} from '../../user/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppConst} from '../../contracts/AppConst';
import {MdSnackBar} from '@angular/material';
import * as moment from 'moment';
import {Router} from '@angular/router';
@Component({
  moduleId: module.id,
  selector: 'setting',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private user: User;

  /*------------------用户设置--------------------------*/

  public showEmailEditor: boolean = false;

  public showPasswordEditor: boolean = false;

  private nickname: FormControl;

  private emailEditorEmail: FormControl;

  private emailEditorPwd: FormControl;

  private pwdEditorOriginPwd: FormControl;

  private pwdEditorNewPwd: FormControl;

  private emailEditor: FormGroup;

  private pwdEditor: FormGroup;

  emailEditorPasswordMsg: string;

  pwdEditorPasswordMsg: string;

  /*------------------偏好设置----------------------*/
  startOfDays = [
    {code: 'SUNDAY', name: '周日'},
    {code: 'SATURDAY', name: '周六'}
    , {code: 'MONDAY', name: '周一'}];

  startOfDayControl: FormControl;

  dailyRemindTimeControl: FormControl;

  dailyRemindToggleControl: FormControl;

  durations = [
    {code: 0, name: '准时'},
    {code: 300, name: '提前5分钟'},
    {code: 1800, name: '提前30分钟'}];

  defaultRemindBeforeControl: FormControl;

  priorities = [
    {code: 0, name: '无'},
    {code: 1, name: '低'},
    {code: 2, name: '中'},
    {code: 3, name: '高'}
  ];

  defaultPriorityControl: FormControl;

  preferencesGroup: FormGroup;


  ngOnInit(): void {
    this.nickname.valueChanges
      .debounceTime(400)
      .switchMap(value => {
        let newUser = Object.assign({}, this.user, {nickname: value});
        this.user = newUser;
        return this.userService.changeNickname(newUser);
      })
      .subscribe(result => {
        if (result && result.result) {
          localStorage.setItem(AppConst.USER_LOGIN_KEY, JSON.stringify(result.burden));
        }
      });
    this.preferencesGroup.valueChanges
      .debounceTime(500)
      .switchMap(value => {
        console.log("before set", value);
        if (value.dailyRemindTime) {
          let utcTime = moment(moment(value.dailyRemindTime).utc());
          value.dailyRemindTime = [utcTime.hour(), utcTime.minute()];
        }
        this.user.preferences = Object.assign({}, this.user.preferences, value);
        console.log("set preference: ", this.user.preferences);
        return this.userService.setPreferences(this.user.preferences);
      })
      .subscribe(result => {
        if (result && result.result) {
          localStorage.setItem(AppConst.USER_LOGIN_KEY, JSON.stringify(this.user));
        }
      });
  }

  constructor(private userService: UserService
    , private snackBar: MdSnackBar
    , private router: Router
    , private fb: FormBuilder) {
    this.user = userService.currentUser();

    // console.log(this.user);

    this.nickname = new FormControl(this.user.nickname);
    this.emailEditorEmail = new FormControl(this.user.email, [Validators.required, Validators.email]);
    this.emailEditorPwd = new FormControl('', Validators.required);
    this.pwdEditorOriginPwd = new FormControl('', Validators.required);
    this.pwdEditorNewPwd = new FormControl('', Validators.required);
    this.emailEditor = this.fb.group({
      email: this.emailEditorEmail,
      password: this.emailEditorPwd
    });

    this.pwdEditor = this.fb.group({
      password: this.pwdEditorOriginPwd,
      newPassword: this.pwdEditorNewPwd
    });

    // 偏好设置组件
    this.startOfDayControl = new FormControl(this.user.preferences.startDayOfWeek);
    this.dailyRemindTimeControl = new FormControl(moment.utc([2000, 1, 1].concat(this.user.preferences.dailyRemindTime).concat(0)).toDate());
    this.dailyRemindToggleControl = new FormControl(this.user.preferences.dailyRemindToggle);
    this.defaultRemindBeforeControl = new FormControl(this.user.preferences.defaultRemindBefore);
    this.defaultPriorityControl = new FormControl(this.user.preferences.defaultPriority);

    this.preferencesGroup = this.fb.group({
      startDayOfWeek: this.startOfDayControl,
      dailyRemindTime: this.dailyRemindTimeControl,
      dailyRemindToggle: this.dailyRemindToggleControl,
      defaultRemindBefore: this.defaultRemindBeforeControl,
      defaultPriority: this.defaultPriorityControl
    });
  }

  /**
   * 更改密码
   */
  public changePassword() {
    if (this.pwdEditor.valid) {
      let newUser = Object.assign({}, this.user, this.pwdEditor.value);
      // console.log('To change user: ', newUser);
      this.userService.changePassword(newUser).subscribe(result => {
        if (result) {
          if (result.result) {
            this.user = newUser;
            localStorage.setItem(AppConst.USER_LOGIN_KEY, JSON.stringify(newUser));
            this.pwdEditor.reset();
            this.snackBar.open('更改密码成功', '确认', {duration: 3000});
          } else {
            if (result.message.indexOf('password') !== -1) {
              this.pwdEditorPasswordMsg = result.message.replace('password:', '');
              this.pwdEditorOriginPwd.setErrors({'password-error': this.pwdEditorPasswordMsg});
            }
          }
        }
      });
    }
  }

  /**
   * 更改邮箱
   */
  public changeEmail() {
    if (this.emailEditor.valid) {
      let newUser = Object.assign({}, this.user, this.emailEditor.value);
      // console.log('To change user: ', newUser);
      this.userService.changeEmail(newUser).subscribe(result => {
        if (result) {
          if (result.result) {
            this.user = newUser;
            localStorage.setItem(AppConst.USER_LOGIN_KEY, JSON.stringify(newUser));
            this.snackBar.open('更改邮箱成功', '确认', {duration: 3000});
          } else {
            if (result.message.indexOf('password') !== -1) {
              this.emailEditorPasswordMsg = result.message.replace('password:', '');
              this.emailEditor.reset();
              this.emailEditorPwd.setErrors({'password-error': this.emailEditorPasswordMsg});
            }
          }
        }
      });
    }
  }

  /**
   * 完成设置
   */
  public done() {
    this.router.navigate(['/tasks/all']);
  }

}
