import {Clock, Instant, LocalDate, LocalDateTime, ZoneId} from 'js-joda';
import * as moment from 'moment';
import {DecideDate} from '../app/utils/DecideDate';

// let instance = Instant.now();
// console.log(instance.toString());
// let time = moment(instance.toString());
// let date = moment(Date.now());
// console.log(time.toISOString());
// console.log(date);
// console.log(moment(date.toISOString()).toISOString());
//
// let array = [2000, 1, 14].concat([9, 0]).concat(0);
// let arrayDate = moment.utc(array);
// console.log(date.hour(), date.minute());
// console.log(moment(date.utc()).hour())

let time: Instant = Instant.parse('2017-06-22T09:05:48.000Z');
console.log(LocalDateTime.now(Clock.systemDefaultZone()), LocalDateTime.ofInstant(time, ZoneId.UTC));

console.log(DecideDate.isTomorrow(time))
