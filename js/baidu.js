document.addEventListener('DOMContentLoaded', function() {
  let hasInput = false
  let kw = document.getElementById('kw')
  let form = document.getElementById('form')
  let button = document.createElement('div')

  // 在百度首页输入任意内容时, 页面样式会发生改变
  kw.oninput = function() {
    hasInput = true
    button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn')
  }

  button.innerText = 'google 一下'
  button.onclick = function () {
    window.open(`https://www.google.com/search?q=${kw.value}`, '_blank')
  }

  // 初始化类名
  if(location.pathname === '/') {
    button.setAttribute('class', 'fe-btn fe-btn--index btn self-btn bg s_btn')
  } else {
    button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn')
  }

  // 原生交互体验
  button.onmouseleave = function() {
    if(location.pathname === '/' && !hasInput) {
      button.setAttribute('class', 'fe-btn fe-btn--index btn self-btn bg s_btn')
    } else {
      button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn')
    }
  }
  button.onmouseover = function() {
    if(location.pathname === '/' && !hasInput) {
      button.setAttribute('class', 'fe-btn fe-btn--index btn self-btn bg s_btn btnhover')
    } else {
      button.setAttribute('class', 'fe-btn fe-btn--normal bg s_btn btnhover')
    }
  }

  // 添加到dom中
  form.appendChild(button)
});
window.onload = function () {

}
