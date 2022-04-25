/*
 * @Description:
 * @Author: tianyuexian
 * @Date: 2022-03-23 15:18:00
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-03-31 14:17:05
 */
const sourceMap = require('source-map')
const fs = require('fs')
const readFile = function(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function(error, data) {
      if (error) {
        console.log(error)
        return reject(error)
      }
      resolve(JSON.parse(data))
    })
  })
}

async function searchSource(filePath, line, column) {
  const rawSourceMap = await readFile(filePath)
  const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap)
  const res = consumer.originalPositionFor({
    'line': line,
    'column': column
  })
  consumer.destroy()
  console.log(res)
  return res
}

searchSource('/Users/didi/Documents/didi/zebra-bus-static/dist/zebra-bus-gov/zebra-bus-public/js/chunk-vendors.a94c4ae7.js.map', 137, 277688)
