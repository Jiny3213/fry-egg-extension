// Storage Area Explorer 扩展可以查看chrome.storage 中的数据
(async function() {
  // 定义搜索引擎
  const searchEngines = [
    {name: 'google', searchUrl: 'https://www.google.com/search?q=', active: true},
    {name: 'bing', searchUrl: 'https://cn.bing.com/search?q=', active: true},
    {name: 'bili', searchUrl: 'https://search.bilibili.com/all?keyword=', active: true},
    {name: 'github', searchUrl: 'https://github.com/search?q=', active: true}
  ]
  // 获取当前引擎
  const engines = await new Promise(resolve => {
      chrome.storage.sync.get('engines', data => {
        console.log('数据是', data)
        resolve(data.engines)
      })
    })

  // 判断是否沿用旧有的数据(上面的engines会更新)
  let shouldUpdate = false
  if(!engines || searchEngines.length !== engines.length) {
    shouldUpdate = true
  } else {
    for(let i=0; i<searchEngines; i++) {
      if(searchEngines[i].name !== engines[i].name) {
        shouldUpdate = true
        break
      }
    }
  }

  // 向content发送消息
  function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
        if(callback) callback(response);
      });
    });
  }


  new Vue({
    el: '#app',
    data: {
      engines: shouldUpdate ? searchEngines : engines
    },
    methods: {
      handleClickEngine(index) {
        this.engines[index].active = !this.engines[index].active
        chrome.storage.sync.set({engines: this.engines})
      },
      // bilibili 播放页 画面靠左
      floatLeft() {
        sendMessageToContentScript({cmd:'float-left'}, function(response) {
          console.log('来自content的回复：'+response);
        });
      },
      removeClass() {
        sendMessageToContentScript({cmd:'reset-class'}, function(response) {
          console.log('来自content的回复：'+response);
        });
      }
    }
  })
})()

