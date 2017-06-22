/**
 * 应用程序接口
 */
export class API {

  static BASE_HOST: string = 'http://localhost:8080';

  // 用户基本接口
  static BASE_USER_API: string = API.BASE_HOST + '/api/user';

  // 用户登录接口
  static USER_LOGIN: string = API.BASE_USER_API + '/login';

  // 用户偏好
  static USER_PREFERENCE: string = API.BASE_USER_API + '/preferences/settings';

  // 用户注册接口
  static USER_SIGN_UP: string = API.BASE_USER_API + '/signup';

  // 用户注销接口
  static USER_SIGN_OUT: string = API.BASE_USER_API + '/signout';

  // 任务基本接口
  static BASE_TASK_API: string = API.BASE_HOST + '/api/task';

  static APP_STATE_API: string = API.BASE_HOST + '/api/batch';

  static APP_STATE_CHECK: string = API.APP_STATE_API + '/check';

  // 清单基本接口
  static PROJECT_BASE_API: string = API.BASE_HOST + '/api/project';

}
