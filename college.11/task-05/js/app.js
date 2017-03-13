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

      return Object.assign(actor, {
        posY: posY < 1 ? 1 : posY
      });
    },
    down(actor, n) {
      const posY = actor.posY + 1;

      return Object.assign(actor, {
        posY: posY > n ? n : posY
      });
    },
    left(actor, n) {
      const posX = actor.posX - 1;

      return Object.assign(actor, {
        posX: posX < 1 ? 1 : posX
      });
    },
    right(actor, n) {
      const posX = actor.posX + 1;

      return Object.assign(actor, {
        posX: posX > n ? n : posX
      });
    },
    go(actor, n) {
      return actions[actor.direction](actor, n);
    },
    turnLeft(actor) {
      const newDirections = {
        up: 'left',
        left: 'down',
        down: 'right',
        right: 'up'
      };

      return Object.assign(actor, {
        direction: newDirections[actor.direction]
      });
    },
    turnRight(actor) {
      const newDirections = {
        up: 'right',
        right: 'down',
        down: 'left',
        left: 'up'
      };

      return Object.assign(actor, {
        direction: newDirections[actor.direction]
      });
    },
    turnBack(actor) {
      const newDirections = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      };

      return Object.assign(actor, {
        direction: newDirections[actor.direction]
      });
    },
    turnToLeft(actor) {
      return Object.assign(actor, {
        direction: 'left'
      });
    },
    turnToRight(actor) {
      return Object.assign(actor, {
        direction: 'right'
      });
    },
    turnToUp(actor) {
      return Object.assign(actor, {
        direction: 'up'
      });
    },
    turnToDown(actor) {
      return Object.assign(actor, {
        direction: 'down'
      });
    }
  };

  function translate(actor, actorEl) {
    const targetCell = $(`td[data-row="${actor.posY}"][data-col="${actor.posX}"]`);
    const targetPosition = targetCell.getBoundingClientRect();

    actorEl.style.top = `${targetPosition.top}px`;
    actorEl.style.left = `${targetPosition.left}px`;
  }

  function takeAction(order, n, actor, actorEl) {
    const action = actions[order];
    const newActor = action(actor, n);

    actor.direction = newActor.direction;
    actorEl.dataset.direction = newActor.direction;
    translate(actor, actorEl);
  }

  function init() {
    const playgroundEl = $('#board');
    const orderInput = $('#order-input');
    const takeActionBtn = $('#btn-take-action');
    const actorEl = $('.actor');
    // Interval of transition, in seconds
    const interval = 1;

    const n  = 10;
    const actor = {
      posX: Math.ceil(n / 2),
      posY: Math.ceil(n/ 2),
      direction: 'up'
    };

    renderTable(n, actor, playgroundEl);
    translate(actor, actorEl);

    // There is no transition in the initial move
    setTimeout(() => {
      actorEl.style.transition = `all ${interval}s`;
    });

    takeActionBtn.addEventListener('click', function() {
      const order = orderInput.value.trim().toLowerCase().replace(/\s/g, '');
      const orders = {
        go: 'go',
        tunlef: 'turnLeft',
        tunrig: 'turnRight',
        tunbac: 'turnBack',
        tralef: 'left',
        trarig: 'right',
        tratop: 'up',
        trabot: 'down',
        movlef: ['turnToLeft', 'left'],
        movrig: ['turnToRight', 'right'],
        movtop: ['turnToUp', 'up'],
        movbot: ['turnToDown', 'down']
      };

      if ( !order ) {
        return;
      }

      const innerOrder = orders[order];

      if ( !innerOrder ) {
        alert('请输入正确的指令');
        return;
      }

      // Simple action
      if ( typeof innerOrder === 'string' ) {
        takeAction(innerOrder, n, actor, actorEl);
        return;
      }

      // Composite action
      const orderAmount = innerOrder.length;
      const intervalOfEach = interval / orderAmount;

      // Composite action is splited into a series of simple action
      actorEl.style.transition = `all ${intervalOfEach}s`;
      innerOrder.forEach((order, index) => {
        setTimeout(() => {
          takeAction(order, n, actor, actorEl);
        }, index * intervalOfEach);
      });
      setTimeout(() => {
        actorEl.style.transition = `all ${interval}s`;
      }, interval);
    });
  }

  init();
});
