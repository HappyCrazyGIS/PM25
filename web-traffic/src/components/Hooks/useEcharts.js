import { ref } from "vue"
let service = {
  name: "guanggu",
  layerId: 2,
}
var dataOptions = {
  title: {
    text: "事件类型统计图",
    left: "center",
  },
  // 提示框
  tooltip: {
    trigger: "item", //触发类型,默认数据触发,item,axis
    formatter: "{a} </br>{b}:{c} ({d}%)",
  },
  // 图例
  legend: {
    left: "center",
    bottom: "10",
    data: null,
  },
  series: [
    {
      name: "EVENT TYPE",
      type: "pie",
      roseType: "radius", //扇区圆心角展现数据的百分比，半径展现数据的大小
      radius: [15, 100],
      center: ["50%", "50%"],
      data: null,
      animationEasing: "cubicInOut",
      animationDuration: 2700,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
}
var dataOptionsLine = {
  xAxis: {
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    boundaryGap: false, //坐标轴两边留白
    axisTick: {
      //坐标轴小标记
      show: false,
    },
  },
  grid: {
    left: 10,
    right: 15,
    bottom: 10,
    top: 40,
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      //坐标轴指示器
      type: "cross",
    },
    padding: [5, 10],
  },
  yAxis: {
    axisTick: {
      show: false,
    },
    splitLine: {
      // 分隔线
      show: true, // 默认显示，属性show控制显示与否
      lineStyle: {
        // 属性lineStyle（详见lineStyle）控制线条样式
        color: ["#ccc"],
        width: 1,
        type: "solid",
      },
    },
  },
  legend: {
    data: ["每月事故数目(AN)"],
  },
  series: [
    {
      name: "每月事故数目(AN)",
      smooth: true,
      type: "line",
      // itemStyle: {

      // },
      lineStyle: {
        color: "#FF005A",
        width: 2,
      },
      areaStyle: {
        color: "rgba(246, 67, 130,0.3)",
      },
      data: null,
      animationDuration: 2700,
      animationEasing: "quadraticOut",
    },
  ],
}
export const queryAll = () => {
  // 请求Echarts需要的数据
  let typeArray = []
  let dataArray = []
  let typeObj = {}
  let numForMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  Query.queryLineByRectangle({
    service,
    callback: (res) => {
      // console.log(res)
      res.SFEleArray.forEach((item) => {
        // 月份统计
        var month = Number(item.AttValue[3].split(".")[1])
        numForMonth[month - 1]++
        // 类型统计
        typeArray.push(item.AttValue[1])
        if (typeObj[item.AttValue[1]] == undefined) {
          typeObj[item.AttValue[1]] = 1
        } else {
          typeObj[item.AttValue[1]]++
        }
      })
      typeArray = [...new Set(typeArray)]
      for (let i in typeObj) {
        dataArray.push({ value: typeObj[i], name: i })
      }
      // console.log(typeArray)
      // console.log(dataArray)
      dataOptions.legend.data = typeArray
      dataOptions.series[0].data = dataArray
      dataOptionsLine.series[0].data = numForMonth
      console.log(22)
    },
  })
}
export const useEcharts = () => {
  const dataPie = ref(null)
  const dataLine = ref(null)
  dataLine.value = dataOptionsLine
  dataPie.value = dataOptions
  console.log(11)
  return { dataPie, dataLine }
}
