document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const showModalBtn = $('#btn-show-modal');
  const showModalBtn2 = $('#btn-show-modal2');
  const modal= window.modal;

  const modal1 = modal.init({
    title: '弹窗标题弹窗标题弹窗标题',
    content: '弹窗内容',
    okCb: function() {
      console.log('ok');
    },
    cancelCb: function() {
      console.log('cancel');
    }
  });

  const modal2 = modal.init({
    title: '弹窗标题弹窗标题弹窗标题2',
    content: '<p>弹窗内容2</p><p>弹窗内容2</p><p>弹窗内容2</p><p>弹窗内容2</p><p>弹窗内容2</p>',
    okCb: function() {
      console.log('ok2');
    },
    cancelCb: function() {
      console.log('cancel2');
    }
  });

  showModalBtn.addEventListener('click', function() {
    modal1.show();
  });
  showModalBtn2.addEventListener('click', function() {
    modal2.show();
  });
});
