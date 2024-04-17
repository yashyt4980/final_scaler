const fs = require("fs");
const pdf = require("pdf-parse");
const extractData = async (file) => {
    try {
      let dataBuffer = fs.readFileSync(file);
  
      const data = await pdf(dataBuffer);
  
      // Return the extracted data
      return {
        text: data.text,
        pages: data.numpages
      };
    } catch (error) {
      // Handle any errors
      console.error('Error extracting data:', error);
      throw error; // Re-throw the error to propagate it
    }
  };

module.exports = { extractData };
