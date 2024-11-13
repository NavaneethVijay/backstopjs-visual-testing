import backstop from "backstopjs";
import { websites } from "../website-config.js";
import fs from "fs";

function replaceTextInFile(filePath, searchText, replacementText) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const regex = new RegExp(searchText, "g");
    const updatedContent = data.replace(regex, replacementText);
    fs.writeFile(filePath, updatedContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Replacement complete.");
    });
  });
}
async function runTests(name) {
  console.log(`Running test report for website ${name}`);
  const configFile = `${name}.json`;
  const options = {
    config: configFile,
  };
  try {
    await backstop("test", options);
    console.log(`Test report generation completed for website ${name}`);
  } catch (error) {
    console.error(`Test cases failed for website ${name}`);
  }
  try {
    const filePath = `reports/${name}/jsonReport.json`;
    replaceTextInFile(filePath, "/public", "");
  } catch (error) {
    console.log("Failed replacing content");
  }
}

(async () => {
  const configFile = process.env.npm_config_config;
  if (configFile) {
    await runTests(configFile);
  } else {
    for (const siteConfig of websites) {
      const { name } = siteConfig;
      await runTests(name);
    }
  }
})();
