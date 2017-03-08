document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const setLeftHighestBtn = $('#btn-set-left-highest');
  const setRightHighestBtn = $('#btn-set-right-highest');
  const setMainHighestBtn = $('#btn-set-main-highest');
  const leftContainer = $('.left');
  const rightContainer = $('.right');
  const mainContainer = $('.main');

  const smallHeight = 300;
  const bigHeight = 400;

  setLeftHighestBtn.addEventListener('click', function() {
    leftContainer.style.height = `${bigHeight}px`;
    mainContainer.style.height = `${smallHeight}px`;
    rightContainer.style.height = `${smallHeight}px`;
  });
  setRightHighestBtn.addEventListener('click', function() {
    rightContainer.style.height = `${bigHeight}px`;
    leftContainer.style.height = `${smallHeight}px`;
    mainContainer.style.height = `${smallHeight}px`;
  });
  setMainHighestBtn.addEventListener('click', function() {
    mainContainer.style.height = `${bigHeight}px`;
    leftContainer.style.height = `${smallHeight}px`;
    rightContainer.style.height = `${smallHeight}px`;
  });
});
