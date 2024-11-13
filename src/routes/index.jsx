import { websites } from "../../website-config";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const MainContainer = styled.main`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
`;

const ColumnWrapper = styled.div`
  grid-column: span 4;
  padding: 1rem;
  background: #10384f;
  color: white;
`;
const ReportContainer = styled.div`
  padding: 1rem;
`;

const Heading = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.571;
  margin: 0;
`;

const Paragraph = styled.p`
  margin-top: 0;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 400px); /* Three columns with equal width */
  gap: 10px; /* Gap between grid items */
`;

const GridItem = styled.div`
  padding: 0 0 10px 0; /* Example padding */
`;

const LinkWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

export default function Home() {
  const [availableReports, setAvailableReports] = useState([]);

useEffect(() => {
  const checkIfReportExists = async (website) => {
    try {
      await import(`../../reports/${website}/jsonReport.json`);
      return true;
    } catch (error) {
      console.log(`Report not available for ${website}`);
      return false;
    }
  };

  const fetchAvailableReports = async () => {
    const availableWebsites = await Promise.all(
      websites.map(async (website) => {
        const status = await checkIfReportExists(website.name);
        if (status) {
          return website;
        } else {
          return null;
        }
      })
    );
    const filteredWebsites = availableWebsites.filter((website) => website !== null);
    setAvailableReports(filteredWebsites);
  };

  fetchAvailableReports();
}, []);
  return (
    <MainContainer>
      <ColumnWrapper>
        <Heading>Visual Regression Testing</Heading>
        <Paragraph>
          using{" "}
          <a
            href="https://github.com/garris/BackstopJS"
            target="_blank"
            className="text-orange-500"
          >
            BackstopJS
          </a>
        </Paragraph>
      </ColumnWrapper>
      <ReportContainer>
        <h2>Report Details</h2>
        <GridContainer>
          <GridItem>
            <h3>Reference Domain</h3>
          </GridItem>
          <GridItem>
            <h3>Test Domain</h3>
          </GridItem>
          <GridItem>
            <h3>Actions</h3>
          </GridItem>
          {availableReports.map((website) => (
            <>
              <GridItem>
                <a href={`https://${website.referenceDomain}`} target="_blank">
                  {website.referenceDomain}
                </a>
              </GridItem>
              <GridItem>
                <a href={`https://${website.domain}`} target="_blank">
                  {website.domain}
                </a>
              </GridItem>
              <GridItem>
                <LinkWrapper>
                  <Link to={`/reports/desktop/${website.name}`}>
                    Desktop Report
                  </Link>
                  <Link to={`/reports/mobile/${website.name}`}>
                    Mobile Report
                  </Link>
                </LinkWrapper>
              </GridItem>
            </>
          ))}
        </GridContainer>
      </ReportContainer>
    </MainContainer>
  );
}
