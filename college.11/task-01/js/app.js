document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const inputEl = $('#name');
  const confirmBtn = $('#btn-confirm');
  const tipsEl = $('.tips');

  const errorClassName = 'error';
  const successClassName = 'success';
  const minLength = 4;
  const maxLength = 16;
  const tipsMap = new Map()
          .set('default', '必填，长度为4～16个字符')
          .set('empty', '名称不能为空')
          .set('tooShort', '名称长度不能少于4个字符')
          .set('tooLong', '名称长度不能大于16个字符')
          .set('pass', '名称格式正确');

  function getStrLength(str) {
    const chineseCharAndFullWidthPuncRe = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/;

    return str
      .split('')
      .reduce((len, char) => len += chineseCharAndFullWidthPuncRe.test(char) ? 2 : 1, 0);
  }

  confirmBtn.addEventListener('click', function() {
    const name = inputEl.value.trim();
    const length = getStrLength(name);

    if ( length >= minLength && length <= maxLength ) {
      tipsEl.classList.remove(errorClassName);
      inputEl.classList.remove(errorClassName);
      tipsEl.classList.add(successClassName);
      inputEl.classList.add(successClassName);
      tipsEl.innerHTML = tipsMap.get('pass');

      return;
    }

    tipsEl.classList.remove(successClassName);
    inputEl.classList.remove(successClassName);
    tipsEl.classList.add(errorClassName);
    inputEl.classList.add(errorClassName);

    let errorMessage = '';

    if ( !name ) {
      errorMessage = tipsMap.get('empty');
    }

    if ( length < minLength ) {
      errorMessage = tipsMap.get('tooShort');
    }

    if ( length > maxLength ) {
      errorMessage = tipsMap.get('tooLong');
    }

    tipsEl.innerHTML = errorMessage;
  });
});
