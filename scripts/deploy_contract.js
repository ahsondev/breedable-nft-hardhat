const hre = require('hardhat')
const fs = require('fs')
const config = require('../config')

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  const ERC721Config = require('../metadata/temp/ERC721Config.json')
  const contractconfig = require('../metadata/temp/contracturi.json')
  // const baseMetadataUri = ERC721Config.gatewayUrl + '/' + ERC721Config.metadataHash + '/'
  const baseMetadataUri = 'htpps://example.metadata.com/'
  const contractUri = ERC721Config.gatewayUrl + '/' + ERC721Config.contractUriHash
  const contractName = contractconfig.name
  const contractSymbol = contractconfig.symbol
  const tokenAmount = ERC721Config.tokenAmount

  let VRFCoordinator, LinkToken, keyhash

  switch (hre.network.name) {
    case 'kovan': {
      VRFCoordinator = config.VRFContract.Kovan.VRFCoordinator
      LinkToken = config.VRFContract.Kovan.LINKToken
      keyhash = config.VRFContract.Kovan.KeyHash
      break
    }

    case 'rinkeby': {
      VRFCoordinator = config.VRFContract.Rinkeby.VRFCoordinator
      LinkToken = config.VRFContract.Rinkeby.LINKToken
      keyhash = config.VRFContract.Rinkeby.KeyHash
      break
    }

    default:
      break
  }

  console.log('------')
  console.log('network name: ', hre.network.name)
  console.log('Deployer: ' + deployer)
  console.log('uri: ' + contractUri)
  console.log('name: ' + contractName)
  console.log('symbol: ' + contractSymbol)
  console.log('tokenAmount: ', tokenAmount)
  console.log('------')

  const BrainDanceNft = await ethers.getContractFactory('BrainDanceNft')
  const token = await BrainDanceNft.deploy(
    baseMetadataUri,
    // tokenAmount,
    VRFCoordinator,
    LinkToken,
    keyhash
  )

  const deployData = {
    contractAddress: token.address,
    baseMetadataUri,
    tokenAmount,
    deployer: deployer.address
  }
  fs.writeFileSync('./src/contracts/config.json', JSON.stringify(deployData, null, 2))

  const contractJson = require('../artifacts/contracts/BrainDanceNft.sol/BrainDanceNft.json')
  fs.writeFileSync('./src/contracts/BrainDanceNft.json', JSON.stringify(contractJson.abi, null, 2))

  console.log('Token address:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
