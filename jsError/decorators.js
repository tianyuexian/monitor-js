/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-01-05 10:54:58
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-01-11 16:29:00
 */
export const utilDecorators = (targetClass) => {
  const prototype  =  targetClass.prototype

  // 根据event path整理数据
  prototype.getSelectors = (path) => {
    if(!Array.isArray(path)) return

    const selectors = path.reverse().filter(element => {
      return element !== document && element !== window
    }).map(element => {
      let selector = ""
      if(element.id) {
        return `${element.nodeName.toLowerCase()}#${element.id}`
      }else if(element.className && typeof element.className === 'string'){
        return `${element.nodeName.toLowerCase()}.${element.className}`
      }else{
        selector = element.nodeName.toLowerCase()
      }
      return selector
    }).join('>')

    return selectors
  }

  // 判断浏览器是否是onload状态
  prototype.checkLoaded = () => {
    return new Promise((resolve,reject)=>{
      if(document.readyState === 'complete') {
        resolve()
      }else {
        window.addEventListener('load',function(){
          resolve()
        })
      }
    })
  }


  prototype.timestampToTime = (timestamp)=> {
    const date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = date.getDate() + ' '
    const h = date.getHours() + ':'
    const m = date.getMinutes() + ':'
    const s = date.getSeconds()
    return Y + M + D + h + m + s
  }

  prototype.getUrlVars = (url) => {
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
  prototype.setUrl = (str) => {
    return str.replace(/&/g, '%26')
  }

}