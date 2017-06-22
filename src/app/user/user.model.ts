export class User {

  nickname: string;

  userUuid: string;

  email: string;

  password: string;

  preferences?: Preferences;


  constructor(email?: string, password?: string) {
    this.email = email;
    this.password = password;
  }
}

export class Preferences {

  preferencesUuid: string;

  startDayOfWeek: string;

  dailyRemindTime: Array<number>;

  dailyRemindToggle: boolean;

  defaultRemindBefore: string;

  defaultPriority: number;

  timeZone: string;
}

