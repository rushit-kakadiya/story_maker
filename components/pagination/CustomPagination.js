import React from "react";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import Image from "next/image";
import FirstPageIc from "../../public/images/first_page.png";
import PrevPageIc from "../../public/images/prev_page.png";
import NextPageIc from "../../public/images/next_page.png";
import LastPageIc from "../../public/images/last_page.png";

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const getNumberOfPages = (count, rowsPerPage) => {
    return Math.ceil(count / rowsPerPage);
  };

  const handleFirstPageButtonClick = () => {
    onPageChange(1);
  };

  const handleBackButtonClick = () => {
    onPageChange(page);
  };

  const handleNextButtonClick = () => {
    onPageChange(page + 2);
  };

  const handleLastPageButtonClick = () => {
    onPageChange(getNumberOfPages(count, rowsPerPage));
  };

  return (
    <>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <div className="paginationIcons">
          <Image src={FirstPageIc} width={13} height={13} alt="" />
        </div>
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <div className="paginationIcons">
          <Image src={PrevPageIc} width={13} height={13} alt="" />
        </div>
      </IconButton>
      <div className="customPagination">
        {`${page + 1} / ${getNumberOfPages(count, rowsPerPage)}`}
      </div>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= getNumberOfPages(count, rowsPerPage) - 1}
        aria-label="next page"
      >
        <div className="paginationIcons">
          <Image src={NextPageIc} width={13} height={13} alt="" />
        </div>
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= getNumberOfPages(count, rowsPerPage) - 1}
        aria-label="last page"
      >
        <div className="paginationIcons">
          <Image src={LastPageIc} width={13} height={13} alt="" />
        </div>
      </IconButton>
    </>
  );
}

const CustomPagination = ({
  rowsPerPage,
  rowCount,
  onPageChange,
  onRowsPerPageChange,
  currentPage,
}) => (
  onPageChange ? <TablePagination
    component="nav"
    count={rowCount}
    rowsPerPage={rowsPerPage}
    page={currentPage - 1}
    onPageChange={onPageChange}
    onRowsPerPageChange={({ target }) =>
    onRowsPerPageChange(Number(target.value))
    }
    ActionsComponent={TablePaginationActions}
  /> : null
);

export default CustomPagination;
