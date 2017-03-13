document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  function range(end, start = 1, step = 1) {
    const arr = [];

    for ( let i = start; i <= end; i += step ) {
      arr.push(i);
    }

    return arr;
  }

  function renderTable(n, actor, containerEl) {
    const td = function(i, row, content, classList) {
      return `<td data-row=${row} data-col=${i} class="${classList}">${content}</td>`;
    };
    const row = function(n, row, contentFn, classListFn) {
      const tds = range(n, 0)
              .map(i => td(i, row, contentFn(row, i), classListFn(row, i)))
              .join('');

      return `<tr>${tds}</tr>`;
    };
    const table = function(n, contentFn, classListFn) {
      const rows = range(n, 0)
              .map(i => row(n, i, contentFn, classListFn))
              .join('');

      return `<table>${rows}</table>`;
    };
    const contentFn = (row, col) => {
      if ( row === 0 && col > 0 ) {
        return col;
      }

      if ( row > 0 && col === 0 ) {
        return row;
      }

      return '';
    };
    const classListFn = (row, col) => {
      if ( col === actor.posX && row === actor.posY ) {
        return `active ${actor.direction}`;
      }

      return '';
    };

    containerEl.innerHTML = table(n, contentFn, classListFn);
  }

  const actions = {
    up(actor, n) {
      const posY = actor.posY - 1;

      actor.posY = posY < 1 ? 1 : posY;
    },
    down(actor, n) {
      const posY = actor.posY + 1;

      actor.posY = posY > n ? n : posY;
    },
    left(actor, n) {
      const posX = actor.posX - 1;

      actor.posX = posX < 1 ? 1 : posX;
    },
    right(actor, n) {
      const posX = actor.posX + 1;

      actor.posX = posX > n ? n : posX;
    },
    go(actor, n) {
      actions[actor.direction](actor, n);
    },
    turnLeft(actor) {
      const newDirections = {
        up: 'left',
        left: 'down',
        down: 'right',
        right: 'up'
      };

      actor.direction = newDirections[actor.direction];
    },
    turnRight(actor) {
      const newDirections = {
        up: 'right',
        right: 'down',
        down: 'left',
        left: 'up'
      };

      actor.direction = newDirections[actor.direction];
    },
    turnBack(actor) {
      const newDirections = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      };

      actor.direction = newDirections[actor.direction];
    }
  };

  function init() {
    const playgroundEl = $('#playground');
    const orderInput = $('#order-input');
    const takeActionBtn = $('#btn-take-action');

    const n  = 10;
    const actor = {
      posX: Math.ceil(n / 2),
      posY: Math.ceil(n/ 2),
      direction: 'up'
    };

    renderTable(n, actor, playgroundEl);

    takeActionBtn.addEventListener('click', function() {
      const order = orderInput.value.trim().toLowerCase().replace(/\s/g, '');
      const orders = {
        go: 'go',
        tunlef: 'turnLeft',
        tunrig: 'turnRight',
        tunbac: 'turnBack'
      };

      if ( !order ) {
        return;
      }

      const action = actions[orders[order]];

      if ( !action ) {
        alert('请输入正确的指令');
        return;
      }

      action(actor, n);
      renderTable(n, actor, playgroundEl);
    });
  }

  init();
});
