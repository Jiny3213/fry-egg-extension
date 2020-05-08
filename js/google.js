// 修改a标签的默认行为, 在新标签页打开网页
window.onclick = e => {
  e.preventDefault()
  for(let el of e.path) {
    if(el.tagName === 'A' && el.href) {
      window.open(el.href, '_blank')
      break
    }
  }
}
