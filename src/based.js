const fs = require('fs')
const moment = require('moment')
const convert = require('xml-js')

function getSchedules(file){
    let filename = moment(file, "DDMMYYYY").format("DD-MM-YYYY") + ".xml"
    let schedulesXML = fs.readFileSync(`${process.env.BASE_PATH}/${filename}`)
    let schedules = JSON.parse(convert.xml2json(schedulesXML, {compact: true, spaces: 4}))
    let listLpdre = []
    let positionXML = fs.readFileSync(`${process.env.BASE_PATH}/lclEclr.xml`)
    let positions = JSON.parse(convert.xml2json(positionXML, {compact: true}))
    schedules.Document.Arrdt.forEach(arrdt => {
        if(fs.existsSync(`${process.env.BASE_PATH}/arrdt${arrdt._attributes.Id}.xml`)){
            let arrdtxml = fs.readFileSync((`${process.env.BASE_PATH}/arrdt${arrdt._attributes.Id}.xml`), 'utf-8')
            let arrdtjson = JSON.parse(convert.xml2json(arrdtxml, {compact: true, spaces: 4}))
            if(arrdtjson.Document.Lpdre.length !== undefined){
                arrdtjson.Document.Lpdre.forEach(lpdre => {
                    let positionArrt = positions.Document.Ctry.Rg.Dpt.Arrdt.find(arr => arr._attributes.Code == arrdt._attributes.Id)
                    let positionLpdre = positionArrt.Lpdre.find(ld => ld.Id._text == lpdre._attributes.Id)

                    let newLpdre = {}
                    newLpdre.lat = positionLpdre.Ltd._text
                    newLpdre.long = positionLpdre.Lgtd._text
                    newLpdre.start = arrdt.Plge.find(plg => plg._attributes.Db)._attributes.Db
                    newLpdre.end = arrdt.Plge.find(plg => plg._attributes.Fn)._attributes.Fn
                    listLpdre.push(newLpdre)
                })
            } else {
                let positionArrt = positions.Document.Ctry.Rg.Dpt.Arrdt.find(arr => arr._attributes.Code == arrdt._attributes.Id)
                let positionLpdre = positionArrt.Lpdre

                let newLpdre = {}
                newLpdre.lat = positionLpdre.Ltd._text
                newLpdre.long = positionLpdre.Lgtd._text
                newLpdre.start = arrdt.Plge.find(plg => plg._attributes.Db)._attributes.Db
                newLpdre.end = arrdt.Plge.find(plg => plg._attributes.Fn)._attributes.Fn
                listLpdre.push(newLpdre)
            }
        }
    })
    console.log(listLpdre)
    return (['Lattitude;Longitude;Allumage;Extinction',...listLpdre.map(e=>`${e.lat};${e.long};${e.start};${e.end}`)].join`\n`)
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