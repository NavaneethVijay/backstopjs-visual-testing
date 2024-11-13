import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import fse from "fs-extra";
import xml2js from 'xml2js';
import defaultConfig from "../backstop-default.json" assert { type: "json" };

async function parseXmlResponse(response) {
  const parser = new xml2js.Parser();
  const text = await response.text();
  const result = await parser.parseStringPromise(text);

  // Extract URLs from sitemap XML format
  const urls = result.urlset.url.map(entry => {
    const loc = entry.loc[0];
    return new URL(loc).pathname;
  });

  return urls;
}

async function getUrlsFromApi(referenceDomain, sitemap) {
  const sitemapUrl = "https://" + referenceDomain + sitemap.endpoint;

  try {
    const response = await fetch(sitemapUrl);

    if (sitemap.format === 'xml') {
      return await parseXmlResponse(response);
    } else {
      const { paths } = await response.json();
      return paths;
    }
  } catch (error) {
    console.error(`Error fetching ${sitemap.format.toUpperCase()} sitemap:`, error);
    return [];
  }
}

function generateStorageState(config) {
  const { defaultStorageState = null, domain, referenceDomain } = config;
  let storageState = {
    cookies: [],
    origins: [],
  };

  if(!defaultStorageState){
    return storageState;
  }

  if (defaultStorageState.hasOwnProperty("cookies")) {
    const cookies = defaultStorageState["cookies"];
    cookies.map((cookie) => {
      const domainCookies = {
        name: cookie.name,
        value: cookie.value,
        domain: domain,
        path: "/",
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      };
      const referenceDomainCookies = {
        name: cookie.name,
        value: cookie.value,
        domain: referenceDomain,
        path: "/",
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      };
      storageState.cookies.push(domainCookies);
      storageState.cookies.push(referenceDomainCookies);
    });
  }

  if (defaultStorageState.hasOwnProperty("localStorage")) {
    const localStorages = defaultStorageState["localStorage"];
    const domainLS = {
      origin: "https://" + domain,
      localStorage: localStorages,
    };
    const referenceDomainLS = {
      origin: "https://" + referenceDomain,
      localStorage: localStorages,
    };
    storageState.origins.push(domainLS);
    storageState.origins.push(referenceDomainLS);
  }

  return storageState;
}

export const configGenerator = async (config) => {
  const { referenceDomain, name, domain, sitemap, defaultStorageState = null } = config;

  if (!sitemap || !sitemap.endpoint || !sitemap.format) {
    console.error('Sitemap configuration is missing or invalid');
    return;
  }

  let urls = await getUrlsFromApi(referenceDomain, sitemap);

  if (urls.length === 0) {
    console.error("No URLs found. Exiting configuration generation.");
    return;
  }

  // Set cookies for the website
  const cookiePath = `backstop_data/${name}/engine_scripts/cookies.json`;
  const cookies = generateStorageState(config);
  console.log(cookies);

  const scriptDir = new URL(".", import.meta.url).pathname;
  const directoryPath = path.join(
    scriptDir,
    "..",
    "backstop_data",
    name,
    "engine_scripts"
  );

  // Move the engine scripts specific to the website
  const libDirectoryPath = path.resolve(
    scriptDir,
    "..",
    "backstop_data",
    "engine_scripts"
  );
  const destinationPath = path.join(directoryPath);
  await fs.mkdir(libDirectoryPath, { recursive: true });
  await fse.copy(libDirectoryPath, destinationPath);

  // Move website cookies to correct location
  await fs.mkdir(directoryPath, { recursive: true });
  const filePath = path.join(directoryPath, "cookies.json");
  await fs.writeFile(filePath, JSON.stringify(cookies, null, 2));
  console.log("StorageState saved to", filePath);

  const scenarios = urls.map((url, index) => {
    let urlValue = url;
    let refUrl = url;

    urlValue = "https://" + domain + url;
    refUrl = "https://" + referenceDomain + url;

    return {
      label: `Scenario ${index + 1}`,
      url: urlValue,
      referenceUrl: refUrl,
      delay: 8000,
    };
  });

  const newConfig = {
    ...defaultConfig,
    scenarios,
    id: name,
    paths: {
      bitmaps_reference: `public/${name}/bitmaps_reference`,
      bitmaps_test: `public/${name}/bitmaps_test`,
      engine_scripts: `backstop_data/${name}/engine_scripts`,
      html_report: `public/${name}/report`,
      ci_report: `public/${name}/ci_report`,
      json_report: `reports/${name}`,
    },
    engineOptions: {
      ...defaultConfig.engineOptions,
      storageState: cookiePath,
    },
  };

  const backstopConfig = JSON.stringify(newConfig, null, 2);

  try {
    await fs.writeFile(`${name}.json`, backstopConfig);
    console.log(`${name}.json created successfully.`);
  } catch (error) {
    console.error("Error writing BackstopJS configuration:", error);
  }
};
