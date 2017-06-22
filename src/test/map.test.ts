import {TaskGroup} from '../app/task/task.model';
let a: { [key: string]: any } = {'today': [], 'tomorrow': [], 'recently': []};
a['after'] = [];

function mapToEntity(map: { [key: string]: any }) {
  let result: Array<TaskGroup> = [];
  Object.keys(map).forEach(k => {
    let temp = new TaskGroup();
    temp.title = k;
    temp.tasks = map[k];
    result.push(temp);
  });
  return result;
}


console.log(mapToEntity(a));
