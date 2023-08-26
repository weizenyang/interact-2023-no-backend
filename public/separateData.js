import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url';

const dirname = fileURLToPath(import.meta.url)
const dirPath = path.join(dirname, "../../src/data")

// Read the JSON file
fs.readFile(path.join(dirPath, "../../mergedProgrammeData.json"), "utf8", (err, data) => {
  // Handle any errors
  if (err) {
    console.error(err);
    return;
  }
  // Parse the JSON data
  data = JSON.parse(data);

  // Create an empty array to store the separated objects
  let objects = [];

  // Loop through the data
  for (let day of data) {
    // Get the day, date and data fields
    let day_number = day["day"];
    let date = day["date"];
    let data_list = day["data"];
    // Loop through the data list
    for (let slot of data_list) {
      // Get the time and item fields
      let time = slot["time"];
      let item_list = slot["item"];
      // Loop through the item list
      for (let item of item_list) {
        // Get the text and location fields
        let text = item["text"];
        let location = item["location"] || null;
        // Check if the item has info
        if (item["hasInfo"]) {
          // Loop through the info list
          for (let info of item["info"]) {
            // Copy the info object using JSON.parse and JSON.stringify to avoid reference issues
            let info_object = JSON.parse(JSON.stringify(info));
            // Add the time, day, location, date and text fields
            info_object["time"] = time;
            info_object["day"] = "Day " + day_number;
            info_object["location"] = location;
            info_object["date"] = date;
            info_object["text"] = text;
            // Push the info object to the objects array
            objects.push(info_object);
          }
        }
      }
    }
  }

  // Stringify the objects array as a JSON string
  let json_string = JSON.stringify(objects, null, 4);

  // Write the JSON string to a file
  fs.writeFile("objects.json", json_string, "utf8", (err) => {
    // Handle any errors
    if (err) {
      console.error(err);
      return;
    }
    // Log a success message
    console.log("The JSON file has been created successfully.");
  });
});

