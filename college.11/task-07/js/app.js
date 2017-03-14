document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const tableContainer = $('.table-container');
  const table= window.table;
  const tableData = {
    thead: [
      {
        name: '姓名',
        sort: false
      },
      {
        name: '语文',
        sort: true
      },
      {
        name: '数学',
        sort: true
      },
      {
        name: '英语',
        sort: true
      },
      {
        name: '总分',
        sort: true
      }
    ],
    rows: [
      ['小明', 80, 90, 70, 240],
      ['小红', 90, 60, 90, 240],
      ['小亮', 60, 100, 70, 230]
    ]
  };
  table.init(tableData, tableContainer);
});
