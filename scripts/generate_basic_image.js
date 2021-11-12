const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const { weights } = require('./metadata_rarity_config')

const basicDir = path.join(__dirname, '../metadata/basic_assets')

async function generate() {
  let index = 0
  for (let trait_type in weights) {
    const traitDir = basicDir + "/" + trait_type
    fs.mkdirSync(traitDir)
    console.log(`${traitDir} created`)
    for (let i = 0; i < weights[trait_type].length; i += 1) {
      const val = weights[trait_type][i]
      const newPath = `${basicDir}/${trait_type}/${val.name}.png`
      // const newPathResized = `${basicDir}/${trait_type}/${val.name}.png`
      await nodeHtmlToImage({
        transparent: true,
        output: newPath,
        html: `<html><body><div style="position: fixed; top: ${10 + index * 25}px;">${trait_type} : ${val.name}</div></body></html>`,
      })
      // .then(() => {
      //   // sharp(newPath)
      //   //   .resize(400, 600)
      //   //   .toFile(newPathResized, (err) => {
      //   //     // console.log('Resizing error')
      //   //     fs.unlink(newPath)
      //   //   })
      // }).catch((e) => console.log(e))
    }

    index += 1
  }
}

(async () => {
  fs.emptyDirSync(basicDir)
  console.log('removed old data')
  await generate()
})();


