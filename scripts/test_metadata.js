const metadata = require('../metadata/metadata.json')

function doTest(metadata, trait_type) {
  const res = {}
  metadata.forEach(metaItem => {
    metaItem.attributes.filter(attr => attr.trait_type === trait_type).forEach(attr => {
      if (!res[attr.value]) {
        res[attr.value] = 0
      }
      res[attr.value] += 1
    })
  })

  let sum = 0
  for (let k in res) {
    sum += res[k]
  }
  if (!sum) {
    sum = 1
  }

  const res1 = {}
  for (let k in res) {
    res1[k] = Math.round(res[k] / sum * 10000) / 100
  }
  console.log(trait_type, ':', res1)
}

doTest(metadata, 'Body')
doTest(metadata, 'Eyes')
doTest(metadata, 'Glasses')
doTest(metadata, 'Mouth')
doTest(metadata, 'Facial Costume')
doTest(metadata, 'Male Hair')
doTest(metadata, 'Female Hair')
doTest(metadata, 'Primary Role')

