(function(global) {
  const $ = (selector, root = document) => root.querySelector(selector);
  const bodyEl = $('body');
  const modalTemplate = `
    <div class="modal-container">
      <div class="modal-panel">
        <header>
          <h1 class="modal-title">{{ title }}</h1>
        </header>
        <section class="modal-content">{{ content }}</section>
        <footer>
          <button class="btn modal-btn-cancel">{{ cancelText }}</button>
          <button class="btn modal-btn-ok">{{ okText }}</button>
        </footer>
      </div>
    </div>`;

  function hide(el) {
    el.style.display = 'none';
  }

  function show(el, display = 'block') {
    el.style.display = display;
  }

  function init(options) {
    const fn = function() {};
    const {
      title,
      content,
      okText,
      cancelText,
      okCb,
      cancelCb
    } = Object.assign({
      okText: '确定',
      cancelText: '取消',
      okCb: fn,
      cancelCb: fn }, options);

    const modalHtml = modalTemplate
            .replace('{{ title }}', title)
            .replace('{{ content }}', content)
            .replace('{{ okText }}', okText)
            .replace('{{ cancelText }}', cancelText);

    // Use a tmporary div to translate string to html node
    let tmpDiv = document.createElement('div');

    tmpDiv.innerHTML = modalHtml;

    const modalContainer = $('.modal-container', tmpDiv);
    const panelEl = $('.modal-container .modal-panel', modalContainer);
    const modalHeader = $('.modal-container header', modalContainer);
    const okBtn = $('.modal-container .modal-btn-ok', modalContainer);
    const cancelBtn = $('.modal-container .modal-btn-cancel', modalContainer);

    tmpDiv = null;
    hide(modalContainer);
    bodyEl.appendChild(modalContainer);

    modalContainer.addEventListener('click', function() {
      hide(this);
    });

    panelEl.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    okBtn.addEventListener('click', function() {
      okCb();
      hide(modalContainer);
    });
    cancelBtn.addEventListener('click', function() {
      cancelCb();
      hide(modalContainer);
    });

    // Drag the header of modal to move around
    let toMove = false;
    let moveStartX;
    let moveStartY;
    let panelLeft;
    let panelTop;

    modalHeader.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const panelPosition = panelEl.getBoundingClientRect();

      panelLeft = panelPosition.left;
      panelTop = panelPosition.top;
      moveStartX = e.screenX;
      moveStartY = e.screenY;
      toMove = true;
    });
    modalHeader.addEventListener('mousemove', function(e) {
      if ( !toMove ) {
        return;
      }

      const targetX = e.screenX;
      const targetY = e.screenY;

      panelEl.style.top = `${(targetY - moveStartY) + panelTop}px`;
      panelEl.style.left = `${(targetX - moveStartX) + panelLeft}px`;
      panelEl.style.transform = 'translate(0, 0)';
    });
    modalHeader.addEventListener('mouseup', function(e) {
      toMove = false;
    });
    modalHeader.addEventListener('mouseleave', function(e) {
      toMove = false;
    });
    // \Drag the header of modal to move around

    return {
      show() {
        show(modalContainer);
      }
    };
  }

  global.modal = {
    init
  };
})(window);
