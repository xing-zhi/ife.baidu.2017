document.addEventListener('DOMContentLoaded', () => {
  const tree = {
    value: 'l1-1',
    children: [
      {
        value: 'l2-1',
        children: [
          {
            value: 'l3-1',
            children: null
          },
          {
            value: 'l3-2',
            children: null
          }
        ]
      },
      {
        value: 'l2-2',
        children: []
      },
      {
        value: 'l2-3',
        children: [
          {
            value: 'l3-1',
            children: null
          },
          {
            value: 'l3-2',
            children: null
          }
        ]
      },
      {
        value: 'l2-4',
        children: null
      }
    ]
  };

  function showTreeData(tree, containerEl) {
    const codeEl = document.createElement('code');

    codeEl.innerHTML = JSON.stringify(tree, null, 4);

    containerEl.appendChild(codeEl);
  }

  const visualiseTree = function visualiseTree(tree, containerEl, isRoot = true) {
    if ( tree === null ) {
      return;
    }

    const el = document.createElement('div');

    el.innerHTML = tree.value;
    el.classList.add('tree-item');
    if ( isRoot ) {
      containerEl.innerHTML = '';
    }
    containerEl.appendChild(el);

    const children = tree.children;

    if ( children && children.length ) {
      children.forEach(child => visualiseTree(child, el, false));
    }
  };

  /*
   * Translate a tree to an array
   * tree: root of the tree to translate
   */
  const treeMap = function treeMap(tree) {
    if ( tree === null ) {
      return [];
    }

    const root = tree;
    let children = [];

    if ( tree.childNodes ) {
      children = [].filter
        .call(tree.childNodes, child => child.nodeName.toLowerCase() === 'div')
        .map(child => treeMap(child))
        .reduce((acc, item) => {
          return [...acc, ...item];
        }, []);
    }

    return [root, ...children];
  };

  function clearClass(tree, className) {
    const els = treeMap(tree);

    [].forEach.call(els, el => el.classList.remove(className));
  }

  const $ = (selector, root = document) => root.querySelector(selector);

  const treeDataEl = $('#tree-data');
  const treeContainerEl = $('#tree-container');
  const orderSelector = $('#order-selector');
  const traverseTreeBtn = $('#btn-traverse-tree');

  showTreeData(tree, treeDataEl);
  visualiseTree(tree, treeContainerEl);

  traverseTreeBtn.addEventListener('click', () => {
    const root = treeContainerEl.firstElementChild;
    const els = treeMap(root);
    const currentClass = 'current';
    const interval = 1000;

    els.forEach((el, i, arr) => {
      setTimeout(() => {
        if ( i !== 0 ) {
          arr[i - 1].classList.remove(currentClass);
        }

        if ( i === arr.length - 1) {
          setTimeout(() => {
            arr[i].classList.remove(currentClass);
          }, interval);
        }

        el.classList.add(currentClass);
      }, interval * i);
    });
  });

  /* search */
  const searchInputEl = $('#search-input');
  const serachBtn = $('#btn-search');

  serachBtn.disabled = true;

  searchInputEl.addEventListener('input', function() {
    const keyword = this.value.trim();

    serachBtn.disabled = !keyword;
  });

  serachBtn.addEventListener('click', () => {
    const keyword = searchInputEl.value.trim();
    const root = treeContainerEl.firstElementChild;
    const els = treeMap(root);
    const currentClass = 'current';
    const interval = 1000;
    const elsWithMatch = els.map(el => ({
      el: el,
      match: [].filter.call(el.childNodes, node => node.nodeType === 3)[0].textContent.indexOf(keyword) !== -1
    }));

    clearClass(root, 'match');

    elsWithMatch.forEach((elObj, i, arr) => {
      const el = elObj.el;

      setTimeout(() => {
        if ( i !== 0 ) {
          const last = arr[i - 1];

          last.el.classList.remove(currentClass);

          if ( last.match ) {
            last.el.classList.add('match');
          }
        }

        if ( i === arr.length - 1) {
          setTimeout(() => {
            el.classList.remove(currentClass);

            if ( elObj.match ) {
              el.classList.add('match');
            }

            const noMatch = !arr.some(elObj => elObj.match);

            if ( noMatch ) {
              alert('没有匹配的节点');
            }
          }, interval);
        }

        el.classList.add(currentClass);
      }, interval * i);
    });
  });
  /* \search */
});
