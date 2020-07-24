(async function() {
  // 定义搜索引擎
  const searchEngine = [
    {name: 'google', searchUrl: 'https://www.google.com/search?q='},
    {name: 'bing', searchUrl: 'https://cn.bing.com/search?q='},
    {name: 'bili', searchUrl: 'https://search.bilibili.com/all?keyword='},
    {name: 'github', searchUrl: 'https://github.com/search?q='}
  ]
  // 获取当前引擎
  const currentEngine = await new Promise(resolve => {
      chrome.storage.sync.get('engine', data => {
        console.log(data.engine)
        resolve(data.engine)
      })
    })
  const engineIndex = searchEngine.findIndex(item => item.name === currentEngine)
  new Vue({
    el: '#app',
    data: {
      currentEngine: engineIndex,
      engines: searchEngine
    },
    methods: {
      handleClickEngine(engine) {
        chrome.storage.sync.set({engine: engine.name, searchUrl: engine.searchUrl}, () => {
          this.currentEngine = this.engines.findIndex(item => item.name === engine.name)
        })
        chrome.storage.sync.set({engines: this.engines})
      }
    }
  })
})()

