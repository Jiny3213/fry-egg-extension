console.log('background')
// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log("The color is green.");
//   });
// });

// 必须打开"persistent": true
// 当百度页面xhr完成后, 检查是否需要去除广告
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if(details.type === 'xmlhttprequest') {
      sendMessageToContentScript({cmd:'xhrCompleted'})
    }
    return {cancel: false};
  },
  {urls: ["*://www.baidu.com/s?*"]},
  []);

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if(callback) callback(response);
    });
  });
}
