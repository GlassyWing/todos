import {Clock, Instant, LocalDate, LocalDateTime, ZoneId} from 'js-joda';
export class DecideDate {

  /**
   * 判断指定的日期是否为今天
   * @param date
   * @returns {boolean}
   */
  static isToday(date: string | Instant): boolean {
    let startTime = DecideDate.convertToLocalDate(date);

    let today = LocalDate.now(Clock.systemDefaultZone());
    return startTime.equals(today);
  }

  static isYesterday(date: string | Instant): boolean {
    let startTime = DecideDate.convertToLocalDate(date);

    let yesterday = LocalDateTime.now(Clock.systemUTC()).minusDays(1);
    return startTime.equals(yesterday);
  }

  /**
   * 判断指定的日期是否为明天
   * @param date
   * @returns {boolean}
   */
  static isTomorrow(date: string | Instant): boolean {
    return DecideDate.isTheDayAfterAnyDays(date, 1);
  }

  /**
   * 判断指定的日期是否为第几天后
   * @param date
   * @param days
   * @returns {boolean}
   */
  static isTheDayAfterAnyDays(date: string | Instant, days: number): boolean {
    let startTime = DecideDate.convertToLocalDate(date);

    let someDay = LocalDate.now(Clock.systemDefaultZone()).plusDays(days);
    return someDay.equals(startTime);
  }

  static isTheDayBeforeAnyDays(date: string | Instant, days: number): boolean {
    let startTime = DecideDate.convertToLocalDate(date);
    let someDay = LocalDate.now(Clock.systemDefaultZone()).minusDays(days);
    return someDay.equals(startTime);
  }

  /**
   * 判断是否已经过期
   * @param date
   * @returns {boolean}
   */
  static isOutOfDate(date: string | Instant): boolean {
    let startTime = DecideDate.convertToLocalDate(date);
    let today = LocalDate.now(Clock.systemDefaultZone());
    return startTime.isBefore(today);
  }

  private static convertToLocalDate(date: string | Instant): LocalDate {
    let startTime;
    if (typeof date === 'string') {
      startTime = LocalDateTime.ofInstant(Instant.parse(date), ZoneId.systemDefault())
        .toLocalDate();
    } else {
      startTime = LocalDateTime.ofInstant(date).toLocalDate();
    }
    return startTime;
  }
}
