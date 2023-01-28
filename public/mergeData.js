import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url';

const dirname = fileURLToPath(import.meta.url)

const dirPath = path.join(dirname, "../data")
const dirPathContent = path.join(dirname, "../")
// const dirPathS = path.join(dirname, "../data")
// const dirPathSF = path.join(dirname, "../data")
var _subfolder;
var _fileNames = {};
var subfolderName = ""
var dataList = "";
// var jsonSnippet;
// var subfolder;

function getSubFolder() {
    console.log(dirname)
    //Get subfolder from /data folder
    fs.readdir(dirPath, (err, subfolder) => {
        if (err) {
            return console.log("Failed to list contents of directory: " + err)
        }
        console.log(subfolder)

        _subfolder = subfolder;
        getFileNames()

    })

    
    
}

function getFileNames(){
    _subfolder.forEach((sfolder) => {
            var dirPathS = path.join(dirPath, sfolder)
            fs.readdir(dirPathS, (err, files) => {
                 
                if (err) {
                    return console.log("Failed to list contents of directory: " + err)
                }

                //Get data from files
                files.forEach(file =>{
                    var dirPathSF = path.join(dirPathS, file)
                    console.log("filepath: "+ dirPathSF)
                    fs.readFile(`${dirPathSF}`, "utf8", (err, content) => {
                        if(err) {
                            return console.log(err)
                        }
                            //Merge JSON data
                            // mergeData(content)
                            if(sfolder != undefined){
                                console.log(dirPathSF +" "+ sfolder)
                                var key = sfolder
                                if(_fileNames[key] == undefined){
                                    _fileNames[key] = ""
                                    _fileNames[key] += content;
                                } else {
                                    _fileNames[key] += "," + content;
                                }

                                console.log(Object.keys(_fileNames))
                            }
                            appendJsonList();
                    })
                }

                )
                       
            })
        })
}

// function getFileData(){
//                     //Get data from files
//                     files.forEach(file =>{
//                         var dirPathSF = path.join(dirPathS, file)
//                         console.log("filepath: "+ dirPathSF)
//                         fs.readFile(`${dirPathSF}`, "utf8", (err, content) => {
//                             if(err) {
//                                 return console.log(err)
//                             }
//                                 //Merge JSON data
//                                 mergeData(content)
//                                 if(dataList != ""){
//                                     console.log(dirPathSF +" "+ sfolder)
//                                     appendJsonList(dataList, sfolder)
//                                 }
//                         })
//                     }
    
//                     )
// }




// function getPosts() {
//     console.log(dirname)
//     //Get subfolder from /data folder
//     fs.readdir(dirPath, (err, subfolder) => {
//         if (err) {
//             return console.log("Failed to list contents of directory: " + err)
//         }
//         console.log(subfolder)

//         subfolder.forEach((sfolder, i) => {
            

//             //Get file name of files within the folder
//             // var fileData;
//             var dirPathS = path.join(dirPath, sfolder)
//             fs.readdir(dirPathS, (err, files) => {
                 
//                 if (err) {
//                     return console.log("Failed to list contents of directory: " + err)
//                 }

//                 console.log("files: " + files)
//                 console.log("File path: " + dirPath)
                
//                 //Get data from files
//                 files.forEach(file =>{
//                     var dirPathSF = path.join(dirPathS, file)
//                     console.log("filepath: "+ dirPathSF)
//                     fs.readFile(`${dirPathSF}`, "utf8", (err, content) => {
//                         if(err) {
//                             return console.log(err)
//                         }
//                         // console.log("Contents" + content)
//                             //Merge JSON data
//                             mergeData(content)
//                             if(dataList != ""){
//                                 console.log(dirPathSF +" "+ sfolder)
//                                 appendJsonList(dataList, sfolder)
//                             }
                            
                        
//                         // fileData += "," + content
//                         // console.log("dataList")
//                         // console.log(dataList)
//                     })
//                 }

//                 )

                
                
//             })

            
//     })
//     // console.log(dataList)
    
//     // return
// })
    
// }

// function mergeData(data){
//     // dataList.push(data)

//         if(dataList == ""){
//             dataList += data
//         } else {
//             dataList += "," + data
//         }

    
// }

