/**
 * 在api详情页面刷新, 即可以在控制台中显示jsdoc
 */
console.log('eolinker inject')

// 转换类型
const PARAM_TYPE = {
  0: 'string',
  13: 'object',
  8: 'boolean',
  12: 'array',
  14: 'number'
}

// 获取jsdoc
function getJsDoc() {
  const apiID = location.hash.match(/apiID=(.*?)&/)[1]
  const projectHashKey = location.hash.match(/projectHashKey=(.*?)&/)[1]
  const spaceKey = location.hostname.match(/^(.*?)\./)[1]
  // 请求会自动带上各种cookie
  return axios.request({
    url: '/apiManagementPro/Api/getApi',
    method: "POST",
    data: `spaceKey=${spaceKey}&projectHashKey=${projectHashKey}&apiID=${apiID}`
  }).then(res => {
    const paramList = res.data.apiInfo.requestInfo
    const apiName = res.data.apiInfo.baseInfo.apiName
    console.log(paramList)
    let jsdoc = `/**\n`
    jsdoc += ` * ${apiName}\n`
    for(let item of paramList) {
      jsdoc += ` * @param {${PARAM_TYPE[item.paramType]}} ${item.paramNotNull === '1' ? '[' : ''}options.${item.paramKey}${item.paramNotNull === '1' ? ']' : ''} - ${item.paramName}\n`
    }
    jsdoc += ' */'
    return jsdoc
  })
}

// 这个网站的$与众不同, 会被封装成数组, 不知道是不是angular的原因
/**
 * 添加一个按钮, 复制jsdoc
 */
function addCopyBtn() {
  setTimeout(() => {
    let btn = $(`<button class="common-btn">复制JSDOC</button>`)
    btn.on('click', async () => {
      const jsdoc = await getJsDoc()
      console.log(jsdoc)
      // 复制到剪贴板
      const tmpDom = document.createElement('textarea')
      tmpDom.value = jsdoc
      document.body.appendChild(tmpDom)
      tmpDom.select()
      document.execCommand("Copy")
      document.body.removeChild(tmpDom)
    })
    $('.common-btn-list')[1].append(btn[0])
  }, 1000)
}

const main = () => {
  if(/api\/detail/.test(location.hash)) {
    addCopyBtn()
  }
  window.addEventListener("hashchange", () => {
    if(/api\/detail/.test(location.hash)) {
      addCopyBtn()
    }
  })
}

main()