export async function fetchWebsiteReport(website) {
  try {
    const reports = await import(`../../reports/${website}/jsonReport.json`);
    return reports.default;
  } catch (error) {
    console.log("error fetching json report");
    return false
  }
}
