import {Subject} from 'rxjs/Subject';
import {Action, AddProjectAction, AddTaskAction, DeleteTaskAction, ResetStateAction, SetGroupStrategy} from '../app/shared/actions';
import {stateFn} from '../app/shared/stateAndDispatcher';
import {GroupStrategy} from '../app/contracts/GroupStrategy';
import {Project, Task} from '../app/task/task.model';

const actions = new Subject<Action>();
const states = stateFn({
  projects: [],
  tasks: [],
  visibilityFilter: 'SHOW_ALL',
  groupStrategy: GroupStrategy.BY_DATE,
  inboxId: 'inbox_14902'
}, actions);

let task: Task = {scheduleUuid: '1', title: '看电视'};

actions.next(new AddTaskAction(task));
actions.next(new AddTaskAction(new Task('读书')));
actions.next(new AddTaskAction(new Task('写作')));

actions.next(new AddProjectAction(new Project('个人实习')));

actions.next(new DeleteTaskAction(task));

actions.next(new SetGroupStrategy(GroupStrategy.BY_PROJECT));

// actions.next(new ResetStateAction(mockAppState));


states.subscribe(s => {
  console.log(s);
});
