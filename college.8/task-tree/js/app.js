document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  function isNotEmptyArray(arr) {
    return Array.isArray(arr) && arr.length;
  }
  function tree(root, level) {
    const children = root.children;
    // hasChildren: flag for rendering children nodes
    const hasChildren = isNotEmptyArray(children);
    // isFolder: flag for selecting icon
    const isFolder = Array.isArray(children);

    return `
<li class="node" data-level=${level}>
${isFolder ? '<i class="icon-folder"></i>' : '<i class="icon-file-empty"></i>'}
${root.name}${hasChildren ? generateNodes(children, level + 1) : ''}
</li>`;
  }

  function generateNodes(nodes, level) {
    return `<ul class="folder ${level ? 'fold' : ''}">${nodes.map(node => tree(node, level)).join('')}</ul>`;
  }

  function init() {
    const nodes = [ {name: "父节点1", children: [ {name: "子节点1"}, {name: "子节点2"} ]}, {name: "父节点2", children: [ {name: "子节点3"}, {name: "子节点4", children:[ {name:"子节点5"} ]} ]} ];
    const treeContainer = $('.tree-container');
    const dataContainer = $('.data-container');

    dataContainer.innerHTML = JSON.stringify(nodes, null, 4);
    treeContainer.innerHTML = isNotEmptyArray(nodes) ? generateNodes(nodes, 0) : '';

    // show/hide children nodes by clicking the folder icon
    treeContainer.addEventListener('click', function(e) {
      const target = e.target;

      if ( !target.classList.contains('icon-folder') ) {
        return;
      }

      const childTree = target.parentNode.querySelector('ul');

      if ( childTree ) {
        target.classList.toggle('open');
        childTree.classList.toggle('fold');
      }
    });
  }

  init();
});
