import Mock from 'mockjs'
//延时200-600毫秒请求到数据
Mock.setup({
    timeout: '200-600'
})

const Random = Mock.Random;
// 用户总览
function countUserNum() {
    const a = Mock.mock({
        success: true,
        data: {
            offlineNum:'@integer(1, 100)',
            lockNum: '@integer(1, 10)',
            totalNum:218
        }
    })
    a.data.onlineNum=a.data.totalNum-a.data.offlineNum-a.data.lockNum
    return a
}

// 接口，第一个参数url，第二个参数请求类型，第三个参数响应回调
Mock.mock(new RegExp('countUserNum'), 'get', countUserNum)

// /设备总览 

function countDeviceNum() {
    const a = Mock.mock({
        success: true,
        data: {
            alarmNum: '@integer(100, 1000)',
            offlineNum: '@integer(0, 50)',
            totalNum:698
        }
    })
    a.data.onlineNum=a.data.totalNum-a.data.offlineNum


    return a
}

Mock.mock(new RegExp('countDeviceNum'), 'get', countDeviceNum)

// /设备总览 

function sbtx() {
    const a = Mock.mock({
        success: true,
        data: {
            "list|20": [
                {
                    provinceName: "@province()",
                    cityName: '@city()',
                    countyName: "@county()",
                    createTime: "@datetime('yyyy-MM-dd HH:mm:ss')",
                    deviceId: "6c512d754bbcd6d7cd86abce0e0cac58",
                    "gatewayno|+1": 10000,
                    "onlineState|1": [0, 1],

                }
            ]
        }
    })
    return a
}

Mock.mock(new RegExp('sbtx'), 'get', sbtx)



//中间地图

function centermap(options) {
    let params = parameteUrl(options.url)
    if (params.regionCode && params.regionCode != 'china') {
        const a = Mock.mock({
            success: true,
            data: {
                "dataList|30": [
                    {
                        name: "@city()",
                        value: '@integer(1, 1000)'
                    }
                ],
                regionCode: params.regionCode,//-代表中国
            }
        })
        return a
    } else {
        const a = Mock.mock({
            success: true,
            data: {
                "dataList|8": [
                    {
                        name: "@province()",
                        value: '@integer(1, 1000)'
                    }
                ],
                regionCode: 'china',
            }
        })
        return a
    }

}

Mock.mock(new RegExp('centermap'), 'get', centermap)

// 报警次数

function alarmNum() {
    const a = Mock.mock({
        success: true,
        data: {
            dateList:['2021-11', '2021-12', '2022-01', '2022-02', '2022-03',"2022-04"],
            "numList|6":[
                '@integer(0, 1000)'
            ],
            "numList2|6":[
                '@integer(0, 1000)'
            ]
        }
    })
    return a
}
Mock.mock(new RegExp('alarmNum'), 'get', alarmNum)

// 实时预警

function ssyj() {
    const a = Mock.mock({
        success: true,
        data: {
            "list|40":[{
                alertdetail: "@csentence(5,10)",
                "alertname|1": ["水浸告警","各种报警"],
                alertvalue: "@float(60, 200)",
                createtime: "2022-04-19 08:38:33",
                deviceid: null,
                "gatewayno|+1": 10000,
                phase: "A1",
                sbInfo: "@csentence(10,18)",
                "terminalno|+1": 100,
                provinceName: "@province()",
                cityName: '@city()',
                countyName: "@county()",
            }],
            
        }
    })
    return a
}
Mock.mock(new RegExp('ssyj'), 'get', ssyj)
//安装计划 
function installationPlan() {
    let num=  RandomNumBoth(26,32);
    const a = Mock.mock({
        ["category|"+num]:["@city()"],
        ["barData|"+num]:["@integer(10, 100)"],
    })
    let lineData=[],rateData=[];
    for (let index = 0; index < num; index++) {
        let lineNum = Mock.mock('@integer(0, 100)')+a.barData[index]
        lineData.push(lineNum)
        let rate = a.barData[index] / lineNum;
        rateData.push((rate*100).toFixed(0))
    }
    a.lineData=lineData
    a.rateData=rateData
    return {
        success: true,
        data:a
    }
}
Mock.mock(new RegExp('installationPlan'), 'get', installationPlan)




