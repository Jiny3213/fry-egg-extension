console.log('fe-bilibili')

// 监听popup发送的消息, 为页面添加一个class改变其样式
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  if(request.cmd === 'test') {
    document.getElementsByClassName('v-wrap')[0].classList.add("fe-v-wrap")
  }
  sendResponse('已添加class: fe-v-wrap, bilibili页面更改为靠左样式');
});
