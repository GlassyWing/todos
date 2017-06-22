import {Pipe, PipeTransform} from '@angular/core';
import {DateTimeFormatter, Instant, LocalDateTime, ZoneId} from 'js-joda';
import {DecideDate} from '../utils/DecideDate';
@Pipe({
  name: 'humanReadableDate'
})
export class HumanReadableDatePipe implements PipeTransform {

  static defaultTimePattern: string = 'HH:mm:ss';

  static defaultDatePattern: string = '';

  transform(timestamp: string, standard: string): string {
    let timePattern = HumanReadableDatePipe.defaultTimePattern;

    if (!timestamp) {
      return null;
    }

    let temp: Instant = Instant.parse(timestamp);
    let datetime = LocalDateTime.ofInstant(temp, ZoneId.systemDefault());
    if (DecideDate.isToday(temp)) {
      return datetime.format(DateTimeFormatter.ofPattern(timePattern));
    } else if (DecideDate.isTomorrow(temp)) {
      return '明天';
    } else if (DecideDate.isTheDayAfterAnyDays(temp, 2)) {
      return '后天';
    } else if (DecideDate.isYesterday(temp)) {
      return '昨天';
    } else if (DecideDate.isTheDayBeforeAnyDays(temp, 2)) {
      return '前天';
    } else {
      return datetime.toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
    }
  }

}
