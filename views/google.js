console.log('fe-google')

// don't work
// const _addEventListener = EventTarget.prototype.addEventListener
// EventTarget.prototype.addEventListener = function(type, listener, useCapture=false) {
//   console.log(type, 'is add')
//   _addEventListener.apply(this, arguments)
// }


// getEventListeners is only defined in console when devtools is opened.
// https://stackoverflow.com/questions/63040475/uncaught-referenceerror-geteventlisteners-is-not-defined
// document.addEventListener('DOMContentLoaded', () => {
//   const html = document.getElementsByTagName('html')[0]
//   const app = document.getElementsByTagName('ytd-app')[0]
//   html.removeEventListener('click', getEventListeners(html).click[0].listener)
//   app.removeEventListener('click', getEventListeners(app).click[0].listener)
// })

// you just can't remove eventListener
// https://stackoverflow.com/questions/4386300/javascript-dom-how-to-remove-all-events-of-a-dom-object


// 修改a标签的默认行为, 在新标签页打开网页
window.onclick = e => {
  // console.log('是否可以取消, ', e.cancelable)
  // console.log(e)
  // document.getElementsByTagName('ytd-app')[0].removeEventListener('click', arguments.callee)
  // document.getElementsByTagName('html')[0].removeEventListener('click', arguments.callee)
  e.preventDefault()
  e.stopImmediatePropagation()
  // e.stopPropagation()
  for(let el of e.path) {
    if(el.tagName === 'A' && el.href) {
      window.open(el.href, '_blank')
      break
    }
  }
}