function appendJsonList(){
    fs.writeFileSync(path.join(dirPathContent, "content-copy.json"), "")
    var jsonSnippet = ""
    var dataSnippet = ""

    // Object.keys(_fileNames).forEach(key => {
        let entries = Object.entries(_fileNames)
        entries.map(([key, val] = entry) => {
            if(dataSnippet != ""){
                dataSnippet +=', "' + key + '":[ ' + val + "]"
                
            } else {
                dataSnippet +='"' + key + '":[ ' + val + "]"
            }
            
            
        })
        jsonSnippet = "{" + dataSnippet + "}"
        // jsonSnippet = '{"' + key + '":[ ' + _fileNames[key] + "]}"
        // jsonSnippet = '{"'+ Object.entries(_fileNames)+"}"
        fs.writeFileSync(path.join(dirPathContent, "content-copy.json"), jsonSnippet)

        
        
    // })

    

    

}


// function appendJsonList(data, dataListName){
    

//             var finalData
//             if (subfolderName != dataListName){
//                 subfolderName = dataListName
//                 finalData = dataListName + ":[" + data + "]"
//             } else {
//                 finalData = subfolderName + ":[" + data + "]"
//             }
            
//             fs.writeFileSync(path.join(dirPathContent, "content-copy.json"), finalData)

        
    
// }


// const getPosts = () => {
//     fs.readdir(dirPath, (err, files) => {
//         if (err) {
//             return console.log("Failed to list contents of directory: " + err)
//         }
//         let ilist = []
//         files.forEach((file, i) => {
//             let obj = {}
//             let post
//             fs.readFile(`${dirPath}/${file}`, "utf8", (err, contents) => {
//                 const getMetadataIndices = (acc, elem, i) => {
//                     if (/^---/.test(elem)) {
//                         acc.push(i)
//                     }
//                     return acc
//                 }
//                 const parseMetadata = ({lines, metadataIndices}) => {
//                     if (metadataIndices.length > 0) {
//                         let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
//                         metadata.forEach(line => {
//                             obj[line.split(": ")[0]] = line.split(": ")[1]
//                         })
//                         return obj
//                     }
//                 }
//                 const parseContent = ({lines, metadataIndices}) => {
//                     if (metadataIndices.length > 0) {
//                         lines = lines.slice(metadataIndices[1] + 1, lines.length)
//                     }
//                     return lines.join("\n")
//                 }
//                 const lines = contents.split("\n")
//                 const metadataIndices = lines.reduce(getMetadataIndices, [])
//                 const metadata = parseMetadata({lines, metadataIndices})
//                 const content = parseContent({lines, metadataIndices})
//                 const parsedDate = metadata.date ? formatDate(metadata.date) : new Date()
//                 const publishedDate = `${parsedDate["monthName"]} ${parsedDate["day"]}, ${parsedDate["year"]}`
//                 const datestring = `${parsedDate["year"]}-${parsedDate["month"]}-${parsedDate["day"]}T${parsedDate["time"]}:00`
//                 const date = new Date(datestring)
//                 const timestamp = date.getTime() / 1000
//                 post = {
//                     id: timestamp,
//                     title: metadata.title ? metadata.title : "No title given",
//                     author: metadata.author ? metadata.author : "No author given",
//                     date: publishedDate ? publishedDate : "No date given",
//                     time: parsedDate["time"],
//                     thumbnail: metadata.thumbnail,
//                     content: content ? content : "No content given",
//                 }
//                 postlist.push(post)
//                 ilist.push(i)
//                 if (ilist.length === files.length) {
//                     const sortedList = postlist.sort ((a, b) => {
//                         return a.id < b.id ? 1 : -1
//                     })
//                     let data = JSON.stringify(sortedList)
//                     fs.writeFileSync("src/posts.json", data)
//                 }
//             })
//         })
//     })
//     return 
// }

// const getPages = () => {
//     fs.readdir(dirPathPages, (err, files) => {
//         if (err) {
//             return console.log("Failed to list contents of directory: " + err)
//         }
//         files.forEach((file, i) => {
//             let page
//             fs.readFile(`${dirPathPages}/${file}`, "utf8", (err, contents) => { 
//                 page = {
//                     content: contents
//                 }
//                 pagelist.push(page)
//                 let data = JSON.stringify(pagelist)
//                 fs.writeFileSync("src/pages.json", data)
//             })
//         })
//     })
//     return 
// }
getSubFolder()
// getPosts()
// appendJsonList(getPosts())

// getPages()