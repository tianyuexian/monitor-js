/*
 * @Description: ()
 * @Author: tianyuexian
 * @Date: 2022-01-04 17:13:33
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-03-17 11:50:28
 */
import JsError from '../jsError/index.js'
import {vueErrorCatch} from '../jsError/vueErrorCatch.js'
import {handleErrorCatch} from '../jsError/handleErrorCatch'
import {getLastEvent} from '../jsError/getEvent'
import {blankScreen} from '../jsError/blankScreen'

JsError.prototype.vueErrorCatch = vueErrorCatch
JsError.prototype.handleErrorCatch = handleErrorCatch
JsError.prototype.getLastEvent = getLastEvent
JsError.prototype.blankScreen = blankScreen

const jsErrorReport = function(params) {
  return new JsError(params)
}

export default jsErrorReport