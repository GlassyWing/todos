import {FormControl} from '@angular/forms';
export class CustomFormValidates {
  static duplicatePassword(input: FormControl) {
    if (!input.root || !input.root.get('password')) {
      return null;
    }

    const exactMatch = input.root.get('password').value === input.value;
    return exactMatch ? null : {mismatchedPassword: true};

  }
}
