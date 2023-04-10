import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (newPage) => {
    onPageChange(newPage);
  };

  const renderPageButtons = () => {
    const buttons = [];

    // Add the "Previous" button
    buttons.push(
      <button key="prev" onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
        {'<'}
      </button>,
    );

    // Add the page number buttons
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          disabled={i === currentPage}
          className={i === currentPage ? 'font-bold' : ''}
        >
          {i}
        </button>,
      );
    }

    // Add the "Next" button
    buttons.push(
      <button key="next" onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
        {'>'}
      </button>,
    );

    return buttons;
  };

  return <div className="pagination">{renderPageButtons()}</div>;
};

export default Pagination;