import moment from 'moment'

export const TIME_FORMAT = 'HH:mm:ss'

function TimeFormat({ time, format = 'h:mm A' }) {
  return moment(time, [TIME_FORMAT]).format(format)
}

export default TimeFormat

