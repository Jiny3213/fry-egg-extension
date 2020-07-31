console.log('inject')
// inject.js不用刷新扩展程序即可更新, 因为content_Script会动态调用它

// 拦截方法一
// https://stackoverflow.com/questions/16959359/intercept-xmlhttprequest-and-modify-responsetext
// 这个方法有两个魔幻的点, 一个是delete responseText之后仍然能拿到responseText, 只不过其上面的defineProperty会失效, 换成普通的对象delete后永远都是undefined了
// 通过上面这个特性, 每次get responseText 的时候都要先把responseText 删掉, 防止无限循环get, 在操作完responseText之后再把getter放回去responseText, 下次再get的时候也会触发

// var rawOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function() {
//   // if(arguments[1].match(/email/)) {
//   //   console.log(this)
//     setupHook(this);
//   // }
//   rawOpen.apply(this, arguments);
// }
//
// function setupHook(xhr) {
//   function getter() {
//     console.log('get responseText');
//     // 不delete会一直get, 但实在搞不懂这句是为什么
//     // 先把这个干掉, 防止循环引用??
//     delete xhr.responseText;
//     var ret = xhr.responseText;
//     console.log(ret) // 并不会undefined
//     // 原来的responseText被delete了, 其上面的getter没有了, 要重新设置
//     setup();
//     return ret
//   }
//
//   function setter(str) {
//     console.log('set responseText: %s', str);
//   }
//
//   function setup() {
//     Object.defineProperty(xhr, 'responseText', {
//       get: getter,
//       set: setter,
//       configurable: true,
//     });
//   }
//   setup();
// }

// 拦截方法二, 可以
// https://stackoverflow.com/questions/18310484/modify-http-responses-from-a-chrome-extension
// var _open = XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function (method, URL) {
//   console.log('opening!')
//   // 网站设置onreadystatechange时会设置到_中,
//   var _onreadystatechange = this.onreadystatechange,
//     // 这里用_this只是为了方便往下一个函数里传递
//     _this = this;
//   // console.log(_this.onreadystatechange == _onreadystatechange) // true
//   _this.onreadystatechange = function () {
//     // catch only completed 'api/search/universal' requests
//     // if (_this.readyState === 4 && _this.status === 200 && ~URL.indexOf('api/search/universal')) {
//     if (_this.readyState === 4 && _this.status === 200) {
//
//         try {
//         //////////////////////////////////////
//         // THIS IS ACTIONS FOR YOUR REQUEST //
//         //             EXAMPLE:             //
//         //////////////////////////////////////
//         var data = JSON.parse(_this.responseText); // {"fields": ["a","b"]}
//         console.log('responseText', data)
//         if (data.fields) {
//           data.fields.push('c','d');
//         }
//
//         // rewrite responseText
//         Object.defineProperty(_this, 'responseText', {value: JSON.stringify(data)});
//         /////////////// END //////////////////
//       } catch (e) {
//           console.error(e)
//       }
//
//       console.log('Caught! :)', method, URL, _this.responseText);
//     }
//     // call original callback
//     if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
//   };
//
//   // detect any onreadystatechange changing
//   Object.defineProperty(this, "onreadystatechange", {
//     get: function () {
//       return _onreadystatechange;
//     },
//     set: function (value) {
//       _onreadystatechange = value;
//     }
//   });
//
//   return _open.apply(_this, arguments);
// };

  // 第三种方法, console not defined
// (function(xhr) {
//
//   var XHR = XMLHttpRequest.prototype;
//
//   var open = XHR.open;
//   var send = XHR.send;
//   var setRequestHeader = XHR.setRequestHeader;
//
//   XHR.open = function(method, url) {
//     this._method = method;
//     this._url = url;
//     this._requestHeaders = {};
//     this._startTime = (new Date()).toISOString();
//
//     return open.apply(this, arguments);
//   };
//
//   XHR.setRequestHeader = function(header, value) {
//     this._requestHeaders[header] = value;
//     return setRequestHeader.apply(this, arguments);
//   };
//
//   XHR.send = function(postData) {
//
//     this.addEventListener('load', function() {
//       var endTime = (new Date()).toISOString();
//
//       var myUrl = this._url ? this._url.toLowerCase() : this._url;
//       if(myUrl) {
//
//         if (postData) {
//           if (typeof postData === 'string') {
//             try {
//               // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
//               this._requestHeaders = postData;
//             } catch(err) {
//               console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
//               console.log(err);
//             }
//           } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
//             // do something if you need
//           }
//         }
//
//         // here you get the RESPONSE HEADERS
//         var responseHeaders = this.getAllResponseHeaders();
//
//         if ( this.responseType != 'blob' && this.responseText) {
//           // responseText is string or null
//           try {
//
//             // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
//             var arr = this.responseText;
//
//             // printing url, request headers, response headers, response body, to console
//
//             console.log(this._url);
//             console.log(JSON.parse(this._requestHeaders));
//             console.log(responseHeaders);
//             console.log(JSON.parse(arr));
//
//           } catch(err) {
//             console.log("Error in responseType try catch");
//             console.log(err);
//           }
//         }
//
//       }
//     });
//
//     return send.apply(this, arguments);
//   };
//
// })(XMLHttpRequest);

// 普通的对象与responseText对比
// let a = {
//   a: 1
// }
// var rawOpen = XMLHttpRequest.prototype.open;
//
// function setupHook(a) {
//   function getter() {
//     console.log('get a');
//     // 不delete会一直get, 但实在搞不懂这句是为什么
//     // 先把这个干掉, 防止循环引用??
//     delete a.a;
//     var ret = a.a;
//     console.log(ret) // 并不会undefined
//     // 原来的responseText被delete了, 其上面的getter没有了, 要重新设置
//     setup();
//     return ret
//   }
//
//   function setter(str) {
//     console.log('set responseText: %s', str);
//   }
//
//   function setup() {
//     Object.defineProperty(a, 'a', {
//       get: getter,
//       set: setter,
//       configurable: true,
//     });
//   }
//   setup();
// }
// setupHook(a)

// let rawOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function() {
//   change(this);
//   rawOpen.apply(this, arguments);
// }
// function change(xhr) {
//   xhr._onreadystatechange = null
//   Object.defineProperty(xhr, 'onreadystatechange', {
//     get: () => {
//       console.log('get')
//       return xhr._onreadystatechange
//     },
//     set: val => {
//       console.log('setting')
//       xhr._onreadystatechange = val
//       console.log(xhr._onreadystatechange)
//     },
//     configurable: true,
//
//   })
// }
