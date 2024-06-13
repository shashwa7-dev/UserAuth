const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const updateEmployeeDB = async (updatedEmployees) => {
  try {
    const modelDir = path.join(__dirname, "..", "model");

    if (!fs.existsSync(modelDir)) {
      await fsPromises.mkdir(modelDir);
    }

    const filePath = path.join(modelDir, "employees.json");
    const data = JSON.stringify(updatedEmployees, null, 2);

    await fsPromises.writeFile(filePath, data);
  } catch (err) {
    console.error(err);
  }
};

module.exports = updateEmployeeDB;
