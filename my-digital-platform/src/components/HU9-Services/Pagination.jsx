import React from 'react';

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="flex justify-left space-x-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="px-3 py-1">{page} / {totalPages}</span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(p => p + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;