import styled from 'styled-components';
import { StickyContainer } from 'react-sticky';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/ecosystems/Header';
import List from '../components/ecosystems/List';
import ScrubberModal from '../components/ecosystems/ScrubberModal';
import { connect } from 'react-redux';
import { changeWebsite } from '../actions';
const Wrapper = styled.section`
  padding: 0 30px;
`;

export function ReportApp(props) {
  let { viewport, website } = useParams();
  const { setInitialState } = props

  useEffect(() => {
    const processData = async () => {
      try {
        const reports = await import(`../../reports/${website}/jsonReport.json`);
        const data = reports.default;
        setInitialState({data, viewport})
      } catch (error) {
        console.log("error fetching json report");
      }
    }
    processData();
  }, [website, viewport, setInitialState])


  return (
    <StickyContainer>
      <Header />
      <Wrapper>
        <List />
      </Wrapper>
      <ScrubberModal />
    </StickyContainer>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setInitialState: (initialState) => dispatch(changeWebsite(initialState))
});

export default connect(null, mapDispatchToProps)(ReportApp);
