import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url';

const dirname = fileURLToPath(import.meta.url)
const dirPath = path.join(dirname, "../../src/data")

// Read the JSON file
fs.readFile(path.join(dirPath, "mergedtimetable_minified.json"), "utf8", (err, data) => {
  // Handle any errors
  if (err) {
    console.error(err);
    return;
  }
  // Parse the JSON data
  data = JSON.parse(data);

  // Loop through the data
  for (let day of data) {
    for (let slot of day["data"]) {
      delete slot["or"];
      delete slot["time"];
      for (let item of slot["item"]) {
        // Check if the item has info
        if (item["hasInfo"]) {
          // Loop through the info list
          for (let info of item["info"]) {
            // Remove the presenters, hasInfo and contact fields
            delete info["presenters"];
            delete info["contact"];
            delete info["href"];
            delete info["text"];
            delete info["button_text"];
            delete info["link"];
          }
          // Remove the hasInfo field from the item
          delete item["hasInfo"];
        }
        delete item["location"];
      }
    }
  }

  // Stringify the modified JSON data
  data = JSON.stringify(data, null, 4);

  // Write the modified JSON file
  fs.writeFile("mergedtimetable_minified_modified.json", data, "utf8", (err) => {
    // Handle any errors
    if (err) {
      console.error(err);
      return;
    }
    // Log a success message
    console.log("The JSON file has been modified successfully.");
  });
});