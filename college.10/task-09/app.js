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

  function createTreeNode(content) {
    const el = document.createElement('div');

    el.innerHTML = content;
    el.classList.add('tree-item');

    return el;
  }

  const visualiseTree = function visualiseTree(tree, containerEl, isRoot = true) {
    if ( tree === null ) {
      return;
    }

    const el = createTreeNode(tree.value);

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

  const currentClass = 'current';
  const selectedClass = 'selected';
  const matchClass = 'match';
  const interval = 1000;

  showTreeData(tree, treeDataEl);
  visualiseTree(tree, treeContainerEl);

  traverseTreeBtn.addEventListener('click', () => {
    const root = treeContainerEl.firstElementChild;
    const els = treeMap(root);

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

  /* Search */
  const searchInputEl = $('#search-input');
  const searchBtn = $('#btn-search');

  searchBtn.addEventListener('click', () => {
    const keyword = searchInputEl.value.trim();
    const root = treeContainerEl.firstElementChild;
    const els = treeMap(root);
    const elsWithMatch = els.map(el => ({
      el: el,
      match: [].filter.call(el.childNodes, node => node.nodeType === 3)[0].textContent.indexOf(keyword) !== -1
    }));

    clearClass(root, matchClass);

    elsWithMatch.forEach((elObj, i, arr) => {
      const el = elObj.el;

      setTimeout(() => {
        if ( i !== 0 ) {
          const last = arr[i - 1];

          last.el.classList.remove(currentClass);

          if ( last.match ) {
            last.el.classList.add(matchClass);
          }
        }

        if ( i === arr.length - 1) {
          setTimeout(() => {
            el.classList.remove(currentClass);

            if ( elObj.match ) {
              el.classList.add(matchClass);
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
  /* \Search */

  let selectedNode = null;
  const deleteBtn = $('#btn-delete');
  const addBtn = $('#btn-add');
  const nodeContentEl = $('#node-content');

  /* Select node */
  treeContainerEl.addEventListener('click', function(e) {
    clearClass(treeContainerEl.firstElementChild, selectedClass);

    const target = e.target;

    // Click the element in the tree container other than div.tree-item to clear selection
    if ( !target.classList.contains('tree-item') ) {
      selectedNode = null;
      buttonsAbilityProxy.selected = selectedNode;

      return;
    }

    target.classList.add(selectedClass);
    selectedNode = target;

    buttonsAbilityProxy.selected = selectedNode;
  });
  /* \Select node */

  /* Delete node */
  deleteBtn.addEventListener('click', function() {
    if ( !selectedNode ) {
      return;
    }

    selectedNode.parentNode.removeChild(selectedNode);
    selectedNode = null;
    buttonsAbilityProxy.selected = selectedNode;
  });
  /* \Delete node */

  /* Add node */
  addBtn.addEventListener('click', function() {
    const content = nodeContentEl.value.trim();

    if ( !selectedNode || !content ) {
      return;
    }

    const el = createTreeNode(content);

    selectedNode.appendchild(el);
    nodeContentEl.value = '';
    buttonsAbilityProxy.content = '';
  });
  /* \Add node */

  /* Use Proxy to change the ability of buttons  */
    const buttonsAbilityHandler = {
    set(target, key, value) {
      if ( key === 'keyword' ) {
        searchBtn.disabled = !value;
      }
      if ( key === 'selected' ) {
        deleteBtn.disabled = !value;
        addBtn.disabled = !(value && target.content);
      }
      if ( key === 'content' ) {
        addBtn.disabled = !(value && target.selected);
      }

      target[key] = value;
    }
  };
  const buttonsAbilityData = {
    keyword: '',
    selected: null,
    content: ''
  };
  const buttonsAbilityProxy = new Proxy(buttonsAbilityData, buttonsAbilityHandler);

  buttonsAbilityProxy.keyword = '';
  buttonsAbilityProxy.selected = null;
  buttonsAbilityProxy.content = '';

  searchInputEl.addEventListener('input', function() {
    const keyword = this.value.trim();

    buttonsAbilityProxy.keyword = keyword;
  });

  nodeContentEl.addEventListener('input', function() {
    const content = this.value.trim();

    buttonsAbilityProxy.content = content;
  });
  /* \Use Proxy to change the ability of buttons  */
});
