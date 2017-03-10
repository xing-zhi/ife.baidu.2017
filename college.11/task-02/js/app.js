document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const formEl = $('form');
  const inputEl = $('#name');
  const confirmBtn = $('#btn-confirm');
  const tipsEl = $('.tips');

  const errorClassName = 'error';
  const successClassName = 'success';
  const validations = {
    name:{
      checkList: [
        {
          type: 'required',
          msg: '名称不能为空'
        },
        {
          type: 'minLength',
          minLength: 4,
          msg: '名称长度不能少于4个字符'
        },
        {
          type: 'maxLength',
          maxLength: 16,
          msg: '名称长度不能长于16个字符'
        }

      ],
      passMsg: '名称格式正确'
    },
    pwd: {
      checkList: [
        {
          type: 'required',
          msg: '密码不能为空'
        },
        {
          type: 'minLength',
          minLength: 6,
          msg: `密码长度不能少于6个字符`
        },
        {
          type: 'maxLength',
          maxLength: 16,
          msg: `密码长度不能少于16个字符`
        }
      ],
      passMsg: '密码格式正确'
    },
    pwdToConfirm: {
      checkList: [
        {
          type: 'required',
          msg: '确认密码不能为空'
        },
        {
          type: 'equal',
          getValue: () => $('#pwd').value.trim(),
          msg: '两次密码不相同'
        },
      ],
      passMsg: '两次密码相同'
    },
    email: {
      checkList: [
        {
          type: 'required',
          msg: '邮箱不能为空'
        },
        {
          type: 'email',
          msg: '不是有效的邮箱'
        }
      ],
      passMsg: '邮箱格式正确'
    },
    tel: {
      checkList: [
        {
          type: 'required',
          msg: '手机不能为空'
        },
        {
          type: 'tel',
          msg: '不是有效的手机号码'
        }
      ],
      passMsg: '手机格式正确'
    }
  };

  function getStrLength(str) {
    const chineseCharAndFullWidthPuncRe = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/;

    return str
      .split('')
      .reduce((len, char) => len += chineseCharAndFullWidthPuncRe.test(char) ? 2 : 1, 0);
  }

  function validator(type, value) {
    const validation  = validations[type];
    const checkList = validation.checkList;
    const passMsg = validation.passMsg;
    const checkFns = {
      required(value) {
        // use != here to check both undefined and null
        return value != null && value !== '';
      },
      minLength(value, check) {
        return getStrLength(value) >= check.minLength;
      },
      maxLength(value, check) {
        return getStrLength(value) <= check.maxLength;
      },
      email(value) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(value);
      },
      tel(value) {
        const re = /^1([3,8]\d|4[5,7]|5[0,1,2,3,5,6,7,8,9]|7[0,6,7,8])\d{8}/;

        return re.test(value);
      },
      equal(value, check) {
        const valueToCompare = check.getValue();

        return value === valueToCompare;
      }
    };
    const notPassed = checkList.filter(item => !checkFns[item.type](value, item));

    const result = {};

    if ( notPassed.length ) {
      result.isValid = false;
      result.msg = notPassed[0].msg;
    } else {
      result.isValid = true;
      result.msg = validate.passMsg;
    }

    return result;
  }

  function showValidationResult(validation, inputEl, tipsEl) {
    const isValid = validation.isValid;
    const msg = validation.msg;

    if ( isValid ) {
      tipsEl.classList.remove(errorClassName);
      inputEl.classList.remove(errorClassName);
      tipsEl.classList.add(successClassName);
      inputEl.classList.add(successClassName);
    } else {
      tipsEl.classList.remove(successClassName);
      inputEl.classList.remove(successClassName);
      tipsEl.classList.add(errorClassName);
      inputEl.classList.add(errorClassName);
    }

    tipsEl.innerHTML = msg;
    tipsEl.style.display = 'block';
  }

  function validate(input) {
    const tipsEl = input.parentNode.nextElementSibling;
    const inputName = input.name;
    const inputValue = input.value.trim();
    const result = validator(inputName, inputValue);

    showValidationResult(result, input, tipsEl);

    return result;
  }

  function onFocusOrBlur(e) {
    const target = e.target;
    const tipsEl = target.parentNode.nextElementSibling;
    const eventType = e.type;

    // only handle the focus and blur of input element
    if ( target.tagName.toLowerCase() !== 'input' ) {
      return;
    }

    if ( eventType === 'focus' ) {
      tipsEl.style.display = 'block';
      return;
    }

    validate(target);
  }

  // focus and blur do not bubble up, but can be captured
  formEl.addEventListener('focus', onFocusOrBlur, true);
  formEl.addEventListener('blur', onFocusOrBlur, true);

  confirmBtn.addEventListener('click', function() {
    const inputs = document.querySelectorAll('form input');
    const hasUnvalidData = [].filter.call(inputs, (input) => {
      const result = validate(input);

      return !result.isValid;
    }).length;

    if ( hasUnvalidData ) {
      alert('输入有误！');
      return;
    }
  });
});
