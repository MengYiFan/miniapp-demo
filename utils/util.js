const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 解析 Unix时间戳
const parseUnixTimestamp = (timestamp, type = '/') => {
  let date = new Date(timestamp * 1000),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      time = `${year}${type}${month}${type}${day}`
  
  return {
    year, month, day, time
  }
}

// 解析获得跑步数据
const parseRunData = (data) => {
  return data.map((item, idx) => {
    let date = parseUnixTimestamp(item.timestamp)
    return Object.assign(item, date)
  })
}

// 解析获得今天的跑步数据
const parseLastRunData = (data) => {
  let lastIndex = data.length - 1,
      lastData = data[lastIndex],
      lastDate = parseUnixTimestamp(lastData.timestamp)
  return Object.assign(lastData, lastDate)
}


module.exports = {
  formatTime: formatTime,
  parseRunData, parseLastRunData
}
