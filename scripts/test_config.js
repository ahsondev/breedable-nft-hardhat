const { weights, traitSequence, godMetadata, exclusivePrimaryRole } = require('./metadata_rarity_config')

function doTestSequence() {
  console.log("\n----------------------- Sequence Testing -----------------------")
  const weightsKey = Object.keys(weights)
  console.log("Not included in traitSequence: ", weightsKey.filter(k => !traitSequence.includes(k)))
  console.log("Not included in weights: ", traitSequence.filter(k => !weightsKey.includes(k)))
  console.log("----------------------------------------------------------------\n")
}

function doTestGod() {
  console.log("\n----------------------- God Testing -----------------------")
  godMetadata.attributes.forEach(attr => {
    if (!weights[attr.trait_type]) {
      console.log(`Not exist - Trait Type: [${attr.trait_type}]`)
    } else if (!weights[attr.trait_type].find(val => val.name === attr.value)) {
      console.log(`Not exist - Trait Type: [${attr.trait_type}] Trait Value: [${attr.value}]`)
    }
  })
  console.log("----------------------------------------------------------------\n")
}

function doTestExclusivePrimaryRole() {
  console.log("\n----------------------- Exclusive PrimaryRole Testing -----------------------")
  for (let primary_value in exclusivePrimaryRole) {
    if (!weights['Primary Role'].find(val => val.name === primary_value)) {
      console.log(`Not exist - Primary Role Value: [${primary_value}]`)
      continue
    }

    for (let trait_type in exclusivePrimaryRole[primary_value]) {
      if (!weights[trait_type]) {
        console.log(`Not exist - Primary Role Value: [${primary_value}] Trait Type: [${trait_type}]`)
        continue
      }

      exclusivePrimaryRole[primary_value][trait_type].forEach(trait_value => {
        if (!weights[trait_type].find(val => val.name === trait_value)) {
          console.log(`Not exist - Primary Role Value: [${primary_value}] Trait Type: [${trait_type}] Trait Value: [${trait_value}]`)
        }
      })
    }
  }
  console.log("----------------------------------------------------------------\n")
}

doTestExclusivePrimaryRole()

