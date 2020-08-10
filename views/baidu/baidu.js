document.addEventListener('DOMContentLoaded', async function() {
  // 在其他百度页面中不做任何事情
  if(location.pathname !== '/' && location.pathname !== '/s') return

  // 获取所有搜索引擎
  const engines = await new Promise(resolve => {
    chrome.storage.sync.get('engines', data => {
      console.log(data.engines)
      resolve(data.engines)
    })
  })
  let kw = $('#kw')

  function createBtns() {
    for (let item of engines) {
      if(item.active) {
        let button = $('<button class="bg s_btn" id="fe-btn"></button>')
        $('.bg.s_btn_wr').after(button);
        button.text(`${item.name} 一下`)
        button.on('click', () => {
          window.open(`${item.searchUrl}${kw.val()}`, '_blank')
        })
      }
    }
  }

  if(location.pathname === '/') {
    // 在百度首页输入任意内容时, 页面样式会发生改变, 此时生成搜索按钮
    kw.on('input', () => {
      createBtns()
      kw.off('input')
    })
  }
  else if(location.pathname === '/s') {
    createBtns()
  }

  // vue路由传参
  // 屏蔽某些网站的内容(首页)
  const resultArray = $('.result')
  const as = resultArray.children('h3').children('a')
  for(let i=0; i<as.length; i++) {
    if(/脚本之家/.test(as[i].text)) {
      resultArray[i].remove()
    }
  }

  // 去除广告
  removeAd()

  // 注入js, 改变ajax行为
  injectCustomJs()
});

// 去除第二页开始的底部广告
function removeAd() {
  let ads = document.getElementsByClassName('ec_tuiguang_pplink')
  if(ads.length) {
    for(let ad of ads) {
      ad.parentNode.parentNode.style.display = 'none'
    }
  }
}

// xhr结束消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request)
  if(request.cmd === 'xhrCompleted') {
    removeAd()
  }
  sendResponse()
});

// 注入js
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'js/inject.js';
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function() {
    this.parentNode.removeChild(this);
  };
  document.body.appendChild(temp);
}
