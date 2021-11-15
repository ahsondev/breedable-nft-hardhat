const fs = require('fs-extra')
const mergeImages = require('merge-images-v2')
const Canvas = require('canvas')
const metadata = require('../metadata/metadata.json')
const { traitSequence } = require('./metadata_rarity_config')

const mainDir = './metadata/assets'
const basicImageDir = './metadata/basic_assets'

function init() {
  fs.emptyDirSync(mainDir)
  if (!fs.existsSync(mainDir)) {
    fs.mkdirSync(mainDir)
  }
}

async function generate() {
  for (let index = 0; index < metadata.length; index += 1) {
    const tokenId = index.toString().padStart(5, "0")
    const metaItem = metadata[index]
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
    // console.log(images)
    const b64 = await mergeImages(images, {Canvas: Canvas})
    const base64Data = b64.replace(/^data:image\/png;base64,/, '')
    const binaryData = new Buffer(base64Data, 'base64').toString('binary')
    fs.writeFileSync(mainDir + `/image_${tokenId}.png`, binaryData, 'binary')
    console.log(tokenId)
  }
}

(async () => {
  init()
  console.log('removed old data')
  await generate()
})();
