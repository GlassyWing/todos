import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response} from '@angular/http';
import {API} from '../contracts/API';
import {AppConst} from '../contracts/AppConst';

import 'rxjs/add/operator/map';
import {JSON2EntityMapHelper} from '../utils/JSON2EntityMapHelper';
import {Observable} from 'rxjs/Observable';
import {Preferences, User} from './user.model';
import {BaseResult} from '../shared/result.model';

/**
 * 用户服务
 */
@Injectable()
export class UserService {

  /**
   * 依赖于Http
   * @param http
   */
  constructor(private http: Http) {
  }

  /**
   * 用户登录
   * @param info
   * @returns {Observable<R>}
   */
  public login(info: { email: string, password: string }): Observable<BaseResult<User>> {
    return this.http
      .post(API.USER_LOGIN, info, new RequestOptions({withCredentials: true}))
      .map((response: Response) => {
        let result = response.json();

        // 在登录成功后，保存用户到本地存储
        if (result && result.result) {
          localStorage.setItem(AppConst.USER_LOGIN_KEY, JSON.stringify(result.burden));
        }

        return JSON2EntityMapHelper.convertToEntity<BaseResult<User>>(result);

      });
  }

  /**
   * 设置用户偏好
   * @param preferences
   * @returns {Observable<R>}
   */
  public setPreferences(preferences: Preferences): Observable<BaseResult<Preferences>> {
    return this.http.put(API.USER_PREFERENCE, preferences, new RequestOptions({withCredentials: true}))
      .map(response => response.json());
  }

  /**
   * 变更密码
   * @param user
   * @returns {Observable<R>}
   */
  public changePassword(user: User): Observable<BaseResult<User>> {
    return this.http.post(API.BASE_USER_API + '/changePassword', user, new RequestOptions({withCredentials: true}))
      .map(response => response.json());
  }

  /**
   * 修改昵称
   * @param user
   */
  public changeNickname(user: User): Observable<BaseResult<User>> {
    return this.http.post(API.BASE_USER_API + '/nickname', user, new RequestOptions({withCredentials: true}))
      .map(response => response.json());
  }

  /**
   * 变更邮箱
   * @param user
   * @returns {Observable<R>}
   */
  public changeEmail(user: User): Observable<BaseResult<User>> {
    return this.http.post(API.BASE_USER_API + '/email', user, new RequestOptions({withCredentials: true}))
      .map(response => response.json());
  }

  /**
   * 用户注册
   * @param user 用户对象
   * @returns {Observable<R>}
   */
  public signUp(user: User): Observable<BaseResult<User>> {
    return this.http.post(API.USER_SIGN_UP, user)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   * 用户注销
   * @returns {Observable<R>}
   */
  public signOut(): Observable<boolean> {
    localStorage.removeItem(AppConst.USER_LOGIN_KEY);
    return this.http.get(API.USER_SIGN_OUT, new RequestOptions({withCredentials: true}))
      .map<Response, boolean>((response: Response) => {
        let result = response.json();
        return result && result.result;
      });
  }

  /**
   * 获得当前已登录的用户
   * @returns {any}
   */
  public currentUser(): User {
    return JSON.parse(localStorage.getItem(AppConst.USER_LOGIN_KEY));
  }

}
