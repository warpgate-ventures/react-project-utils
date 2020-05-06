import moment from 'moment'

const FORMAT = 'MMM D, YYYY hh:mm A'

const offset = moment().utcOffset()

function DateTimeFormat({ format = FORMAT, date }) {
  if (!date) return null

  const d = moment(date)
    .add('minutes', offset)

  if (format === 'fromNow') {
    return d.fromNow()
  }

  if (format === 'calendar') {
    return d.calendar()
  }

  return d.format(format)
}

export default DateTimeFormat

