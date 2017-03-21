var webPage = require('webpage');
var system = require('system');

var page = webPage.create();

if ( system.args.length === 1 ) {
  console.log('Usage: task.js <keyword>');
  phantom.exit();
}

//在PhantomJS中 执行JS函数的时候是不能直接使用Phantom的方法的。需要hook住alert方法，再使用alert来输出
page.onAlert = function(msg) {
  console.log('Alert', msg);
};
page.onError = function(msg) {
  console.log('Error', msg);
};

var keyword = system.args.slice(1).join(' ');
var startTime = Date.now();

page.injectJs('http://apps.bdimg.com/libs/jquery/1.6.4/jquery.js');
page.open("https://www.baidu.com", function(status) {
  if ( status !== 'success' ) {
    var now = Date.now();
    var result = {
      code: 0,
      msg: '抓取失败',
      word: keyword,
      time: now - startTime,
      dataList: []
    };

    console.log(JSON.stringify(result));
    phantom.exit();
  }

  page.evaluate(function(text) {
    $("#kw").val(text);
    $("#su").click();
  }, keyword);

  var timer = setInterval(function() {
    var results = page.evaluate(function() {
      const results = document.querySelectorAll('.c-container');

      if ( !results ) {
        return null;
      }

      return [].filter.call(results, function(result) {
        return !result.getAttribute('mu');
      }).map(function(result) {
        var title = result.querySelector('h3.t a').textContent;
        var info = result.querySelector('.c-abstract').textContent;
        var link = result.querySelector('.c-showurl');
        var pic = result.querySelector('.c-img');
        var data = {
          title: title,
          info: info,
          link: link.nodeName.toLowerCase() === 'a' ? link.href : link.textContent
        };

        data.pic = pic ? pic.src : '';

        return data;
      });
    });

    // check whether the page has rendered by test the results
    if ( !results ) {
      return;
    } else {
      clearInterval(timer);
    }

    var now = Date.now();
    var result = {
      code: 1,
      msg: '抓取成功',
      word: keyword,
      time: now - startTime,
      dataList: results
    };

    console.log(JSON.stringify(result));
    phantom.exit();
  }, 20);
});
