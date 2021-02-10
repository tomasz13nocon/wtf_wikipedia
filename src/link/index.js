const Link = require('./Link')
const parseLinks = require('./parse')
// const i18n = require('../_data/i18n')
// const cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]', 'gi')

//return only rendered text of wiki links
const removeLinks = function(line) {
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$1')
  return line
}

const getLinks = function(data) {
  let wiki = data.text
  let links = parseLinks(wiki) || []

  data.ast = []
  let last = 0;
  for (let link of links) {
    if (last !== link.offset)
      data.ast.push({ type: "text", text: wiki.slice(last, link.offset) })
    //data.ast.push({ type: `${link.type} link`, instance: link, page: link.page, ...(link.text && {text: link.text}), ...(link.site && {href: link.site}) })
    data.ast.push(link)
    last = link.offset + link.raw.length + 1
    delete link.offset
  }
  if (last !== wiki.length)
    data.ast.push({ type: "text", text: wiki.slice(last, wiki.length) })
  
  data.links = links.map(link => {
    wiki = wiki.replace(link.raw, link.text || link.page || '')
    delete link.raw
    return new Link(link)
  })
  wiki = removeLinks(wiki)
  data.text = wiki
}
module.exports = getLinks
