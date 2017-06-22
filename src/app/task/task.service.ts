import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {Task} from './task.model';
import {Observable} from 'rxjs/Observable';
import {BaseResult} from '../shared/result.model';
import {API} from '../contracts/API';
import {Instant} from 'js-joda';

/**
 * 任务服务
 */
@Injectable()
export class TaskService {

  constructor(private http: Http) {
  }

  /**
   * 添加任务
   * @param task
   * @returns {Observable<R>}
   */
  addTask(task: Task): Observable<BaseResult<Task>> {
    return this.http.post(API.BASE_TASK_API, task, new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }


  /**
   * 删除任务
   * @param taskId
   * @returns {Observable<R>}
   */
  deleteTask(taskId: string): Observable<BaseResult<any>> {
    return this.http.delete(API.BASE_TASK_API + '/' + taskId, new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 回收任务
   * @param taskId
   * @returns {Observable<R>}
   */
  recycleTask(taskId: string): Observable<BaseResult<Task>> {
    return this.http.put(API.BASE_TASK_API + '/' + taskId + '/recycle', new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 恢复任务
   * @param taskId
   */
  restoreTask(taskId: string): Observable<BaseResult<Task>> {
    return this.http.put(API.BASE_TASK_API + '/' + taskId + '/restore', new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 获得所有已回收的任务
   * @returns {Observable<R>}
   */
  getAllRecycledTasks(): Observable<BaseResult<Task[]>> {
    return this.http.get(API.BASE_TASK_API + '/recycled', new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 获取任务
   * @param taskId
   * @returns {Observable<R>}
   */
  getTask(taskId: string): Observable<BaseResult<Task>> {
    return this.http.get(API.BASE_TASK_API + '/' + taskId, new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 更新日程
   * @param task
   * @returns {Observable<R>}
   */
  updateTask(task: Task): Observable<BaseResult<Task>> {
    return this.http.put(API.BASE_TASK_API, task, new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 完成任务
   * @param taskId
   * @returns {Observable<R>}
   */
  completeTask(taskId: string): Observable<BaseResult<Task>> {
    return this.http.put(API.BASE_TASK_API + '/' + taskId + '/complete'
      , new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 设置任务为未完成
   * @param taskId
   * @returns {Observable<R>}
   */
  incompleteTask(taskId: string): Observable<BaseResult<Task>> {
    return this.http.put(API.BASE_TASK_API + '/' + taskId + '/incomplete'
      , new RequestOptions({withCredentials: true}))
      .map(response => {
        return response.json();
      });
  }

  /**
   * 获得已完成的任务
   * @param beginTime
   * @param endTime
   * @param limit
   * @returns {Observable<R>}
   */
  getCompletedTask(beginTime: Instant, endTime: Instant, limit?: number): Observable<Task[]> {
    let params = {
      to: endTime.toString(),
      limit: limit
    };
    if (beginTime) {
      params['from'] = beginTime.toString();
    }
    return this.http.get(API.BASE_TASK_API + '/completed'
      , new RequestOptions({
        withCredentials: true,
        params: params
      }))
      .map(response => {
        let result: BaseResult<Task[]> = response.json();
        if (result && result.result) {
          return result.burden;
        } else {
          return [];
        }
      });
  }

}