//报警排名 
function ranking() {
   //多生成几个避免重复 重复会报错
  let num =Mock.mock({"list|48":[{ value:"@integer(50,1000)",name:"@city()"}]}).list
//   console.log(num);
  let newNum =[],numObj={}
  num.map(item=>{
    if(!numObj[item.name] && newNum.length<8){
        numObj[item.name] =true
        newNum.push(item)
    }
  })
  let arr = newNum.sort((a,b)=>{
    return b.value-a.value
  })
  let a ={
      success:true,
      data:arr
  }
  return a
}
Mock.mock(new RegExp('ranking'), 'get', ranking)
/**
 * @description: min ≤ r ≤ max  随机数
 * @param {*} Min
 * @param {*} Max
 * @return {*}
 */
function RandomNumBoth(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}
/**
 * @description: 获取路径参数
 * @param {*} url
 * @return {*}
 */
function parameteUrl(url) {
    var json = {}
    if (/\?/.test(url)) {
        var urlString = url.substring(url.indexOf("?") + 1);
        var urlArray = urlString.split("&");
        for (var i = 0; i < urlArray.length; i++) {
            var urlItem = urlArray[i];
            var item = urlItem.split("=");
            console.log(item);
            json[item[0]] = item[1];
        }
        return json;
    }
    return {};
}

// 重保事件
function rebangEventList() {
    const mockData = Mock.mock({
        'eventList|8': [
            {
                'name': '@ctitle(6, 12) 重保活动',
                'unitCount|5-30': 1,
                'startTime': '@date("yyyy-MM-dd")',
                'endTime': function() {
                    const start = new Date(this.startTime);
                    const end = new Date(start);
                    end.setDate(start.getDate() + Mock.Random.integer(7, 30));
                    return end.toISOString().split('T')[0];
                }
            }
        ]
    });

    return {
        success: true,
        data: mockData.eventList
    };
}

Mock.mock(new RegExp('rebang/eventList'), 'get', rebangEventList)

// 信息安全季报统计（新增接口）
function quarterlySecurityReport(options) {
  // 获取请求中的年份参数（如?year=2025）
  const params = parameteUrl(options.url);
  const targetYear = parseInt(params.year) || 2025; // 默认返回2025年数据

  // 根据年份确定数据范围
  const checkMin = targetYear === 2023 ? 10 : (targetYear === 2024 ? 15 : 18);
  const checkMax = targetYear === 2023 ? 20 : (targetYear === 2024 ? 25 : 30);
  const trainMin = targetYear === 2023 ? 8 : (targetYear === 2024 ? 10 : 12);
  const trainMax = targetYear === 2023 ? 15 : (targetYear === 2024 ? 18 : 22);
  const buildMin = targetYear === 2023 ? 5 : (targetYear === 2024 ? 7 : 9);
  const buildMax = targetYear === 2023 ? 10 : (targetYear === 2024 ? 12 : 15);

  // 直接生成数组数据，不使用Mock.js模板语法
  const reportData = {
    success: true,
    data: {
      季度: ['Q1', 'Q2', 'Q3', 'Q4'],
      信息安全检查数量: [
        Mock.Random.integer(checkMin, checkMax),
        Mock.Random.integer(checkMin, checkMax),
        Mock.Random.integer(checkMin, checkMax),
        Mock.Random.integer(checkMin, checkMax)
      ],
      信息安全培训数量: [
        Mock.Random.integer(trainMin, trainMax),
        Mock.Random.integer(trainMin, trainMax),
        Mock.Random.integer(trainMin, trainMax),
        Mock.Random.integer(trainMin, trainMax)
      ],
      信息系统建设整改: [
        Mock.Random.integer(buildMin, buildMax),
        Mock.Random.integer(buildMin, buildMax),
        Mock.Random.integer(buildMin, buildMax),
        Mock.Random.integer(buildMin, buildMax)
      ]
    }
  };

  return reportData;
}

// 匹配“quarterlySecurityReport”相关的GET请求
Mock.mock(new RegExp('/quarterlySecurityReport'), 'get', quarterlySecurityReport);

// 当月网络攻击类型分布
function monthlyAttackStats() {
  const attackTypes = [
    'SQL注入', 
    'XSS攻击', 
    'DDoS攻击', 
    '暴力破解', 
    '恶意代码'
  ];
  
  // 生成随机攻击数量
  const counts = attackTypes.map(() => Mock.Random.integer(50, 500));
  
  return {
    success: true,
    data: {
      types: attackTypes,
      counts: counts
    }
  };
}

Mock.mock(new RegExp('/api/attack/monthly'), 'get', monthlyAttackStats);

// 当年网络攻击趋势
function yearlyAttackStats() {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const counts = months.map(() => Mock.Random.integer(300, 2000));
  
  return {
    success: true,
    data: {
      months: months,
      counts: counts
    }
  };
}

Mock.mock(new RegExp('/api/attack/yearly'), 'get', yearlyAttackStats);
