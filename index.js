// 中文参考文章 https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html
// 英文官方文档 https://developer.chrome.com/extensions

let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
// 改变当前页面背景色
changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};
