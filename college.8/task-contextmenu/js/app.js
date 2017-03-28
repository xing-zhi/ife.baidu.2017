document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const show = (el, display = 'block') => el.style.display = display;
  const hide = (el) => el.style.display = 'none';
  const setPosition = (el, which, v) => el.style[which] = v ? v + 'px' : 'initial';

  const contextmenuContainer = $('.contextmenu-container');
  const contextmenu = $('.contextmenu');

  // get the demension of contextmenu
  show(contextmenuContainer);
  setPosition(contextmenu, 'left', -1000);
  const concontextmenuDemension = contextmenu.getBoundingClientRect();
  hide(contextmenuContainer);
  const contextmenuWidth = concontextmenuDemension.width;
  const contextmenuHeight = concontextmenuDemension.height;

  window.oncontextmenu = function(e) {
    e.preventDefault();

    const x = e.x;
    const y = e.y;
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    const setPositionOfContextmenu = setPosition.bind(null, contextmenu);

    // set position of contentmenu
    setPositionOfContextmenu('left', x);
    setPositionOfContextmenu('top', y);
    setPositionOfContextmenu('right');
    setPositionOfContextmenu('bottom');

    if ( x + contextmenuWidth > viewportWidth ) {
      setPositionOfContextmenu('left');
      setPositionOfContextmenu('right', viewportWidth - x);
    }
    if ( y + contextmenuHeight > viewportHeight ) {
      setPositionOfContextmenu('top');
      setPositionOfContextmenu('bottom', viewportHeight - y);
    }
    // \set position of contentmenu

    show(contextmenuContainer);
  }

  contextmenuContainer.addEventListener('click', function(e) {
    hide(contextmenuContainer);
  });
  contextmenu.addEventListener('click', function(e) {
    const target = e.target;

    alert(target.textContent);
  });
});
