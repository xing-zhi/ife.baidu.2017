document.addEventListener('DOMContentLoaded', () => {
  const tree = {
    value: 1,
    left: {
      value: 2,
      left: {
        value: 4,
        left: null,
        right: null
      },
      right: {
        value: 5,
        left: null,
        right: null
      }
    },
    right: {
      value: 3,
      left: {
        value: 6,
        left: null,
        right: null
      },
      right: {
        value: 7,
        left: null,
        right: null
      }
    }
  };

  function showTreeData(tree, containerEl) {
    const codeEl = document.createElement('code');

    codeEl.innerHTML = JSON.stringify(tree, null, 4);

    containerEl.appendChild(codeEl);
  }

  const visualiseTree = function visualiseTree(tree, containerEl) {
    if ( tree === null ) {
      return;
    }

    const el = document.createElement('div');

    el.innerHTML = tree.value;
    el.classList.add('tree-item');
    containerEl.appendChild(el);

    visualiseTree(tree.left, el);
    visualiseTree(tree.right, el);
  };

  /*
   * Translate a binary tree to an array
   * tree: root of the tree to translate
   * order: the order to tranverse the tree
   * fnRoot: function to handle the root node
   * fnLeft: function to get the left child tree
   * fnRight: function to get the right child tree
   */
  const treeMap = function treeMap(tree, order = 'pre', fnRoot = a => a.value, fnLeft = a => a.left, fnRight = a => a.right ) {
    if ( tree === null ) {
      return [];
    }

    const root = fnRoot(tree);
    const left = treeMap(fnLeft(tree), order, fnRoot, fnLeft, fnRight);
    const right = treeMap(fnRight(tree), order, fnRoot, fnLeft, fnRight);
    const dataMap = new Map()
            .set('pre', () => [root, ...left, ...right])
            .set('in', () => [...left, root, ...right])
            .set('post', () => [...left, ...right, root]);

    return dataMap.get(order)();
  };

  const $ = (selector, root = document) => root.querySelector(selector);

  const treeDataEl = $('#tree-data');
  const treePreOrderContainerEl = $('#tree-container');
  const orderSelector = $('#order-selector');
  const traverseTreeBtn = $('#btn-traverse-tree');

  showTreeData(tree, treeDataEl);
  visualiseTree(tree, treePreOrderContainerEl);

  traverseTreeBtn.addEventListener('click', () => {
    const root = treePreOrderContainerEl.firstElementChild;
    const order = orderSelector.value;
    const fnRoot = a => a;
    const fnLeft = el => el.firstElementChild;
    const fnRight = el => el.lastElementChild;
    const els = treeMap(root, order, fnRoot, fnLeft, fnRight);
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
});
