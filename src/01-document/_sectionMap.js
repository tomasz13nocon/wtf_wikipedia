/**
 * helper for looping around all sections of a document
 *
 * @private
 * @param {Document} doc the document with the sections
 * @param {string} fn the function name of the function that will be called
 * @param {string | number} [clue] the clue that will be used with the function
 * @returns {*[]|*} the array of item at the index of the clue
 */
const sectionMap = function (doc, fn, clue) {
  let arr = []
  doc.sections().forEach(sec => {
    let list = []
    if (typeof clue === 'string') {
      list = sec[fn](clue)
    } else {
      list = sec[fn]()
    }
    list.forEach(t => {
      arr.push(t)
    })
  })
  if (typeof clue === 'number') {
    return arr[clue]
  }
  return arr
}
module.exports = sectionMap
