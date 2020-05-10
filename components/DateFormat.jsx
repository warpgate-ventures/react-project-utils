import moment from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'

function DateFormat({ date, format = 'MMM D, YYYY' }) {
  return moment(date, [DATE_FORMAT]).format(format)
}

export default DateFormat

