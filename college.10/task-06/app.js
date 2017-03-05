document.addEventListener('DOMContentLoaded', () => {
  const dataInputEl = document.querySelector('#data-input');
  const btnContainerEl = document.querySelector('#btn-container');
  const leftOutBtn = document.querySelector('button[data-action="left-out"]');
  const leftInBtn = document.querySelector('button[data-action="left-in"]');
  const rightOutBtn = document.querySelector('button[data-action="right-out"]');
  const rightInBtn = document.querySelector('button[data-action="right-in"]');
  const dataContainerEl = document.querySelector('#items');

  // seach predicate will be used when render if hasSearched
  let hasSearched = false;
  let items = [];

  leftInBtn.disabled = true;
  rightInBtn.disabled = true;
  leftOutBtn.disabled = true;
  rightOutBtn.disabled = true;

  function renderItems(items, itemsContainer, /* optional */predicates = []) {
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const itemEl = document.createElement('span');

      itemEl.innerHTML = item;
      itemEl.classList.add('data-item');
      itemEl.setAttribute('title', '点击删除该项');
      itemEl.setAttribute('data-index', index);

      if ( predicates.length ) {
        predicates.forEach(predicate => {
          if ( predicate.fn(item) ) {
            itemEl.classList.add(predicate.className);
          }
        });
      }

      fragment.appendChild(itemEl);
    });

    itemsContainer.innerHTML = '';
    itemsContainer.appendChild(fragment);
  }

  const actionMap = new Map()
          .set('left-out', items => items.slice(1))
          .set('left-in', (items, newItems) =>  newItems.concat(items))
          .set('right-out', items => items.slice(0, -1))
          .set('right-in', (items, newItems) => items.concat(newItems));

  btnContainerEl.addEventListener('click', function(e) {
    const target = e.target;
    const action = target.dataset.action;
    const newItems = dataInputEl.value.trim().split(/[\n\s,，、]+/);

    items = actionMap.get(action)(items, newItems);

    // clear the input and disable the add buttons when the action is add item
    if ( /in/.test(action) ) {
      dataInputEl.value = '';
      leftInBtn.disabled = true;
      rightInBtn.disabled = true;
    }

    renderItems(items, dataContainerEl, predicatesGenerator());

    leftOutBtn.disabled = items.length === 0;
    rightOutBtn.disabled = items.length === 0;
  });

  dataInputEl.addEventListener('input', function() {
    const value = this.value;

    leftInBtn.disabled = !value;
    rightInBtn.disabled = !value;
  });

  dataContainerEl.addEventListener('click', function(e) {
    const target = e.target;
    const indexOfItemToRemove = target.dataset.index;
    const itemtoRemove = target.innerHTML;
    const removeConfirm = confirm(`确认删除 ${itemtoRemove} 吗`);

    if ( !removeConfirm ) {
      return;
    }

    items.splice(indexOfItemToRemove, 1);

    renderItems(items, dataContainerEl, predicatesGenerator());
  });

  // search
  const searchInputEl = document.querySelector('#search-input');
  const searchBtn = document.querySelector('#btn-search');

  const predicatesGenerator = () => {
    const keyword = searchInputEl.value.trim();

    if ( !keyword || !hasSearched ) {
      return [];
    }

    return [
      {
        fn: str => str.indexOf(keyword) !== -1,
        className: 'match'
      }
    ];
  };

  searchBtn.disabled = true;

  searchInputEl.addEventListener('input', function() {
    const value = this.value;

    searchBtn.disabled = !value;
  });

  searchBtn.addEventListener('click', function() {
    hasSearched = true;
    renderItems(items, dataContainerEl, predicatesGenerator());
  });
  // \search
});
