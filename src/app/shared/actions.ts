import {Project, Task} from '../task/task.model';
import {AppState} from '../state/state.model';

export class GenericAction<T> {
  constructor(public payload: T) {
  }
}

export class TaskAction<T> extends GenericAction<T> {
}

export class ProjectAction<T> extends GenericAction<T> {
}

export class ResetStateAction extends GenericAction<AppState> {
}

export class AddTaskAction extends TaskAction<Task> {
}

export class DeleteTaskAction extends TaskAction<Task> {
}

export class UpdateTaskAction extends TaskAction<Task> {
}

export class AddProjectAction extends ProjectAction<Project> {
}
export class DeleteProjectAction extends ProjectAction<Project> {
}
export class UpdateProjectAction extends ProjectAction<Project> {
}

export class SetVisibilityFilter {
  constructor(public filter: string) {
  }
}

export class SetGroupStrategy {
  constructor(public strategy: number) {
  }
}
export type Action = ProjectAction<Project | Project[]>
  | TaskAction<Task | Task[]>
  | ResetStateAction
  | SetVisibilityFilter
  | SetGroupStrategy;
