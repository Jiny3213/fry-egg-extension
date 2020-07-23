document.addEventListener('DOMContentLoaded', async function() {
  // 在其他百度页面中不做任何事情
  if(location.pathname !== '/' && location.pathname !== '/s') return

  let kw = $('#kw')
  const button = $('<button class="bg s_btn" id="fe-btn"></button>')

  if(location.pathname === '/') {
    // 在百度首页输入任意内容时, 页面样式会发生改变, 此时生成搜索按钮
    kw.on('input', () => {
      $('.bg.s_btn_wr').after(button);
      kw.off('input')
    })
  } else if(location.pathname === '/s') {
    $('.bg.s_btn_wr').after(button);
  }

  // 获取当前的搜索引擎
  let engine = await new Promise((resolve, reject) => {
    chrome.storage.sync.get('engine', data => {
      resolve(data.engine)
    })
  })
  // 获取搜索链接
  let searchUrl = await new Promise((resolve, reject) => {
    chrome.storage.sync.get('searchUrl', data => {
      resolve(data.searchUrl)
    })
  })
  button.text(`${engine} 一下`)
  button.on('click', () => {
    window.open(`${searchUrl}${kw.value}`, '_blank')
  })

  // 去除广告
  removeAd()
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
  if(request.cmd === 'xhrCompleted') {
    removeAd()
  }
  sendResponse()
});
