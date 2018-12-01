const Reg = {
  isPath,
  isPhone,
  isDate,
  isDateTime,
  isPwd,
  pathReg: /^\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/,
  PhoneReg: /^1[3|4|5|7|8]\d{9}$/,
  dateReg: /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/,
  highPwd: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/, //强：字母+数字+特殊字符
  inPwd: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/, //中：字母+数字，字母+特殊字符，数字+特殊字符
  lowPwd: /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/, //弱：纯数字，纯字母，纯特殊字符
  IsIDcard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,//验证身份证
}
module.exports = Reg

function isPath (text) {
  return Reg.pathReg.test(text)
}

function isPhone (text) {
  return text.length === 11 && Reg.PhoneReg.test(text)
}

function isDate (str) {
  return typeof str === 'string' && Reg.dateReg.test(str)
}

function isDateTime (str) {
  if (typeof str === 'string') {
    str = str.split(' ')[0]
  }
  return isDate(str)
}

function isPwd (str) {
  try {
    if (str.length === 0) {
      return false
    }
    if (Reg.highPwd.test(str)) {
      return 3
    } else if (Reg.inPwd.test(str)) {
      return 2
    } else if (Reg.lowPwd.test(str)) {
      return 1
    } else {
      return 0
    }
  } catch (e) {
    return 0
  }
}
module.exports = Reg
