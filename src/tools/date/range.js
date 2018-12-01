const Format = require('./format')

function strToDate (date) {
  if (typeof date === 'string') {
    let arr = date.split(/[- : \/]/),
      _date = new Date(arr[0], arr[1] - 1, arr[2], arr[3] || 0, arr[4] || 0, arr[5] || 0)
    return _date
  } else if (date instanceof Date) {
    return new Date()
  } else if (typeof +date === 'number' && !isNaN(+date)) {
    return new Date(+date)
  } else {
    return date
  }
}

module.exports = function (start, end, format = 'YYYY-MM-DD') {
  let rs = []
  let startTime = strToDate(start).getTime()
  let endTime = strToDate(end).getTime()

  while (startTime <= endTime) {
    rs.push(Format(startTime, format))
    startTime += 24 * 60 * 60 * 1000
  }
  return rs
}
