/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-01-05 10:43:19
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-01-06 14:51:56
 */

// 获取用户最后一次操作
export const getLastEvent = function () {
  ['click','touchstart','mousedown','keydown','mouseover'].forEach(eventType => {
    document.addEventListener(eventType, (event) => {
      this.lastEvent = event
    }, {capture:true,passive:true})
  })
}
