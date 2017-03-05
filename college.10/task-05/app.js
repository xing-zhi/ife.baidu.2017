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
    const newItem = parseFloat(dataInputEl.value);
    const lowLimit = 10;
    const highLimit = 100;
    const itemAmountLimit = 60;

    if ( newItem < lowLimit || newItem > highLimit ) {
      alert(`请输入位于${lowLimit}-${highLimit}范围内的数字`);

      return;
    }

    if ( items.length > itemAmountLimit ) {
      alert(`最多添加${itemAmountLimit}个数字`);

      return;
    }

    items = actionMap.get(action)(items, newItem);

    // clear the input and disable the add buttons when the action is adding item
    if ( /in/.test(action) ) {
      dataInputEl.value = '';
      leftInBtn.disabled = true;
      rightInBtn.disabled = true;
    }

    renderItems(items, dataContainerEl);

    leftOutBtn.disabled = items.length === 0;
    rightOutBtn.disabled = items.length === 0;

    // It's better to use an eventbus here
    visualiseDataBtn.disabled = items.length === 0;
    visualiseSortBtn.disabled = items.length < 2;
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

    renderItems(items, dataContainerEl);
  });

  // data visualisation
  const visualiseDataBtn = document.querySelector('#btn-visualise-data');
  const dataVisualisationContainer = document.querySelector('#data-visualisation-container');

  visualiseDataBtn.disabled = items.length === 0;

  // Another method to generate html: generate the string and then set the innerHTML property of container element
  function visualiseData(arr, containerEl) {
    const itemElsSting = arr.map(item => `<i style="height: ${item}px" class="data-visualisation-item" title="${item}"></i>`);

    containerEl.innerHTML = itemElsSting.join('');
  }

  visualiseDataBtn.addEventListener('click', function() {
    visualiseData(items, dataVisualisationContainer);
  });
  // \data visualisation

  // sort data
  const visualiseSortBtn = document.querySelector('#btn-visualise-sort');
  const sortVisualisationContainer = document.querySelector('#sort-visualisation-container');

  visualiseSortBtn.disabled = items.length === 0;

  // arr: the data to sort
  // desc: descending order or not
  // fn: function to run at each iteratation with the temporary data
  function sort(arr, desc = false, fn) {
    if ( arr.length < 2 ) {
      return arr;
    }

    const sortedArr = [...arr];
    const len = sortedArr.length;

    if ( typeof fn === 'function' ) {
      fn([...sortedArr], 0);
    }

    for ( let i = 0; i < len - 1; i++ ) {
      let maxIndex = i;

      for ( let j = i + 1; j < len; j++ ) {
        maxIndex = sortedArr[j] > sortedArr[maxIndex] ? j : maxIndex;
      }

      const temp = sortedArr[i];
      sortedArr[i] = sortedArr[maxIndex];
      sortedArr[maxIndex] = temp;

      if ( typeof fn === 'function' ) {
        fn([...sortedArr], i + 1);
      }
    }

    return sortedArr;
  }

  visualiseSortBtn.addEventListener('click', function() {
    const interval = 1000;

    sort(items, false, function(arr, i) {
      setTimeout(() => {
        visualiseData(arr, sortVisualisationContainer);
      }, i * interval);
    });
  });
  // \sort data
});
