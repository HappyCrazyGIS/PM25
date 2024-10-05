import { format, getISOWeek } from 'date-fns' // 使用 date-fns 进行时间处理

/**
 * 通用的汇总函数，根据传入的字段（年、月、周、日）进行分组汇总
 * @param {Array} records - 扁平化的运动记录
 * @param {String} groupBy - 分组依据（year, month, week, day）
 * @returns {Array} - 统计后的数据
 */
export function calculateSummary(records, groupBy) {
  const summary = {}

  // 遍历每一条记录，按 groupBy 进行汇总
  records.forEach((record) => {
    let groupKey

    // 根据不同的分组依据，提取 key
    switch (groupBy) {
      case 'year':
        groupKey = format(new Date(record.start_time), 'yyyy') // 按年份分组
        break
      case 'month':
        groupKey = format(new Date(record.start_time), 'yyyy-MM') // 按月份分组
        break
      case 'week':
        groupKey = `${format(
          new Date(record.start_time),
          'yyyy'
        )}-W${getISOWeek(new Date(record.start_time))}` // 按周分组
        break
      case 'day':
        groupKey = format(new Date(record.start_time), 'yyyy-MM-dd') // 按日期分组
        break
      default:
        throw new Error(`Unsupported groupBy value: ${groupBy}`)
    }

    // 如果该分组不存在，初始化统计数据
    if (!summary[groupKey]) {
      summary[groupKey] = {
        date: groupKey,
        distance: 0,
        duringTime: 0,
        times: 0,
        exposureDose: 0,
        records: []
      }
    }

    // 统计数据
    summary[groupKey].distance += record.distance
    summary[groupKey].duringTime += record.duringTime
    summary[groupKey].times += 1
    summary[groupKey].exposureDose += record.exposure_dose

    // 记录每条运动记录
    summary[groupKey].records.push({
      id: record.id,
      activity_type: record.activity_type,
      distance: record.distance.toFixed(2),
      duringTime: record.duringTime.toFixed(2),
      start_time: record.start_time,
      speed: record.speed.toFixed(2),
      exposure_dose: record.exposure_dose.toFixed(2)
    })
  })

  // 将结果转换为数组返回，并确保所有小数保留两位
  return Object.values(summary).map((item) => ({
    ...item,
    distance: item.distance.toFixed(2),
    duringTime: item.duringTime.toFixed(2),
    exposureDose: item.exposureDose.toFixed(2)
  }))
}

/**
 * 将记录按照指定的字段分组 (按年, 月, 周, 日)
 * @param {Array} records - 运动记录数据
 * @param {String} groupBy - 分组依据（year, month, week, day）
 * @returns {Object} - 分组后的记录
 */
export const groupRecordsBy = (records, groupBy) => {
  switch (groupBy) {
    case 'year':
      return groupByYear(records)
    case 'month':
      return groupByMonth(records)
    case 'week':
      return groupByWeek(records)
    case 'day':
      return groupByDay(records)
    default:
      console.warn(`Unsupported groupBy field: ${groupBy}`)
      return {}
  }
}

// 按年分组
const groupByYear = (records) => {
  return records.reduce((acc, record) => {
    const year = format(new Date(record.start_time), 'yyyy') // 提取年份
    if (!acc[year]) acc[year] = []
    acc[year].push(record)
    return acc
  }, {})
}

// 按月分组
const groupByMonth = (records) => {
  return records.reduce((acc, record) => {
    const yearMonth = format(new Date(record.start_time), 'yyyy-MM') // 提取年月
    if (!acc[yearMonth]) acc[yearMonth] = []
    acc[yearMonth].push(record)
    return acc
  }, {})
}

// 按周分组
const groupByWeek = (records) => {
  return records.reduce((acc, record) => {
    const yearWeek = `${format(
      new Date(record.start_time),
      'yyyy'
    )}-W${getISOWeek(new Date(record.start_time))}` // 提取年和周
    if (!acc[yearWeek]) acc[yearWeek] = []
    acc[yearWeek].push(record)
    return acc
  }, {})
}

// 按日分组
const groupByDay = (records) => {
  return records.reduce((acc, record) => {
    const date = format(new Date(record.start_time), 'yyyy-MM-dd') // 提取年月日
    if (!acc[date]) acc[date] = []
    acc[date].push(record)
    return acc
  }, {})
}
