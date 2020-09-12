console.log('fire-egg-bilibili-extension')

// 监听popup发送的消息, 为页面添加一个class改变其样式, 使得页面元素靠左
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let inner = document.getElementsByClassName('v-wrap')
  // 番剧和普通稿件不同逻辑, 番剧把app居中，普通稿件把v-wrap居中
  let el = inner.length ? inner[0] : document.getElementById('app')

  if(request.cmd === 'float-left') {
    el.classList.add("app-float-left")
  }
  else if(request.cmd === 'reset-class') {
    el.classList.remove("app-float-left")
  }
  sendResponse('');
});


