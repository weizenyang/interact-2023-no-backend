import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url';

const dirname = fileURLToPath(import.meta.url)

const dirPath = path.join(dirname, "../data/rawData.json")
const dirPathContent = path.join(dirname, "../data/timetable_data")
var _subfolder;
var _fileNames = {};
var subfolderName = ""
var dataList = "";
var rawData;
var contentData;



saveRawData()

function saveRawData(){
  fs.readFile(dirPath, "utf8", (err, content) => {
    if(err){
      return console.log(err)
    }

    const data = JSON.parse(content)
    rawData = data
    console.log(rawData)
    getSubFolder()
  })
}

function getSubFolder() {
  //Get subfolder from /data folder
  fs.readdir(dirPathContent, (err, subfolder) => {
      if (err) {
          return console.log("Failed to list contents of directory: " + err)
      }
      console.log(subfolder)

      _subfolder = subfolder;
      getFileNames()
  })
  
}

function getFileNames(){
            var dirPathS =  _subfolder
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
                            f.info = []
                            rawData.forEach((rawdata) => {
                             const strToMatch = "Session " + rawdata.session
                             const regEx = new RegExp(`${strToMatch}`, "gi")
                             
                             if(regEx.test(f.text)){
                                console.log("")
                                console.log(strToMatch + " : " + f.text)
                                var dataObj = {
                                  "id": rawdata.id,
                                  "title" : rawdata.title,
                                  "authors" : rawdata.author,
                                  "presenters" : rawdata.presenter,
                                  "contact": [
                                    {
                                      "name" : rawdata.contact,
                                      "email" : rawdata.email
                                    }
                                  ]
                                }
                                console.log(dataObj)
                                console.log(path.join(dirPathContent, e))
                                f.info.push(dataObj)

                                // console.log(data)
                                
                                const jsonStr = JSON.stringify(data, null, 2)
                                console.log(jsonStr)
                                fs.writeFile(`${path.join(dirPathContent, e)}`, jsonStr, (err) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    console.log("JSON data is saved.");
                                  }
                                });
                             }
                             
                            })
                          } else {
                          
                        }
                      }
                      

                      })
                    })
                    
                    
                    
                    
            })
            })
}

