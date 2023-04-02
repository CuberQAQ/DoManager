import jsonfile from "jsonfile"
import fs from "fs-extra"
var processHour = 22
var toBlog = false
export function startDailyPesProcess(blog) {
  if(blog) toBlog = blog
  register()
}
function register() {
  let now_date = new Date()
  let target_date = new Date()
  if(now_date.getUTCHours() >= processHour) {
    target_date.setTime(now_date.getTime() + 86400000)
    target_date.setHours(processHour, 0, 0, 0)
    setTimeout(() => {
      processFunc()
      register()
    }, target_date.getTime() - now_date.getTime())
  }
}

function processFunc() {
  let jsonObj = jsonfile.readFileSync("./data/member.json", {
    "encoding": "utf8",
  })
  let lastDayDate = new Date()
  lastDayDate.setTime(lastDayDate.getTime() - 86400000)
  if(fs.existsSync("./date/backup/" + getDateIndex() + ".json")) {
    let lastDayObj = jsonfile.readFileSync("./date/backup/" + getDateIndex() + ".json", {
      "encoding": "utf8"
    })
    let memberCount = lastDayObj.members.length
    for(let i = 0; i < memberCount; ++i) {
      const yesterdayMember = lastDayObj.members[i]
      const todayMember = jsonObj.members[i]
      todayMember.fcs = (todayMember.todayPes + yesterdayMember.fcs) / 2
    }
    jsonfile.writeFileSync("./date/backup/" + getDateIndex() + ".json", jsonObj, {
      "encoding": "utf8",
      "flag": "w+"
    })
    jsonObj.log = []
    for(let i = 0; i < memberCount; ++i) {
      jsonObj.members[i].todayPes = 10
    }
    jsonfile.writeFileSync("./data/member.json", jsonObj, {
      "encoding": "utf8"
    })
  }
  if(toBlog) makeMarkDown()
}

function makeMarkDown() {

}

function getDateIndex(dateInstance) {
  let date = dateInstance ?? new Date()
  return "" + (date.getFullYear() * 10000  + date.getMonth() * 100 + date.getDate())
}