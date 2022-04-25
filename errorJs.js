(function(w, d) {
  // 错误监控配置
  const switchErr = true // 错误监控总开关

  // 请求发送函数
  const query = function(params) {
    // 多参数拼接
    const publickParam = window.errorCatchconfig || {}
    const config = {
      queryUrl: publickParam.queryUrl || '',
      timeout: publickParam.timeout || 4000
    }
    let args = ''
    params.userId = publickParam.userId || ''
    params.appId = publickParam.appId || ''
    for (const i in params) {
      if (args != '') {
        args += '&'
      }
      if (typeof params[i] === 'object') {
        args += i + '=' + encodeURIComponent(JSON.stringify(params[i]))
      } else {
        args += i + '=' + encodeURIComponent(params[i])
      }
    }
    // console.log('上报参数',decodeURIComponent(args))
    if (config.queryUrl) {
      const img = new Image()
      img.src = config.queryUrl + '?' + args

      const timer = setTimeout(function() {
        if (!img.complete) {
          img.src = ''
        }
        clearTimeout(timer)
      }, timeout)
    } else {
      console.error('错误监控没有传递请求前缀')
    }
  }

  // 时间处理
  function timestampToTime(timestamp) {
    const date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = date.getDate() + ' '
    const h = date.getHours() + ':'
    const m = date.getMinutes() + ':'
    const s = date.getSeconds()
    return Y + M + D + h + m + s
  }

  // url参数转对象
  function getUrlVars(url) {
    let hash
    const myJson = {}
    const hashes = url.slice(url.indexOf('?') + 1).split('&')
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=')
      myJson[hash[0]] = hash[1]
    }
    return myJson
  }

  // & 转换
  function setUrl(str) {
    return str.replace(/&/g, '%26')
  }

  // 接受口
  const errorMonitoring = function(params, shunt) {
    if (switchErr && (shunt === undefined ? shunt = true : shunt)) { // shunt为某种错误监控开关,不传默认为开启，如需要在某种错误监控时传值控制
      // vue错误路径url转换
      if (params.type === 'vue错误') {
        if (params.attrs.stack) {
          params.attrs.stack = setUrl(params.attrs.stack.split('\n')[1])
        }
      }
      const nowTime = Date.parse(new Date())
      const set = {
        url: setUrl(window.location.href),
        date: timestampToTime(nowTime),
        UserAgent: navigator.userAgent
      }
      const data = Object.assign(set, params)

      // 发送请求
      try {
        query(data)
      } catch (error) {
      }
    }
  }

  // vue错误上报
  const vueErrorCatch = function(Vue) {
    if (!Vue) return
    Vue.config.productionTip = false
    Vue.config.errorHandler = function(err, vm, info) {
      // 拦截之后vue不会在浏览器console中报错，必须要这样返回回去
      // console.log('这是一条vue报错信息-----',err)
      console.error(err)
      
      if(!err.message) return;
      const errObj = {
        type: 1,
        attrs: {
          errorMsg: err.message,
          error: err.stack,
          info: info,
          errorType: err.name
        }
      }
      try {
        // eslint-disable-next-line no-undef
        errorMonitoring(errObj)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 错误监视
  // js错误监控
  window.onerror = function(msg, url, line, col, error) {
    // console.log('这是一条js报错信息-----',err)
    // 没有URL/错误原因不上报
    if (error === null) {
      return
    }
    
    const errObj = {
      type: 0,
      attrs: {
        errUrl: setUrl(url),
        line: line,
        col: col,
        error: error.toString(),
        errorType: msg
      }
    }
    try {
      errorMonitoring(errObj)
    } catch (error) {
      console.log(error)
    }
  }

  //处理promise问题
  window.onunhandledrejection = function(error){
    if(!error.reason.message) return
    const errObj = {
      type: 3,
      attrs: {
        errorMsg: error.reason.message,
        error: error.reason.stack,
        info: error.reason.stack,
        errorType: error.type
      }
    }
    try {
      errorMonitoring(errObj)
    } catch (error) {
      console.log(error)
    }
  }

  // 手动错误上报
  const handleErrorCatch = function(params) {
    if (params) {
      if (!params.attrs || !params.attrs.error || !params.attrs.errorType) {
        console.error('手动错误上报：attrs参数内置需要有error和errorType属性')
        return
      }
      const errObj = {
        type: params.type || 2,
        attrs: params.attrs || {}
      }
      try {
        errorMonitoring(errObj)
      } catch (error) {
        console.log(error)
      }
    }
  }
  // eslint-disable-next-line
  return errorCatch = {
    errorMonitoring, vueErrorCatch, handleErrorCatch
  }
})(window, document)
