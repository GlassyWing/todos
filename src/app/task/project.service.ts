import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {Project} from './task.model';
import {API} from '../contracts/API';
import {Observable} from 'rxjs/Observable';
import {BaseResult} from '../shared/result.model';
@Injectable()
export class ProjectService {

  constructor(private http: Http) {

  }

  /**
   * 添加清单
   * @param project
   * @returns {Observable<R>}
   */
  addProject(project: Project): Observable<BaseResult<Project>> {
    return this.http.post(API.PROJECT_BASE_API, project, new RequestOptions({withCredentials: true}))
      .map(response => response.json());
  }

  /**
   * 删除清单
   * @param projectId
   * @returns {Observable<R>}
   */
  deleteProject(projectId: string): Observable<BaseResult<any>> {
    return this.http.delete(API.PROJECT_BASE_API + '/' + projectId)
      .map(response => response.json());
  }

  /**
   * 更新清单
   * @param project
   * @returns {Observable<R>}
   */
  updateProject(project: Project): Observable<BaseResult<Project>> {
    return this.http.put(API.PROJECT_BASE_API, project, new RequestOptions({withCredentials: true}))
      .map(response => response.json());
  }
}
