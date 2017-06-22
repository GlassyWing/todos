export class Task {
  scheduleUuid?: string;
  userUuid?: string;
  parentUuid?: string;
  groupUuid?: string;
  locationUuid?: string;
  createTime?: string;
  startTime?: string;
  completeTime?: string;
  dueTime?: string;
  modifyTime?: string;
  sortOrder?: number = 0;
  allDay?: boolean;
  priority?: number = 0;
  progress?: number = 0.0;
  title: string;
  summary?: string;
  content?: string;
  status?: number = 0;
  repetition?: Repetition;
  remindTime?: string;
  reminders?: Array<Reminder>;

  constructor(title?: string, content?: string) {
    this.title = title;
    this.content = content;
  }
}

export class TaskGroup {
  title: string;
  tasks: Task[];
}

export class Repetition {
  repetitionUuid: string;
  scheduleUuid: string;
  until: string;
  repeatOn: number;
  cron: string;
}

export class Reminder {
  remindUuid: string;
  scheduleUuid: string;
  duration: string;
}

export class Project {
  projectUuid?: string;

  userUuid?: string;

  title: string;

  constructor(title?: string) {
    this.title = title;
  }
}
