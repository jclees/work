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


// 这里是新加的

function isPlainObject(obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}

//【判断传入的对象是否是函数】
function isFunction(obj) {
  return typeof obj === 'function';
}

//【去除字符串两头空格】
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
/*
 * 【将 Date 转化为指定格式的String】    
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符      
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)      
 * eg:
 * formatDate(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423    
 * formatDate(new Date(),"yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * formatDate(new Date(),"yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * formatDate(new Date(),"yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04     
 * formatDate(new Date(),"yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */
function formatDate(dateObj, fmt) {
  var o = {
    "M+": dateObj.getMonth() + 1, //月份       
    "d+": dateObj.getDate(), //日       
    "h+": dateObj.getHours() % 12 == 0 ? 12 : dateObj.getHours() % 12, //小时       
    "H+": dateObj.getHours(), //小时       
    "m+": dateObj.getMinutes(), //分       
    "s+": dateObj.getSeconds(), //秒       
    "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度       
    "S": dateObj.getMilliseconds() //毫秒       
  };
  var week = {
    "0": "\u65E5",
    "1": "\u4E00",
    "2": "\u4E8C",
    "3": "\u4E09",
    "4": "\u56DB",
    "5": "\u4E94",
    "6": "\u516D"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "\u661F\u671F" : "\u5468" : "") + week[dateObj.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
};
/*
【计算2个日期之间的天数】
* 传入格式：yyyy-mm-dd(2015-01-31)
*/
function dayMinus(startDate, endDate) {
  if (startDate instanceof Date && endDate instanceof Date) {
    var days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days;
  } else {
    return "Param error,date type!";
  }
}

//【判断是否是中文】
function isChina(str) {
  var reg = /^([u4E00-u9FA5]|[uFE30-uFFA0])*$/;
  if (reg.test(str)) {
    return false;
  }
  return true;
}

//【输出任意值到任意值的随机整数 】
function fRandomBy(under, over) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * under + 1);
    case 2:
      return parseInt(Math.random() * (over - under + 1) + under);
    default:
      return 0;
  }
}

/*【生成随机RGB颜色】示例：
getColor(1, 0, 0,0.8)  颜色为红色类别的随机颜色，不透明度0.8 。
getColor(1, 0, 1,1)  颜色为紫色类别的随机颜色，不透明度1 。
getColor(1, 1, 1,0.5)  颜色为全部类别的随机颜色（全彩），不透明度0.5 。
getColor(0, 0, 0,1)  颜色为黑白颜色类别的随机颜色（黑白灰），不透明度1 。
*/

function getColor(r, g, b, a) {
  //输出rgba颜色格式  
  var rgb = 155;
  var c = Math.floor(Math.random() * (255 - rgb) + rgb);
  if (r * g * b == 1) {
    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);
  } else if (r + g + b == 0) {
    var t = Math.floor(Math.random() * 255);
    r = t;
    g = t;
    b = t;
  } else {
    r = r == 1 ? Math.floor(Math.random() * (255 - rgb) + rgb) : Math.floor(Math.random() * (c / 2));
    g = g == 1 ? Math.floor(Math.random() * (255 - rgb) + rgb) : Math.floor(Math.random() * (c / 2));
    b = b == 1 ? Math.floor(Math.random() * (255 - rgb) + rgb) : Math.floor(Math.random() * (c / 2));
  }
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

//html富文本转微信格式
function convertHtmlToText(inputText) {
  var returnText = "" + inputText;
  returnText = returnText.replace(/<\/div>/ig, '\r\n');
  returnText = returnText.replace(/<\/li>/ig, '\r\n');
  returnText = returnText.replace(/<li>/ig, ' * ');
  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
  //-- remove BR tags and replace them with line break
  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

  //-- remove P and A tags but preserve what's inside of them
  returnText = returnText.replace(/<p.*?>/gi, "\r\n");
  returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- remove all inside SCRIPT and STYLE tags
  returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

  //-- get rid of more than 2 multiple line breaks:
  returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

  //-- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g, '');

  //-- get rid of html-encoded characters:
  returnText = returnText.replace(/ /gi, " ");
  returnText = returnText.replace(/&/gi, "&");
  returnText = returnText.replace(/"/gi, '"');
  returnText = returnText.replace(/</gi, '<');
  returnText = returnText.replace(/>/gi, '>');

  return returnText;
}

function test_callback(e) {
  getApp().countUserShareApp(); //父类回调app.js
  console.log(getCurrentPages());
  console.log(getApp().getAppCurrentPage());

  //回调当前页面js方法
  getApp().getAppCurrentPage().test();
}



module.exports = {
  formatTime: formatTime,
  //这里是新加模块的输出
  isPlainObject: isPlainObject,
  test_callback: test_callback,
  convertHtmlToText: convertHtmlToText,
  isFunction: isFunction, //判断传入的对象是否是函数
  trim: trim, //去除字符串两头空格
  formatDate: formatDate, //将 Date 转化为指定格式的String
  dayMinus: dayMinus, //计算2个日期之间的天数
  isChina: isChina, //判断是否是中文
  fRandomBy: fRandomBy, //输出任意值到任意值的随机整数 
  getColor: getColor //生成随机RGB颜色
}
