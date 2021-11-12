const fs = require('fs-extra')
const mergeImages = require('merge-images-v2')
const Canvas = require('canvas')
const metadata = require('../metadata/metadata.json')
const { traitSequence } = require('./metadata_rarity_config')

const mainDir = './metadata/assets'
const basicImageDir = './metadata/basic_image'

function init() {
  fs.emptyDirSync(mainDir)
  if (!fs.existsSync(mainDir)) {
    fs.mkdirSync(mainDir)
  }
}

function generate() {
  metadata.forEach((metaItem, index) => {
    const images = []
    const attrs = [...metaItem.attributes]
    attrs.sort(function (a, b) {
      const i1 = traitSequence.findIndex(trait => a.trait_type === trait) || -1
      const i2 = traitSequence.findIndex(trait => b.trait_type === trait) || -1
      return i1 < i2
    })
    attrs.forEach(attr => {
      images.push(`${basicImageDir}/${attr.trait_type}/${attr.value}.png`)
    })
    mergeImages(images, {Canvas: Canvas}).then((b64) => {
      const base64Data = b64.replace(/^data:image\/png;base64,/, '')
      const binaryData = new Buffer(base64Data, 'base64').toString('binary')
      fs.writeFileSync(mainDir + `/image_${index}.png`, binaryData, 'binary')
    })
  })
}

init()
generate()
