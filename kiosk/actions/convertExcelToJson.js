const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('../Hospitals.xls');
const sheetName = workbook.SheetNames[0]; // usually first sheet
const sheet = workbook.Sheets[sheetName];

const jsonData = xlsx.utils.sheet_to_json(sheet);
fs.writeFileSync('hospitals.json', JSON.stringify(jsonData, null, 2));

console.log('Excel converted to JSON successfully!');
