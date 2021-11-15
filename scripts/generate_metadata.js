const {
  weights, prime, godMetadata, preDefinedTraits, exclusiveTraits, exclusivePrimaryRole
} = require('./metadata_rarity_config')
const fs = require('fs-extra')

const indexArr = [...prime]

function selectOneValue(trait_type, candidates = null) {
  let index = Object.keys(weights).findIndex(k => k === trait_type)
  if (index < 0) {
    index = 0
  }

  const trait_type_values = candidates ? weights[trait_type].filter(val => candidates.includes(val.name)) : weights[trait_type]
  // console.log("candidates: ", candidates)
  // console.log("trait_type_values: ", trait_type_values)
  let sum = 0;
  trait_type_values.forEach(val => sum += val.weight)
  if (!sum) {
    sum = 1
  }

  const random = indexArr[index] % sum
  indexArr[index] = random + prime[index]
  sum = 0
  for (let i = 0; i < trait_type_values.length; i += 1) {
    sum += trait_type_values[i].weight
    if (sum > random) {
      return trait_type_values[i].name
    }
  }

  return trait_type_values[trait_type_values.length - 1].name
}

function isExclusive(attributes, trait_type) {
  for (let trait in exclusiveTraits) {
    const attr = attributes.find(v => v.trait_type === trait)
    if (attr) {
      return exclusiveTraits[trait][attr.value].includes(trait_type)
    }
  }
  return false
}

async function generate(total) {
  const metadata = [ godMetadata ]

  for (let i = 1; i < total; i += 1) {
    const tokenId = i.toString().padStart(5, "0")
    const metaItem = {
      name: `NeuroDance #${tokenId}`,
      external_url: `https://api.neurodance.io/metadata/${tokenId}.json`,
      image: `https://api.neurodance.io/dancers/${tokenId}.png`,
      description: 'One of 10101 rare and powerful experiences!\nJoin us: https://discord.gg/neurodance',
      attributes: [],
    }

    // gender
    metaItem.attributes.push({
      trait_type: 'Body',
      value: i % 2 === 0 ? 'Male' : 'Female'
    })

    // Primary Role
    // const primaryRole = selectOneValue('Primary Role')
    // metaItem.attributes.push({
    //   trait_type: 'Primary Role',
    //   value: primaryRole
    // })

    for (let trait_type in weights) {
      if (preDefinedTraits.includes(trait_type)) {
        continue
      }

      if (isExclusive(metaItem.attributes, trait_type)) {
        continue
      }

      metaItem.attributes.push({
        trait_type,
        value: selectOneValue(trait_type)//exclusivePrimaryRole[primaryRole][trait_type] ? selectOneValue(trait_type, exclusivePrimaryRole[primaryRole][trait_type]) : selectOneValue(trait_type)
      })
    }

    metadata.push(metaItem)
  }

  fs.writeFileSync('./metadata/metadata.json', JSON.stringify(metadata, null, 2))
}

generate(10101)
