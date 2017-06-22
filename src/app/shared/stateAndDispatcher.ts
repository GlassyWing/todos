import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {
  Action, AddProjectAction, AddTaskAction, DeleteProjectAction, DeleteTaskAction, ResetStateAction, SetGroupStrategy, SetVisibilityFilter,
  UpdateProjectAction,
  UpdateTaskAction
} from './actions';
import {Project, Task} from '../task/task.model';

import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {AppState, mockAppState} from '../state/state.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

export const initState = new InjectionToken('initState');
export const dispatcher = new InjectionToken('dispatcher');
export const state = new InjectionToken('state');

export const stateAndDispatcher = [
    {
      provide: initState,
      useValue: mockAppState
    },
    {
      provide: dispatcher,
      useValue: new Subject<Action>()
    },
    {
      provide: state,
      useFactory: stateFn,
      deps: [initState, dispatcher]
    }
  ]
;

export function stateFn(initState: AppState, actions: Observable<Action>): Observable<AppState> {
  const combine = (s: Array<any>) =>
    ({projects: s[0], tasks: s[1], visibilityFilter: s[2], groupStrategy: s[3], inboxId: s[4]});
  const appState: Observable<AppState> =
    projects(initState.projects, actions)
      .zip(tasks(initState.tasks, actions)
        , filter(initState.visibilityFilter, actions)
        , groupStrategy(initState.groupStrategy, actions)
        , inboxId(initState.inboxId, actions))
      .map(combine);
  return wrapIntoBehavior(initState, appState);
}

function wrapIntoBehavior(initState: AppState, obs: Observable<AppState>): Observable<AppState> {
  const res = new BehaviorSubject(initState);
  obs.subscribe(s => res.next(s));
  return res;
}

/**
 * 处理任务状态的函数
 * @param initState
 * @param actions
 * @returns {Observable<T[]>}
 */
function tasks(initState: Task[], actions: Observable<Action>): Observable<Task[]> {

  return actions.scan((state, action) => {
    if (action instanceof ResetStateAction) {
      return action.payload.tasks ? action.payload.tasks : state;
    } else if (action instanceof AddTaskAction) {
      return [...state, action.payload];
      // 若是删除任务动作
    } else if (action instanceof DeleteTaskAction) {
      return state.filter(t => {
        return t.scheduleUuid !== action.payload.scheduleUuid;
      });
      // 若是更新任务动作
    } else {
      return state.map(t => updateTask(t, action));
    }
  }, initState);
}

function updateTask(task: Task, action: Action): Task {
  if (action instanceof UpdateTaskAction) {
    let payload = action.payload;
    return (payload.scheduleUuid !== task.scheduleUuid) ? task : payload;
  } else {
    return task;
  }
}

/**
 * 处理清单状态的函数
 * @param initState
 * @param actions
 * @returns {Observable<T[]>}
 */
function projects(initState: Project[], actions: Observable<Action>): Observable<Project[]> {
  return actions.scan((state, action) => {
    if (action instanceof ResetStateAction) {
      return action.payload.projects ? action.payload.projects : state;
    } else if (action instanceof AddProjectAction) {
      return [...state, action.payload];
    } else if (action instanceof DeleteProjectAction) {
      return state.filter(p => {
        return p.projectUuid !== action.payload.projectUuid;
      });
    } else {
      return state.map(p => updateProject(p, action));
    }
  }, initState);
}

function updateProject(project: Project, action: Action): Project {
  if (action instanceof UpdateProjectAction) {
    let payload = action.payload;
    return (payload.projectUuid !== project.projectUuid) ? project : payload;
  } else {
    return project;
  }
}

function filter(initState: string, actions: Observable<Action>): Observable<string> {
  return actions.scan((state, action) => {
    if (action instanceof SetVisibilityFilter) {
      return action.filter;
    } else {
      return state;
    }
  }, initState);
}

function groupStrategy(initState: number, actions: Observable<Action>): Observable<number> {
  return actions.scan((state, action) => {
    if (action instanceof SetGroupStrategy) {
      return action.strategy;
    } else {
      return state;
    }
  }, initState);
}

function inboxId(initState: string, actions: Observable<Action>): Observable<string> {
  return actions.scan((state, action) => {
    if (action instanceof ResetStateAction) {
      return action.payload.inboxId;
    } else {
      return state;
    }
  }, initState);
}


