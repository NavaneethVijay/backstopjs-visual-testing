import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors, fonts } from "../../styles";

const SuiteNameTitle = styled.h1`
  font-size: 26px;
  font-family: ${fonts.latoRegular};
  flex: 0 0 auto;
  margin: 0;
  color: ${colors.primaryText};
`;

class SuiteName extends React.Component {
  render() {
    return (
      <Link to="/">
        <SuiteNameTitle>Website's Visual Testing</SuiteNameTitle>
      </Link>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    suiteName: state.suiteInfo.testSuiteName,
  };
};

const SuiteNameContainer = connect(mapStateToProps)(SuiteName);

export default SuiteNameContainer;
