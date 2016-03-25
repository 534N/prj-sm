// import moment from 'moment';

VDDate =  class VDDate {
  constructor(date) {
    this.date = typeof date === 'string' ? new Date(date) : date;
    this.dateObj = new Date(date);
  }

  beginningOfDay(offset) {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const day = this.date.getDate();

    const dateObj = new Date(year, month, day);

    return offset ? new Date(dateObj.getTime() - offset) : dateObj;
  }

  endOfDay(offset) {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const day = this.date.getDate();

    const dateObj = new Date(year, month, day);

    if (offset) {
      return new Date(new Date(moment(dateObj).add(1, 'Day').format()).getTime() + offset);
    } else {
      const nextDay = new Date(moment(dateObj).add(1, 'Day').format());
      return new Date(nextDay.getTime() - 1);
    }
  }

  currentHour() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const day = this.date.getDate();
    const hour = this.date.getHours();

    return new Date(year, month, day, hour, 0, 0);
  }

  tomorrow() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const day = this.date.getDate();

    const dateObj = new Date(year, month, day);
    return new Date(moment(dateObj).add(1, 'Day').format());
  }

  yesterday() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const day = this.date.getDate();

    const dateObj = new Date(year, month, day);
    return new Date(moment(dateObj).subtract(1, 'Day').format());
  }

  getTime() {
    return this.dateObj.getTime();
  }

  getTimeZoneOffsetInMilliseconds() {
    return moment(this.date).utcOffset(this.date)._tzm*60*1000;
  }

  offsetBackward(offset) {
    return new Date(this.dateObj.getTime() - offset);
  }

  offsetForward(offset) {
    return new Date(this.dateObj.getTime() + offset);
  }
};
