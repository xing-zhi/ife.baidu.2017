document.addEventListener('DOMContentLoaded', () => {
  const dataInputEl = document.querySelector('#data-input');
  const btnContainerEl = document.querySelector('#btn-container');
  const leftOutBtn = document.querySelector('button[data-action="left-out"]');
  const leftInBtn = document.querySelector('button[data-action="left-in"]');
  const rightOutBtn = document.querySelector('button[data-action="right-out"]');
  const rightInBtn = document.querySelector('button[data-action="right-in"]');
  const dataContainerEl = document.querySelector('#items');

  let items = [];

  leftInBtn.disabled = true;
  rightInBtn.disabled = true;
  leftOutBtn.disabled = true;
  rightOutBtn.disabled = true;

  function renderItems(items, itemsContainer) {
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const itemEl = document.createElement('span');
      itemEl.innerHTML = item;
      itemEl.classList.add('data-item');
      itemEl.setAttribute('title', '点击删除该项');
      itemEl.setAttribute('data-index', index);

      fragment.appendChild(itemEl);
    });

    itemsContainer.innerHTML = '';
    itemsContainer.appendChild(fragment);
  }

  const actionMap = new Map()
          .set('left-out', items => items.slice(1))
          .set('left-in', (items, newItem) => newItem ? [newItem].concat(items) : items)
          .set('right-out', items => items.slice(0, -1))
          .set('right-in', (items, newItem) => newItem ? items.concat(newItem) : items);

  btnContainerEl.addEventListener('click', function(e) {
    const target = e.target;
    const action = target.dataset.action;
    const newItem = dataInputEl.value;

    items = actionMap.get(action)(items, newItem);

    // clear the input and disable add button when the action is add item
    if ( /in/.test(action) ) {
      dataInputEl.value = '';
      leftInBtn.disabled = true;
      rightInBtn.disabled = true;
    }

    renderItems(items, dataContainerEl);

    leftOutBtn.disabled = !items.length ? true : false;
    rightOutBtn.disabled = !items.length ? true : false;
  });

  dataInputEl.addEventListener('input', function() {
    const value = this.value;

    leftInBtn.disabled = !value ? true : false;
    rightInBtn.disabled = !value ? true : false;
  });

  dataContainerEl.addEventListener('click', function(e) {
    const target = e.target;
    const itemToRemove = target.dataset.index;

    items.splice(itemToRemove, 1);

    renderItems(items, dataContainerEl);
  });
});
