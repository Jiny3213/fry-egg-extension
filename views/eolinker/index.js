document.addEventListener('DOMContentLoaded', async function(){
  console.log('fry-egg-eolinker')
  injectCustomJs('utils/axios.js')
  injectCustomJs('views/eolinker/inject.js')
})

// 注入js
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'views/inject.js';
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function() {
    this.parentNode.removeChild(this);
  };
  document.body.appendChild(temp);
}