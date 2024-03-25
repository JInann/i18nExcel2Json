const XLSX = require('xlsx');

// 读取Excel文件
const workbook = XLSX.readFile('./in.xlsx');

// 获取工作表的名字
const sheetNames = workbook.SheetNames;

// 获取第一个工作表
const sheet = workbook.Sheets[sheetNames[0]];

// 将工作表转换为JSON
let data = XLSX.utils.sheet_to_json(sheet);
const getLangStr = (str = '') => /[a-z]+/.exec(str)[0];
data = data.map((v) => {
  let temp = {};
  Object.keys(v).forEach((k) => {
    temp[getLangStr(k)] = (v[k] + '').replace(/(\r)|(\n)/g, '');
  });
  if (temp.code == undefined) {
    temp.code = temp.zh;
  }
  return temp;
});

const fs = require('fs');
let temp = {};
let lang = Object.keys(data[0]).filter((v) => v != 'code');
lang.forEach((k) => (temp[k] = {}));
data.forEach((item) => {
  lang.forEach((l) => {
    temp[l][item.code] = item[l];
  });
});
fs.writeFileSync('out.json', JSON.stringify(temp, null, 2));
