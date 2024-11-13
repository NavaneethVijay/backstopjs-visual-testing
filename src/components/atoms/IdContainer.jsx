import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { websites } from "../../../website-config.js";

import {
  changeWebsite,
  setSuiteInfo
} from '../../actions';
import { fetchWebsiteReport } from '../../helpers/reports'


const Select = styled.select`
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  cursor: pointer;
`;

class IdConfig extends React.Component {

  async fetchWebsiteInfo(website) {
    const { changeWebsite, setSuiteInfo } = this.props
    const data = await fetchWebsiteReport(website)
    if(data){
      changeWebsite(data)
      setSuiteInfo(data)
    }
  }

  render() {
    return (
      <Select onChange={(event) => {
        this.fetchWebsiteInfo(event.target.value)
      }}>
        {
          websites.map(website =>  <option key={1} value={website.name}>{website.testName}</option>)
        }
      </Select>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    idConfig: state.suiteInfo.idConfig,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeWebsite: (value) => {
      dispatch(changeWebsite(value));
    },
    setSuiteInfo: (value) => {
      dispatch(setSuiteInfo(value));
    }
  };
};

const IdContainer = connect(mapStateToProps, mapDispatchToProps)(IdConfig);

export default IdContainer;
