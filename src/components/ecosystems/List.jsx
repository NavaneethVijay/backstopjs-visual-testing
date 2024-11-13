import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

// organisms
import TestCard from '../organisms/TestCard';

const ListWrapper = styled.section`
  width: 100%;
  margin: 0 auto;
  margin-top: 20px;
  z-index: 1;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  padding: 1rem;
  background: #fafafa;
  gap: 0.5rem;
  max-width: 100%;
  overflow: scroll;
`;

const PageNumber = styled.span`
  cursor: pointer;
  width: 30px;
  height: 30px;
  min-width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => (props.active ? '#0f3850' : '#474747')};
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  &:hover {
    background-color: #f0f0f0;
  }
`;

const List = ({ tests, settings }) => {
  const onlyText =
    !settings.refImage && !settings.testImage && !settings.diffImage;
  const itemsPerPage = 10;
    // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = tests.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(tests.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % tests.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <ListWrapper>
        {currentItems.map((test, i, arr) => (
          <TestCard
          id={`test${i}`}
          numId={i}
          test={test}
          key={i}
          lastId={arr.length - 1}
          onlyText={onlyText}
          />
        ))}
      </ListWrapper>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
      />
    </>
  );
};

const mapStateToProps = state => {
  return {
    tests: state.tests.filtered,
    settings: state.layoutSettings
  };
};

const ListContainer = connect(mapStateToProps)(List);

export default ListContainer;
