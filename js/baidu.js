document.addEventListener('DOMContentLoaded', async function() {
  // 在其他百度页面中不做任何事情
  if(location.pathname !== '/' && location.pathname !== '/s') return

  let hasInput = false
  let kw = document.getElementById('kw')
  let form = document.getElementById('form')
  let button = document.createElement('div')

  if(location.pathname === '/') {
    // 在百度首页输入任意内容时, 页面样式会发生改变
    kw.oninput = function() {
      hasInput = true
      button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn')
      form.appendChild(button)
      kw.oninput = null
    }
  } else if(location.pathname === '/s') {
    button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn')
    form.appendChild(button)
  }
  let engine = await new Promise((resolve, reject) => {
    chrome.storage.sync.get('engine', data => {
      resolve(data.engine)
    })
  })

  let searchUrl = await new Promise((resolve, reject) => {
    chrome.storage.sync.get('searchUrl', data => {
      resolve(data.searchUrl)
    })
  })
  button.innerText = `${engine} 一下`
  button.onclick = function () {
    window.open(`${searchUrl}${kw.value}`, '_blank')
  }

  // 原生交互体验
  button.onmouseleave = function() {
    button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn')
  }
  button.onmouseover = function() {
    button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn btnhover')
  }

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
