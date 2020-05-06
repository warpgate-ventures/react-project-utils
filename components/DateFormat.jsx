import moment from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'

function DateFormat({ date, format = 'h:mm A' }) {
  return moment(date, [DATE_FORMAT]).format(format)
}

export default DateFormat

