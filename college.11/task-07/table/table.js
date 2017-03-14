(function(global) {
  const $ = (selector, root = document) => root.querySelector(selector);

  function generateTable(data) {
    const theadData = data.thead;
    const rowsData = data.rows;

    const theadCells = theadData => theadData
            .map((cell, i) => `<th data-col=${i}>${cell.name}${cell.sort ? '<i class="sort-icon" data-sort="desc"></i><i class="sort-icon" data-sort="asc"></i>' : ''}</th>`)
            .join('');
    const rowCells = rowData => rowData
            .map(cell => `<td>${cell}</td>`)
            .join('');
    const rows = rowsData => rowsData
            .map(row => `<tr>${rowCells(row)}</tr>`)
            .join('');
    const thead = `<thead><tr>${theadCells(theadData)}</tr></thead>`;
    const tbody = `<tbody>${rows(rowsData)}</tbody>`;

    return `<table>${thead}${tbody}</table>`;
  }

  function renderTable(data, container) {
    const tableEl = generateTable(data);

    container.innerHTML = tableEl;
  }

  // Add table to container with the data
  // data: { thead: [{ name: xxx, sort: true/false }], rows: [[xxx]] }
  // container: the element where the table is rendered in
  // sortCb: callback to call when sort icon is clicked
  function init(data, container, sortCb) {
    renderTable(data, container);

    container.addEventListener('click', function(e) {
      const target = e.target;

      if ( !target.classList.contains('sort-icon') ) {
        return;
      }

      const colToSort = target.parentNode.dataset.col;
      const isDesc = target.dataset.sort === 'desc';

      if ( typeof sortCb !== 'function' ) {
        const sortedRows = data.rows.sort(function(a, b) {
          const i = colToSort;

          return isDesc ? a[i] - b[i] : b[i] - a[i];
        });
        const newData = Object.assign(data, { rows: sortedRows });

        renderTable(newData, container);

        return;
      }

      sortCb(data, container, renderTable, colToSort, isDesc);
    });
  }

  global.table = {
    init
  };
})(window);
