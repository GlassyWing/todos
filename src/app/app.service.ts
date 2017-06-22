import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AppState} from './state/state.model';
import {Observable} from 'rxjs/Observable';
import {BaseResult} from './shared/result.model';
import {API} from './contracts/API';

import 'rxjs/add/operator/map';

@Injectable()
export class AppStateService {


  constructor(private http: Http) {
  }

  /**
   * 获得系统的状态
   * @param checkPoint
   * @returns {Observable<R>}
   */
  appState(checkPoint: number): Observable<BaseResult<AppState>> {
    return this.http.get(API.APP_STATE_CHECK + '/' + checkPoint, new RequestOptions({ withCredentials: true }))
      .map(response => {
        return response.json();
      });
  }
}
