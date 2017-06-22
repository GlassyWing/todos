import {Project, Task, TaskGroup} from '../task/task.model';
import {GroupStrategy} from '../contracts/GroupStrategy';
import {Instant, LocalDateTime, ZoneId, ZoneOffset} from 'js-joda';

export class AppState {
  projects: Array<Project>;
  tasks: Array<Task>;
  visibilityFilter: string;
  groupStrategy: number;
  inboxId: string;
}

export class AppStateVariant {
  taskGroups: TaskGroup[];
  projects: Project[];
  visibilityFilter: string;
  groupStrategy: number;
  inboxId: string;
}

/*-------------------模拟数据------------------*/


let projects: Array<Project> = [
  {projectUuid: '1', title: '个人事项'}, {projectUuid: '2', title: '杂物'}
];

let tasks: Array<Task> = [
  {scheduleUuid: '113', title: '洗碗', groupUuid: '1', startTime: Instant.now().toString()},
  {scheduleUuid: '231', title: '吃饭', groupUuid: '2', startTime: Instant.now().toString()},
  {
    scheduleUuid: '1412',
    title: '睡觉',
    groupUuid: 'inbox_1',
    startTime: LocalDateTime.now(ZoneId.systemDefault()).toInstant(ZoneOffset.UTC).toString()
  }
];

export const mockAppState: AppState = {
  projects: projects,
  tasks: tasks,
  visibilityFilter: 'SHOW_ALL',
  groupStrategy: GroupStrategy.BY_DATE,
  inboxId: '1'
};
