(async function() {
  // 定义搜索引擎
  const searchEngine = [
    {name: 'google', searchUrl: 'https://www.google.com/search?q='},
    {name: 'bing', searchUrl: 'https://cn.bing.com/search?q='},
    {name: 'bili', searchUrl: 'https://search.bilibili.com/all?keyword='}
  ]

  const currentEngine = await new Promise(resolve => {
      chrome.storage.sync.get('engine', data => {
        console.log(data.engine)
        resolve(data.engine)
      })
    })

// 创建元素并添加到dom中
  const main = document.getElementById('main')
  const btns = searchEngine.map(engine => {
    let btn = document.createElement('button')
    btn.innerText = engine.name
    if(engine.name === currentEngine) {
      btn.style.background = 'red'
    }
    btn.onclick = () => {
      chrome.storage.sync.set({engine: engine.name, searchUrl: engine.searchUrl}, () => {
        clearBgColor(btns)
        btn.style.background = 'red'
      })
    }
    return btn
  })

  for(let btn of btns) {
    main.appendChild(btn)
  }


  function clearBgColor(element) {
    if(element.length) {
      for(let el of element) {
        el.style.background = 'none'
      }
    } else {
      element.style.background = 'none'
    }
  }
})()

