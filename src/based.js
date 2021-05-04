const fs = require('fs')
const moment = require('moment')
const convert = require('xml-js')

function getSchedules(){
    return "Hello";
}

function fileExist(file) {
    let filename = moment(file, "DDMMYYYY").format("DD-MM-YYYY") + ".xml"
    return fs.existsSync(`${process.env.BASE_PATH}/${filename}`)
}

function checkFormat(date){
    if(date.length == 8){
        return true
    }
    return false
}

module.exports = { getSchedules, checkFormat, fileExist }