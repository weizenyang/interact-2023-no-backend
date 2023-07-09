import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url';

const dirname = fileURLToPath(import.meta.url)

const dirPath = path.join(dirname, "../data/timetable_data")
const dirPathContent = path.join(dirname, "../data/timetable_data")
var _subfolder;
var _fileNames = {};
var subfolderName = ""
var dataList = "";

function getSubFolder() {
    console.log(dirname)
    //Get subfolder from /data folder
    fs.readdir(dirPath, (err, subfolder) => {
        if (err) {
            return console.log("Failed to list contents of directory: " + err)
        }
        // console.log(subfolder)

        _subfolder = subfolder;
        getFileNames()

    })
}

function getFileNames(){
            var dirPathS =  _subfolder
            console.log(dirPathS)
            dirPathS.forEach((e) => {
              fs.readFile(`${path.join(dirPathContent, e)}`, "utf8", (err, content) => {
                if(err) {
                    return console.log(err)
                }
                    const data = JSON.parse(content)
                    const itemData = data.data
                    itemData.map((i) => {
                      // console.log(i.item)
                      i.item.map((f) => {
                        if(f.hasInfo){
                          if(f.info){
                            console.log("Info found")
                          } else {
                          f.info = []
                          console.log("Added Property")
                        }
                      }
                      })
                    })
                    // if(data.showcase == undefined){
                    //   data.showcase = []
                    // } else {
                    //   console.log("Timetable data found")
                    // }
                    
                    
                    const jsonStr = JSON.stringify(data, null, 2)
                    // console.log(data)
                    fs.writeFile(`${path.join(dirPathContent, e)}`, jsonStr, (err) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("JSON data is saved.");
                      }
                    });
                    
            })
            })
}

getSubFolder()
